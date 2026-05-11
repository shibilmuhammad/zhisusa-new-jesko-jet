"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useImagePreloader(path: string, frameCount: number) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const getImages = useCallback(() => imagesRef.current, []);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = new Array(frameCount);
    let cancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `${path}/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

        img.onload = () => {
          if (cancelled) return;
          imgArray[index] = img;
          loadedCount++;
          setProgress(loadedCount / frameCount);
          if (loadedCount === frameCount) {
            imagesRef.current = imgArray;
            setLoaded(true);
          }
          resolve();
        };

        img.onerror = () => {
          if (cancelled) return;
          console.warn(`Failed to load frame: ${img.src}`);
          loadedCount++;
          setProgress(loadedCount / frameCount);
          if (loadedCount === frameCount) {
            imagesRef.current = imgArray;
            setLoaded(true);
          }
          resolve();
        };
      });
    };

    // Load images with concurrency control to prevent overwhelming the browser
    const BATCH_SIZE = 10;
    const loadBatch = async () => {
      for (let i = 0; i < frameCount; i += BATCH_SIZE) {
        if (cancelled) return;
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, frameCount); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [path, frameCount]);

  return { images: getImages, loaded, progress };
}
