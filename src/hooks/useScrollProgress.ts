"use client";

import { useEffect, useState } from "react";
import { useScroll, MotionValue } from "framer-motion";

interface UseScrollProgressOptions {
  target: React.RefObject<HTMLElement | null>;
  offset?: [string, string];
}

export function useScrollProgress({
  target,
  offset = ["start start", "end end"],
}: UseScrollProgressOptions): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: offset as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  return scrollYProgress;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
