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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafIdRef = useRef(0);

  // ── Draw a single frame (object-fit: cover) ──
  const draw = useCallback((img: HTMLImageElement) => {
    const ctx = ctxRef.current;
    const c = canvasRef.current;
    if (!ctx || !c || !img || !img.naturalWidth) return;

    const cw = c.width;
    const ch = c.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ── Size the canvas buffer to match screen ──
  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    // Cap DPR at 1.5 for performance — no visual difference on most screens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const r = c.getBoundingClientRect();
    if (c.width !== Math.floor(r.width * dpr) || c.height !== Math.floor(r.height * dpr)) {
      c.width = Math.floor(r.width * dpr);
      c.height = Math.floor(r.height * dpr);
    }
  }, []);

  // ── 1. Init context + size canvas on mount ──
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    ctxRef.current = c.getContext("2d", {
      alpha: false,
      desynchronized: true, // Hints browser to reduce latency
    });
    sizeCanvas();

    const onResize = () => {
      sizeCanvas();
      // Redraw current frame after resize
      const img = imagesRef.current[Math.max(0, currentFrameRef.current)];
      if (img) draw(img);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sizeCanvas, draw]);

  // ── 2. Load all images with priority loading strategy ──
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = new Array(frameCount);

    const onImageLoaded = (i: number, img: HTMLImageElement) => {
      if (cancelled) return;
      imgs[i] = img;
      loadedCount++;

      // Draw frame 0 the instant it arrives — kills the black screen
      if (i === 0) {
        imagesRef.current = imgs;
        sizeCanvas();
        draw(img);
        currentFrameRef.current = 0;
      }

      onLoadProgress?.(loadedCount / frameCount);

      if (loadedCount === frameCount) {
        imagesRef.current = imgs;
        onLoaded?.();
      }
    };

    const loadImage = (i: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = `${path}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

        img.onload = () => {
          onImageLoaded(i, img);
          resolve();
        };
        img.onerror = () => {
          if (!cancelled) {
            loadedCount++;
            onLoadProgress?.(loadedCount / frameCount);
            if (loadedCount === frameCount) {
              imagesRef.current = imgs;
              onLoaded?.();
            }
          }
          resolve();
        };
      });
    };

    // Load first 5 frames eagerly for instant responsiveness
    const loadSequentially = async () => {
      // Priority: load frames 0-4 first
      for (let i = 0; i < Math.min(5, frameCount); i++) {
        await loadImage(i);
        if (cancelled) return;
      }

      // Then load remaining frames in parallel batches of 8
      const batchSize = 8;
      for (let start = 5; start < frameCount; start += batchSize) {
        const batch = [];
        for (let i = start; i < Math.min(start + batchSize, frameCount); i++) {
          batch.push(loadImage(i));
        }
        await Promise.all(batch);
        if (cancelled) return;
      }
    };

    loadSequentially();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, frameCount]);

  // ── 3. Scroll → frame sync via direct RAF polling ──
  // This is smoother than onChange because we sync on every paint frame
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;

      const v = progress.get();
      const imgs = imagesRef.current;

      if (imgs.length > 0) {
        const idx = Math.min(
          Math.max(Math.round(v * (frameCount - 1)), 0),
          frameCount - 1
        );

        if (idx !== currentFrameRef.current) {
          currentFrameRef.current = idx;
          const img = imgs[idx];
          if (img) draw(img);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [progress, frameCount, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        willChange: "contents",
      }}
      aria-hidden="true"
    />
  );
}
