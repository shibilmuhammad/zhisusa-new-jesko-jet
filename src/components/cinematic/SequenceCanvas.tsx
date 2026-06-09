"use client";

import { useEffect, useRef, useCallback } from "react";
import { MotionValue } from "framer-motion";

interface SequenceCanvasProps {
  path: string;
  frameCount: number;
  progress: MotionValue<number>;
  className?: string;
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function SequenceCanvas({
  path,
  frameCount,
  progress,
  className = "",
  onLoadProgress,
  onLoaded,
}: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  // Store HTMLImageElements instead of raw ImageBitmaps to allow the browser to manage memory
  // and prevent iOS Safari memory exhaustion crashes.
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number | null>(null);
  const lastProgressEmitRef = useRef(0);

  // ── Draw a GPU bitmap with dynamic cover scaling ──
  const drawImage = useCallback((img: HTMLImageElement) => {
    const ctx = ctxRef.current;
    const c = canvasRef.current;
    if (!ctx || !c) return;

    const cw = c.width;
    const ch = c.height;
    const scale = Math.max(cw / img.width, ch / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    
    // Fast GPU blit with scaling
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ── Draw frame by index ──
  const drawFrame = useCallback((idx: number) => {
    const images = imagesRef.current;
    const img = images[idx];
    if (img) {
      drawImage(img);
      return;
    }
    // Prefer the current frame if available to avoid O(n) scans per wheel tick.
    if (currentFrameRef.current >= 0 && images[currentFrameRef.current]) {
      drawImage(images[currentFrameRef.current]!);
      return;
    }
    // Bounded search for a nearby decoded frame while loading.
    for (let d = 1; d <= 8; d++) {
      if (idx - d >= 0 && images[idx - d]) {
        drawImage(images[idx - d]!);
        return;
      }
      if (idx + d < frameCount && images[idx + d]) {
        drawImage(images[idx + d]!);
        return;
      }
    }
  }, [drawImage, frameCount]);

  // Coalesce multiple frame requests into one draw per paint.
  const scheduleDraw = useCallback(
    (idx: number) => {
      pendingFrameRef.current = idx;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const frameToDraw = pendingFrameRef.current;
        if (frameToDraw == null) return;
        pendingFrameRef.current = null;
        drawFrame(frameToDraw);
      });
    },
    [drawFrame]
  );

  // ── Size the canvas buffer ──
  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    // DPR = 1 is often enough for videos, or min(DPR, 1.5)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(r.width * dpr);
    const h = Math.floor(r.height * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
  }, []);

  // ── 1. Init context + size canvas ──
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    ctxRef.current = c.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    sizeCanvas();

    let resizeTimer: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeCanvas();
        drawFrame(Math.max(0, currentFrameRef.current));
      }, 100);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [sizeCanvas, drawFrame]);

  // ── 2. Load and decode all images asynchronously ──
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    imagesRef.current = images;

    const onImageLoaded = (i: number, img: HTMLImageElement) => {
      if (cancelled) return;
      
      images[i] = img;
      loadedCount++;

      // Draw frame 0 immediately
      if (i === 0) {
        sizeCanvas();
        drawImage(img);
        currentFrameRef.current = 0;
      } else if (i === currentFrameRef.current) {
        drawImage(img);
      }

      const loadProgress = loadedCount / frameCount;
      if (
        loadProgress >= 1 ||
        loadProgress - lastProgressEmitRef.current >= 0.03 ||
        loadProgress < lastProgressEmitRef.current
      ) {
        lastProgressEmitRef.current = loadProgress;
        onLoadProgress?.(loadProgress);
      }
      if (loadedCount === frameCount) onLoaded?.();
    };

    const loadImage = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          onImageLoaded(i, img);
          resolve();
        };
        img.onerror = () => {
          if (!cancelled) {
            loadedCount++;
            const loadProgress = loadedCount / frameCount;
            if (
              loadProgress >= 1 ||
              loadProgress - lastProgressEmitRef.current >= 0.03 ||
              loadProgress < lastProgressEmitRef.current
            ) {
              lastProgressEmitRef.current = loadProgress;
              onLoadProgress?.(loadProgress);
            }
            if (loadedCount === frameCount) onLoaded?.();
          }
          resolve(); // Resolve anyway to continue loading others
        };
        img.src = `${path}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      });
    };

    const loadAll = async () => {
      // Prioritize first 5 frames sequentially
      for (let i = 0; i < Math.min(5, frameCount); i++) {
        await loadImage(i);
        if (cancelled) return;
      }
      
      // Load the rest in small batches to prevent network/CPU choking
      const batchSize = 4;
      for (let start = 5; start < frameCount; start += batchSize) {
        const batch = [];
        for (let i = start; i < Math.min(start + batchSize, frameCount); i++) {
          batch.push(loadImage(i));
        }
        await Promise.all(batch);
        if (cancelled) return;
      }
    };

    loadAll();

    return () => { 
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, frameCount]);

  // ── 3. Scroll → frame sync via onChange (fires synchronously in FM loop) ──
  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      const clamped = Math.max(0, Math.min(1, v));
      const idx = Math.min(
        Math.max(Math.round(clamped * (frameCount - 1)), 0),
        frameCount - 1
      );

      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        scheduleDraw(idx);
      }
    });

    return () => unsub();
  }, [progress, frameCount, scheduleDraw]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
