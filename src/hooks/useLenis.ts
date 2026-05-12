"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.75,
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
