"use client";

import { useEffect, useRef, useCallback } from "react";
import { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const currentFrameRef = useRef<number>(-1);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(false);
  const isLoadedState = useRef(false);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // ───────────────────────────────────────────────
  // 1. SET UP CANVAS CONTEXT — once, immediately
  // ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use willReadFrequently: false + alpha: false for best GPU-composited perf
    contextRef.current = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true, // Reduces latency on supported browsers
    });
  }, []);

  // ───────────────────────────────────────────────
  // 2. RESIZE HANDLER — set canvas buffer size to match CSS size × DPR
  // ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      // Only resize if dimensions actually changed
      if (w !== dimensionsRef.current.width || h !== dimensionsRef.current.height) {
        canvas.width = w;
        canvas.height = h;
        dimensionsRef.current = { width: w, height: h };

        // Redraw current frame if we have images
        if (loadedRef.current && currentFrameRef.current >= 0) {
          const img = imagesRef.current[currentFrameRef.current];
          if (img) drawFrame(img);
        }
      }
    };

    setCanvasSize();

    // Debounce resize to 150ms
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(setCanvasSize, 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───────────────────────────────────────────────
  // 3. DRAW FRAME — object-fit: cover math, no allocations per call
  // ───────────────────────────────────────────────
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // object-fit: cover
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ───────────────────────────────────────────────
  // 4. PRELOAD ALL IMAGES — aggressive parallel loading
  // ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = new Array(frameCount);

    // Load all images in parallel — browsers cap concurrent
    // connections per domain (~6-12), so this is naturally throttled
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `${path}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        loaded++;
        onLoadProgress?.(loaded / frameCount);

        // Draw first frame as soon as it arrives
        if (i === 0 && canvasRef.current) {
          drawFrame(img);
          currentFrameRef.current = 0;
        }

        if (loaded === frameCount) {
          imagesRef.current = images;
          loadedRef.current = true;
          isLoadedState.current = true;
          onLoaded?.();
        }
      };

      img.onerror = () => {
        if (cancelled) return;
        loaded++;
        onLoadProgress?.(loaded / frameCount);
        if (loaded === frameCount) {
          imagesRef.current = images;
          loadedRef.current = true;
          isLoadedState.current = true;
          onLoaded?.();
        }
      };
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, frameCount]);

  // ───────────────────────────────────────────────
  // 5. SCROLL → FRAME sync — direct RAF, no batching overhead
  // ───────────────────────────────────────────────
  useEffect(() => {
    let raf = 0;

    const unsubscribe = progress.on("change", (v) => {
      if (!loadedRef.current) return;

      const idx = Math.min(
        Math.max(Math.round(v * (frameCount - 1)), 0),
        frameCount - 1
      );

      // Only redraw if the frame actually changed
      if (idx === currentFrameRef.current) return;
      currentFrameRef.current = idx;

      const img = imagesRef.current[idx];
      if (!img) return;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => drawFrame(img));
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
    };
  }, [progress, frameCount, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full h-full", className)}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
