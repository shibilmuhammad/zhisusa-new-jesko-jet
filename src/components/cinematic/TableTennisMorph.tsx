"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";
import { useIsMobile } from "@/hooks/useScrollProgress";

export function TableTennisMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Two-line title animation
  const line1Opacity = useTransform(
    scrollYProgress,
    [0.15, 0.3, 0.6, 0.75],
    [0, 1, 1, 0]
  );
  const line1Y = useTransform(scrollYProgress, [0.15, 0.3], [40, 0]);

  const line2Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.55, 0.7],
    [0, 1, 1, 0]
  );
  const line2Y = useTransform(scrollYProgress, [0.25, 0.38], [40, 0]);

  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.55, 0.7],
    [0, 1, 1, 0]
  );

  // Scale effect for dramatic reveal
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [1.05, 1, 1, 0.98]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-background"
      aria-label="Table tennis morph sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale: containerScale }} className="w-full h-full">
          <SequenceCanvas
            path="/sequence-3"
            frameCount={64}
            progress={scrollYProgress}
            isMobile={isMobile}
            className="absolute inset-0"
          />
        </motion.div>

        {/* Atmospheric overlay */}
        <div className="absolute inset-0 z-[3] bg-black/30 pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <motion.h2
              style={{ opacity: line1Opacity, y: line1Y }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl uppercase tracking-[0.15em] font-extralight leading-tight"
            >
              When Work Ends,
            </motion.h2>
            <motion.h2
              style={{ opacity: line2Opacity, y: line2Y }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl uppercase tracking-[0.15em] font-extralight leading-tight mb-8"
            >
              Life Begins
            </motion.h2>

            <motion.div
              style={{ opacity: subtitleOpacity }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-16 h-[1px] bg-white/20" />
              <p className="text-white/50 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.08em] font-light">
                Fishing. Kayaking. Bonfires. Conversations.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Edge blends */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-[2] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[2] pointer-events-none" />
      </div>
    </section>
  );
}
