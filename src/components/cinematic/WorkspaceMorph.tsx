"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";
export function WorkspaceMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [sequenceData, setSequenceData] = useState<{ path: string; frameCount: number } | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSequenceData(
      isMobile
        ? { path: "/sequence-2_mobile", frameCount: 40 }
        : { path: "/sequence-2-updated-2_new", frameCount: 121 }
    );
  }, []);

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
  const readabilityOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
  
  // ── PHASE 1: INDOOR TITLE ──
  const indoorTitleOpacity = useTransform(smoothProgress, [0, 0.45, 0.52], [1, 1, 0]);
  const indoorTitleY = useTransform(smoothProgress, [0, 0.45, 0.52], [0, 0, -40]);
  const indoorTitleBlur = useTransform(smoothProgress, [0, 0.45, 0.52], ["blur(0px)", "blur(0px)", "blur(12px)"]);
  const indoorTitleScale = useTransform(smoothProgress, [0, 0.45, 0.52], [1, 1, 1.08]);
  const indoorTitleTracking = useTransform(smoothProgress, [0, 0.45], ["0.11em", "0.18em"]);
  
  // ── PHASE 1: INDOOR SUBTEXT ──
  const indoorSubOpacity = useTransform(smoothProgress, [0, 0.42, 0.49], [1, 1, 0]);
  const indoorSubY = useTransform(smoothProgress, [0, 0.42, 0.49], [0, 0, -20]);
  const indoorSubBlur = useTransform(smoothProgress, [0, 0.42, 0.49], ["blur(0px)", "blur(0px)", "blur(8px)"]);
  
  // ── PHASE 2: OUTDOOR TITLE ──
  const outdoorTitleOpacity = useTransform(smoothProgress, [0.49, 0.56, 0.85, 0.92], [0, 1, 1, 0]);
  const outdoorTitleY = useTransform(smoothProgress, [0.49, 0.56, 0.85, 0.92], [40, 0, 0, -40]);
  const outdoorTitleBlur = useTransform(smoothProgress, [0.49, 0.56, 0.85, 0.92], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const outdoorTitleScale = useTransform(smoothProgress, [0.49, 0.56, 0.85, 0.92], [0.96, 1, 1, 1.08]);
  const outdoorTitleTracking = useTransform(smoothProgress, [0.49, 0.85], ["0.11em", "0.18em"]);
  
  // ── PHASE 2: OUTDOOR SUBTEXT ──
  const outdoorSubOpacity = useTransform(smoothProgress, [0.51, 0.58, 0.83, 0.90], [0, 1, 1, 0]);
  const outdoorSubY = useTransform(smoothProgress, [0.51, 0.58, 0.83, 0.90], [20, 0, 0, -20]);
  const outdoorSubBlur = useTransform(smoothProgress, [0.51, 0.58, 0.83, 0.90], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  const textShadowStyle = { textShadow: "0 4px 20px rgba(247, 244, 238, 0.6)" };
  const titleShadowStyle = { textShadow: "0 10px 40px rgba(247, 244, 238, 0.7)" };

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-background"
      aria-label="Workspace morph sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        {sequenceData && (
          <SequenceCanvas
            path={sequenceData.path}
            frameCount={sequenceData.frameCount}
            progress={smoothProgress}
            className="absolute inset-0 w-full h-full"
          />
        )}

        {/* ── Top & Bottom Edge Blending Gradients ── */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-b from-background to-transparent z-[3] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-t from-background to-transparent z-[3] pointer-events-none" />

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
          {/* Radial light gradient specifically for dark text backing */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 30%, rgba(247, 244, 238, 0.5) 0%, rgba(247, 244, 238, 0) 70%)",
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none p-6 text-center">
          
          {/* ── PHASE 1: INDOOR WORKSPACE ── */}
          <div className="absolute top-[8vh] md:top-[10vh] lg:top-[12vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: indoorTitleOpacity,
                y: indoorTitleY,
                filter: indoorTitleBlur,
                scale: indoorTitleScale,
                letterSpacing: indoorTitleTracking
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase font-light text-brand-forest mb-5"
            >
              Work <span className="italic font-light text-brand-forest/80">Without Walls</span>
            </motion.h2>
            
            <motion.div 
              className="flex flex-col items-center"
              style={{ opacity: indoorSubOpacity, y: indoorSubY, filter: indoorSubBlur }}
            >
              <div className="h-[1px] w-[1px] min-w-[150px] max-w-[250px] bg-gradient-to-r from-transparent via-brand-forest/30 to-transparent mb-6" />
              <div
                style={textShadowStyle}
                className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 text-brand-forest/90 text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.06em] font-normal"
              >
                <span>Private offices</span>
                <span className="text-brand-terra text-xs md:text-sm font-bold">•</span>
                <span>Focus zones</span>
                <span className="text-brand-terra text-xs md:text-sm font-bold">•</span>
                <span>Minimal deep-work spaces</span>
              </div>
              <div className="mt-6 md:mt-8 flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-brand-forest/60 font-light">
                <span className="w-8 h-[1px] bg-brand-terra/40" />
                <span style={textShadowStyle}>Designed for uninterrupted focus.</span>
                <span className="w-8 h-[1px] bg-brand-terra/40" />
              </div>
            </motion.div>
          </div>

          {/* ── PHASE 2: OUTDOOR WORKSPACE ── */}
          <div className="absolute top-[8vh] md:top-[10vh] lg:top-[12vh] flex flex-col items-center w-full px-4">
            <motion.h2
              style={{
                ...titleShadowStyle,
                opacity: outdoorTitleOpacity,
                y: outdoorTitleY,
                filter: outdoorTitleBlur,
                scale: outdoorTitleScale,
                letterSpacing: outdoorTitleTracking
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase font-light text-brand-forest mb-5"
            >
              Work <span className="italic font-light text-brand-forest/80">With Nature</span>
            </motion.h2>

            <motion.div 
              className="flex flex-col items-center"
              style={{ opacity: outdoorSubOpacity, y: outdoorSubY, filter: outdoorSubBlur }}
            >
              <div className="h-[1px] w-[1px] min-w-[150px] max-w-[250px] bg-gradient-to-r from-transparent via-brand-forest/30 to-transparent mb-6" />
              <div
                style={textShadowStyle}
                className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 text-brand-forest/90 text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.06em] font-normal"
              >
                <span>Open-air desks</span>
                <span className="text-brand-terra text-xs md:text-sm font-bold">•</span>
                <span>Nature-integrated focus</span>
              </div>
              <div className="mt-6 md:mt-8 flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-brand-forest/60 font-light">
                <span className="w-8 h-[1px] bg-brand-terra/40" />
                <span style={textShadowStyle}>Designed for calm, creative productivity.</span>
                <span className="w-8 h-[1px] bg-brand-terra/40" />
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
