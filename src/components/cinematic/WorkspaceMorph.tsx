"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";
import { useIsMobile } from "@/hooks/useScrollProgress";

export function WorkspaceMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Text reveals during the middle of the morph
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.65, 0.8],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.2, 0.35], [50, 0]);
  const titleBlur = useTransform(
    scrollYProgress,
    [0.2, 0.35],
    ["blur(8px)", "blur(0px)"]
  );

  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.6, 0.75],
    [0, 1, 1, 0]
  );
  const subtitleY = useTransform(scrollYProgress, [0.3, 0.4], [30, 0]);

  // Decorative line animation
  const lineWidth = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    ["0%", "100%", "0%"]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-background"
      aria-label="Workspace morph sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SequenceCanvas
          path="/sequence-2"
          frameCount={96}
          progress={scrollYProgress}
          isMobile={isMobile}
          className="absolute inset-0"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 z-[3] bg-black/42 pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
          <motion.div className="max-w-4xl flex flex-col items-center">
            <motion.h2
              style={{
                opacity: titleOpacity,
                y: titleY,
                filter: titleBlur,
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl uppercase tracking-[0.11em] font-medium text-white/95 mb-4"
            >
              Work Without Walls
            </motion.h2>

            {/* Decorative line */}
            <motion.div
              style={{ width: lineWidth }}
              className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-8"
            />

            <motion.p
              style={{ opacity: subtitleOpacity, y: subtitleY }}
              className="text-white/85 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.06em] font-normal max-w-2xl text-balance"
            >
              Private offices. Open-air desks. Nature-integrated focus.
            </motion.p>

            {/* Accent detail */}
            <motion.div
              style={{ opacity: subtitleOpacity }}
              className="mt-12 flex items-center gap-4 text-xs tracking-[0.24em] uppercase text-white/65 font-medium"
            >
              <span className="w-8 h-[1px] bg-white/20" />
              <span>Designed for deep work</span>
              <span className="w-8 h-[1px] bg-white/20" />
            </motion.div>
          </motion.div>
        </div>

        {/* Top/bottom gradient blend into surrounding sections */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-[2] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[2] pointer-events-none" />
      </div>
    </section>
  );
}
