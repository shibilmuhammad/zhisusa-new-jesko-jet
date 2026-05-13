"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";
export function TableTennisMorph() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  
  // Cinematic inertia spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 50,
    mass: 0.1,
    restDelta: 0.0001
  });
  
  // ── PHASE 1: "When Work Ends" ──
  const phase1Opacity = useTransform(smoothProgress, [0.05, 0.12, 0.65, 0.72], [0, 1, 1, 0]);
  const phase1Y = useTransform(smoothProgress, [0.05, 0.12, 0.65, 0.72], [20, 0, 0, -20]);
  const phase1Blur = useTransform(smoothProgress, [0.05, 0.12, 0.65, 0.72], ["blur(4px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const phase1Scale = useTransform(smoothProgress, [0.05, 0.12, 0.65, 0.72], [0.98, 1, 1, 1.1]);
  
  // ── PHASE 2: "Life Begins" ──
  const phase2Opacity = useTransform(smoothProgress, [0.70, 0.76, 0.92, 0.98], [0, 1, 1, 0]);
  const phase2Y = useTransform(smoothProgress, [0.70, 0.76, 0.92, 0.98], [30, 0, 0, -30]);
  const phase2Blur = useTransform(smoothProgress, [0.70, 0.76, 0.92, 0.98], ["blur(4px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const phase2Scale = useTransform(smoothProgress, [0.70, 0.76, 0.92, 0.98], [0.96, 1, 1, 1.08]);
  
  // ── PHASE 2: Subtitle ──
  const subtitleOpacity = useTransform(smoothProgress, [0.72, 0.78, 0.92, 0.98], [0, 1, 1, 0]);
  const subtitleY = useTransform(smoothProgress, [0.72, 0.78, 0.92, 0.98], [20, 0, 0, -20]);

  const titleShadowStyle = { textShadow: "0 0 50px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)" };
  const textShadowStyle = { textShadow: "0 0 30px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)" };

  // Scale effect for dramatic reveal
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [1.05, 1, 1, 0.98]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-background"
      aria-label="Table tennis morph sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale: containerScale }} className="w-full h-full">
          <SequenceCanvas
            path="/sequence-3"
            frameCount={64}
            progress={smoothProgress}
            className="absolute inset-0"
          />
        </motion.div>

        {/* Subtle global darkening */}
        <div className="absolute inset-0 z-[3] bg-black/10 pointer-events-none" />

        {/* Dynamic Readability Backdrop Layer (Radial Vignette + Soft Blur) */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: "blur(6px)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 30%, black 10%, transparent 60%)",
              maskImage: "radial-gradient(ellipse 60% 40% at 50% 30%, black 10%, transparent 60%)",
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
          
          {/* ── PHASE 1: "When Work Ends" ── */}
          <div className="absolute top-[16vh] md:top-[18vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: phase1Opacity,
                y: phase1Y,
                filter: phase1Blur,
                scale: phase1Scale
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-[0.11em] font-medium text-white/95 leading-tight"
            >
              When Work Ends
            </motion.h2>
          </div>

          {/* ── PHASE 2: "Life Begins" ── */}
          <div className="absolute top-[16vh] md:top-[18vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: phase2Opacity,
                y: phase2Y,
                filter: phase2Blur,
                scale: phase2Scale
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-[0.11em] font-medium text-white/95 leading-tight mb-8"
            >
              Life Begins
            </motion.h2>

            <motion.div
              style={{ opacity: subtitleOpacity, y: subtitleY }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-16 h-[1px] bg-white/20" />
              <p 
                style={textShadowStyle}
                className="text-white/85 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.06em] font-normal"
              >
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
