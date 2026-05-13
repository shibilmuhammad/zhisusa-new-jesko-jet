"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";
export function WorkspaceMorph() {
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
  
  // ── READABILITY LAYER ──
  const readabilityOpacity = useTransform(smoothProgress, [0.35, 0.55], [0, 1]);
  
  // ── PHASE 1: INDOOR TITLE ──
  const indoorTitleOpacity = useTransform(smoothProgress, [0.1, 0.15, 0.33, 0.38], [0, 1, 1, 0]);
  const indoorTitleY = useTransform(smoothProgress, [0.1, 0.15, 0.33, 0.38], [30, 0, 0, -30]);
  const indoorTitleBlur = useTransform(smoothProgress, [0.1, 0.15, 0.33, 0.38], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const indoorTitleScale = useTransform(smoothProgress, [0.1, 0.15, 0.33, 0.38], [0.96, 1, 1, 1.08]);
  
  // ── PHASE 1: INDOOR SUBTEXT ──
  const indoorSubOpacity = useTransform(smoothProgress, [0.12, 0.17, 0.31, 0.36], [0, 1, 1, 0]);
  const indoorSubY = useTransform(smoothProgress, [0.12, 0.17, 0.31, 0.36], [20, 0, 0, -20]);
  const indoorSubBlur = useTransform(smoothProgress, [0.12, 0.17, 0.31, 0.36], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  
  // ── PHASE 2: OUTDOOR TITLE ──
  const outdoorTitleOpacity = useTransform(smoothProgress, [0.39, 0.44, 0.8, 0.9], [0, 1, 1, 0]);
  const outdoorTitleY = useTransform(smoothProgress, [0.39, 0.44, 0.8, 0.9], [30, 0, 0, -30]);
  const outdoorTitleBlur = useTransform(smoothProgress, [0.39, 0.44, 0.8, 0.9], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const outdoorTitleScale = useTransform(smoothProgress, [0.39, 0.44, 0.8, 0.9], [0.96, 1, 1, 1.08]);
  
  // ── PHASE 2: OUTDOOR SUBTEXT ──
  const outdoorSubOpacity = useTransform(smoothProgress, [0.41, 0.46, 0.8, 0.9], [0, 1, 1, 0]);
  const outdoorSubY = useTransform(smoothProgress, [0.41, 0.46, 0.8, 0.9], [20, 0, 0, -20]);
  const outdoorSubBlur = useTransform(smoothProgress, [0.41, 0.46, 0.8, 0.9], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  const textShadowStyle = { textShadow: "0 0 30px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)" };
  const titleShadowStyle = { textShadow: "0 0 50px rgba(255,255,255,0.1), 0 0 30px rgba(0,0,0,0.5)" };

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-background"
      aria-label="Workspace morph sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SequenceCanvas
          path="/sequence-2"
          frameCount={96}
          progress={smoothProgress}
          className="absolute inset-0"
        />

        {/* Subtle global darkening (much lighter than before) */}
        <div className="absolute inset-0 z-[3] bg-black/10 pointer-events-none" />

        {/* Dynamic Readability Backdrop Layer (Radial Vignette + Soft Blur) */}
        <motion.div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{ opacity: readabilityOpacity }}
        >
          {/* Subtlest blur layer with soft mask to prevent sharp edges */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: "blur(6px)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 30%, black 10%, transparent 60%)",
              maskImage: "radial-gradient(ellipse 60% 40% at 50% 30%, black 10%, transparent 60%)",
            }}
          />
          {/* Radial dark gradient specifically for text backing */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none p-6 text-center">
          
          {/* ── PHASE 1: INDOOR WORKSPACE ── */}
          <div className="absolute top-[16vh] md:top-[18vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: indoorTitleOpacity,
                y: indoorTitleY,
                filter: indoorTitleBlur,
                scale: indoorTitleScale
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-[0.11em] font-medium text-white/95 mb-5"
            >
              Work Without Walls
            </motion.h2>
            
            <motion.div 
              className="flex flex-col items-center"
              style={{ opacity: indoorSubOpacity, y: indoorSubY, filter: indoorSubBlur }}
            >
              <div className="h-[1px] w-[1px] min-w-[150px] max-w-[250px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6" />
              <p
                style={textShadowStyle}
                className="text-white/85 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.06em] font-normal max-w-xl text-balance"
              >
                Private offices. Focus zones. Minimal deep-work spaces.
              </p>
              <div className="mt-8 flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.24em] uppercase text-white/65 font-medium">
                <span className="w-8 h-[1px] bg-white/20" />
                <span style={textShadowStyle}>Designed for uninterrupted focus.</span>
                <span className="w-8 h-[1px] bg-white/20" />
              </div>
            </motion.div>
          </div>

          {/* ── PHASE 2: OUTDOOR WORKSPACE ── */}
          <div className="absolute top-[16vh] md:top-[18vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: outdoorTitleOpacity,
                y: outdoorTitleY,
                filter: outdoorTitleBlur,
                scale: outdoorTitleScale
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-[0.11em] font-medium text-white/95 mb-5"
            >
              Work With Nature
            </motion.h2>

            <motion.div 
              className="flex flex-col items-center"
              style={{ opacity: outdoorSubOpacity, y: outdoorSubY, filter: outdoorSubBlur }}
            >
              <div className="h-[1px] w-[1px] min-w-[150px] max-w-[250px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6" />
              <p
                style={textShadowStyle}
                className="text-white/85 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.06em] font-normal max-w-xl text-balance"
              >
                Open-air desks. Nature-integrated focus.
              </p>
              <div className="mt-8 flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.24em] uppercase text-white/65 font-medium">
                <span className="w-8 h-[1px] bg-white/20" />
                <span style={textShadowStyle}>Designed for calm, creative productivity.</span>
                <span className="w-8 h-[1px] bg-white/20" />
              </div>
            </motion.div>
          </div>

        </div>

        {/* Top/bottom gradient blend into surrounding sections */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-[2] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[2] pointer-events-none" />
      </div>
    </section>
  );
}
