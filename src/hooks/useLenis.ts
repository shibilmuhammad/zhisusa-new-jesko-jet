"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

interface CustomWindow extends Window {
  lenis?: unknown;
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent the browser from restoring the scroll position on reload
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

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
    (window as unknown as CustomWindow).lenis = lenis;

    // Reset Lenis scroll target to top immediately
    lenis.scrollTo(0, { immediate: true });

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
      (window as unknown as CustomWindow).lenis = null;
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
