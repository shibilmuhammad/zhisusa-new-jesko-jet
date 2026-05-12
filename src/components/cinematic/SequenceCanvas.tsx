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
  // Store raw ImageBitmaps (off-main-thread decoded, GPU ready)
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(new Array(frameCount).fill(null));
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number | null>(null);
  const lastProgressEmitRef = useRef(0);

  // ── Draw a GPU bitmap with dynamic cover scaling ──
  const drawBitmap = useCallback((bitmap: ImageBitmap) => {
    const ctx = ctxRef.current;
    const c = canvasRef.current;
    if (!ctx || !c) return;

    const cw = c.width;
    const ch = c.height;
    const scale = Math.max(cw / bitmap.width, ch / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    
    // Fast GPU blit with scaling
    ctx.drawImage(bitmap, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ── Draw frame by index ──
  const drawFrame = useCallback((idx: number) => {
    const bitmaps = bitmapsRef.current;
    const bitmap = bitmaps[idx];
    if (bitmap) {
      drawBitmap(bitmap);
      return;
    }
    // Prefer the current frame if available to avoid O(n) scans per wheel tick.
    if (currentFrameRef.current >= 0 && bitmaps[currentFrameRef.current]) {
      drawBitmap(bitmaps[currentFrameRef.current]!);
      return;
    }
    // Bounded search for a nearby decoded frame while loading.
    for (let d = 1; d <= 8; d++) {
      if (idx - d >= 0 && bitmaps[idx - d]) {
        drawBitmap(bitmaps[idx - d]!);
        return;
      }
      if (idx + d < frameCount && bitmaps[idx + d]) {
        drawBitmap(bitmaps[idx + d]!);
        return;
      }
    }
  }, [drawBitmap, frameCount]);

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
    const bitmaps: (ImageBitmap | null)[] = new Array(frameCount).fill(null);
    bitmapsRef.current = bitmaps;

    const onImageLoaded = async (i: number, blob: Blob) => {
      if (cancelled) return;
      try {
        // Decode off main thread
        const bitmap = await createImageBitmap(blob);
        if (cancelled) {
          bitmap.close();
          return;
        }
        
        bitmaps[i] = bitmap;
        loadedCount++;

        // Draw frame 0 immediately
        if (i === 0) {
          sizeCanvas();
          drawBitmap(bitmap);
          currentFrameRef.current = 0;
        } else if (i === currentFrameRef.current) {
          drawBitmap(bitmap);
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
      } catch (e) {
        // Ignore decode errors
      }
    };

    const loadImage = async (i: number) => {
      try {
        const response = await fetch(`${path}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`);
        if (!response.ok) throw new Error("Failed to fetch");
        const blob = await response.blob();
        await onImageLoaded(i, blob);
      } catch (e) {
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
      }
    };

    const loadAll = async () => {
      // Prioritize first 5 frames sequentially
      for (let i = 0; i < Math.min(5, frameCount); i++) {
        await loadImage(i);
        if (cancelled) return;
      }
      
      // Load the rest in small batches to prevent network/CPU choking
      const batchSize = 2;
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
      // Note: we don't close bitmaps here because React Strict Mode
      // would close them immediately on mount/unmount cycle
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
