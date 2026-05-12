"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";

interface HeroScrollProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function HeroScroll({ onLoadProgress, onLoaded }: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Use native scroll position — NOT lenis-filtered — for maximum responsiveness
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll phase for debugging
  const [currentPhase, setCurrentPhase] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.30) setCurrentPhase(1);
    else if (v < 0.65) setCurrentPhase(2);
    else setCurrentPhase(3);
  });

  // Show canvas content once first frame loads
  const handleCanvasLoaded = () => {
    setIsCanvasReady(true);
    onLoaded?.();
  };

  // ═══════════════════════════════════════════════════════════
  // PHASE 1 — OPENING (0% → 28%)
  // Drone enters through the gate. Jesko Jets editorial layout.
  // "Work. Live. Leisure." top-left, "We are nature" bottom-right
  // ═══════════════════════════════════════════════════════════

  // TOP-LEFT: "Work. Live. Leisure." — visible immediately, slides out left
  const p1_topLeftOpacity = useTransform(
    scrollYProgress,
    [0, 0.01, 0.18, 0.26],
    [1, 1, 1, 0]
  );
  const p1_topLeftY = useTransform(
    scrollYProgress,
    [0, 0.05],
    [20, 0]
  );
  const p1_topLeftExitX = useTransform(
    scrollYProgress,
    [0.18, 0.28],
    [0, -80]
  );

  // Each word staggers slightly for drone-passing effect
  const p1_word1_y = useTransform(scrollYProgress, [0, 0.08], [40, 0]);
  const p1_word2_y = useTransform(scrollYProgress, [0, 0.10], [50, 0]);
  const p1_word3_y = useTransform(scrollYProgress, [0, 0.12], [60, 0]);
  const p1_word1_opacity = useTransform(scrollYProgress, [0, 0.03], [0, 1]);
  const p1_word2_opacity = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);
  const p1_word3_opacity = useTransform(scrollYProgress, [0.04, 0.09], [0, 1]);

  // BOTTOM-RIGHT: "We are nature" — Jesko "We are distinction" style
  const p1_bottomRightOpacity = useTransform(
    scrollYProgress,
    [0.01, 0.04, 0.18, 0.26],
    [0, 1, 1, 0]
  );
  const p1_bottomRightY = useTransform(
    scrollYProgress,
    [0.01, 0.06],
    [40, 0]
  );
  const p1_bottomRightExitX = useTransform(
    scrollYProgress,
    [0.18, 0.28],
    [0, 80]
  );

  // BOTTOM-LEFT: Tagline + description (like Jesko's "Your freedom to enjoy life")
  const p1_taglineOpacity = useTransform(
    scrollYProgress,
    [0.03, 0.07, 0.18, 0.26],
    [0, 1, 1, 0]
  );
  const p1_taglineY = useTransform(
    scrollYProgress,
    [0.03, 0.09],
    [30, 0]
  );

  // CENTER: "Zhisusa" brand text (like Jesko Jets center logo)
  const p1_centerOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.12, 0.20],
    [1, 1, 1, 0]
  );
  const p1_centerScale = useTransform(
    scrollYProgress,
    [0, 0.20],
    [1, 0.92]
  );

  // BOTTOM-CENTER: Scroll indicator
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.04],
    [1, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 2 — MID-FLIGHT (30% → 60%)
  // Drone flying over terrain. Big cinematic center reveal.
  // ═══════════════════════════════════════════════════════════

  const p2_opacity = useTransform(
    scrollYProgress,
    [0.30, 0.38, 0.55, 0.62],
    [0, 1, 1, 0]
  );
  const p2_y = useTransform(
    scrollYProgress,
    [0.30, 0.40],
    [50, 0]
  );
  const p2_scale = useTransform(
    scrollYProgress,
    [0.30, 0.40, 0.55, 0.62],
    [0.95, 1, 1, 1.03]
  );

  // Side accents for phase 2 — small text that sweeps in from sides
  const p2_leftAccentOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_leftAccentX = useTransform(
    scrollYProgress,
    [0.34, 0.44],
    [-40, 0]
  );
  const p2_rightAccentOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.44, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_rightAccentX = useTransform(
    scrollYProgress,
    [0.36, 0.46],
    [40, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 3 — ARRIVAL (65% → 95%)
  // Drone settling. Split reveal from both sides.
  // ═══════════════════════════════════════════════════════════

  const p3_opacity = useTransform(
    scrollYProgress,
    [0.65, 0.73, 0.88, 0.96],
    [0, 1, 1, 0]
  );
  const p3_leftX = useTransform(
    scrollYProgress,
    [0.65, 0.76],
    [-100, 0]
  );
  const p3_rightX = useTransform(
    scrollYProgress,
    [0.65, 0.76],
    [100, 0]
  );

  // Bottom CTA that appears at the very end
  const p3_ctaOpacity = useTransform(
    scrollYProgress,
    [0.80, 0.88, 0.95, 1.0],
    [0, 1, 1, 0.6]
  );
  const p3_ctaY = useTransform(
    scrollYProgress,
    [0.80, 0.90],
    [20, 0]
  );

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        height: "500vh",
        // CRITICAL: no overflow:hidden here — it breaks sticky
      }}
      aria-label="Hero cinematic sequence"
    >
      {/* ════════════════════════════════════════════
          STICKY VIEWPORT — pinned to screen until scroll ends
          ════════════════════════════════════════════ */}
      <div
        className="sticky top-0 left-0 w-full"
        style={{
          height: "100vh",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Black fallback background to prevent flash */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Canvas — the scroll-driven drone video */}
        <SequenceCanvas
          path="/sequence-1"
          frameCount={96}
          progress={scrollYProgress}
          className="absolute inset-0"
          onLoadProgress={onLoadProgress}
          onLoaded={handleCanvasLoaded}
        />

        {/* ── RADIAL VIGNETTE: sides dark, center bright ── */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, 
                transparent 0%, 
                rgba(5,5,5,0.25) 40%, 
                rgba(5,5,5,0.7) 100%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Top gradient for navbar readability */}
        <div
          className="absolute top-0 left-0 right-0 h-36 z-[4] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 z-[4] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(5,5,5,0.55) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Left edge gradient */}
        <div
          className="absolute top-0 left-0 bottom-0 w-48 z-[4] pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(5,5,5,0.35) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Right edge gradient */}
        <div
          className="absolute top-0 right-0 bottom-0 w-48 z-[4] pointer-events-none"
          style={{
            background: "linear-gradient(to left, rgba(5,5,5,0.35) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════
            PHASE 1 — JESKO JETS EDITORIAL LAYOUT
            ═══════════════════════════════════════════════ */}

        {/* TOP-LEFT: "Work. Live. Leisure." — staggered drone reveal */}
        <motion.div
          style={{
            opacity: p1_topLeftOpacity,
            x: p1_topLeftExitX,
            y: p1_topLeftY,
          }}
          className="absolute z-10 pointer-events-none top-[14vh] left-[clamp(1.5rem,4vw,4.5rem)]"
          data-phase="1-top-left"
        >
          <h1
            className="font-display uppercase leading-[0.88] tracking-[0.01em]"
            style={{ fontSize: "clamp(3rem, 8.5vw, 8.5rem)" }}
          >
            <motion.span
              style={{ opacity: p1_word1_opacity, y: p1_word1_y }}
              className="block font-extralight"
            >
              Work.
            </motion.span>
            <motion.span
              style={{ opacity: p1_word2_opacity, y: p1_word2_y }}
              className="block font-extralight"
            >
              Live.
            </motion.span>
            <motion.span
              style={{ opacity: p1_word3_opacity, y: p1_word3_y }}
              className="block font-light text-white/50"
            >
              Leisure.
            </motion.span>
          </h1>
        </motion.div>

        {/* CENTER: "Zhisusa" brand (like Jesko Jets center logo in the window) */}
        <motion.div
          style={{
            opacity: p1_centerOpacity,
            scale: p1_centerScale,
          }}
          className="absolute inset-0 z-[8] pointer-events-none flex items-center justify-center"
          data-phase="1-center"
        >
          <p
            className="font-display tracking-[0.45em] uppercase font-extralight text-white/40"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.8rem)" }}
          >
            Zhisusa
          </p>
        </motion.div>

        {/* BOTTOM-RIGHT: "We are nature" — Jesko "We are distinction" style */}
        <motion.div
          style={{
            opacity: p1_bottomRightOpacity,
            x: p1_bottomRightExitX,
            y: p1_bottomRightY,
          }}
          className="absolute z-10 pointer-events-none bottom-[12vh] right-[clamp(1.5rem,4vw,4.5rem)] text-right"
          data-phase="1-bottom-right"
        >
          <h2
            className="font-display uppercase leading-[0.88] tracking-[0.01em]"
            style={{ fontSize: "clamp(3rem, 8.5vw, 8.5rem)" }}
          >
            <span className="block font-extralight">We are</span>
            <span className="block font-light italic tracking-[0.04em]">
              nature
            </span>
          </h2>
        </motion.div>

        {/* BOTTOM-LEFT: Tagline + paragraph (like Jesko's "Your freedom to enjoy life") */}
        <motion.div
          style={{
            opacity: p1_taglineOpacity,
            y: p1_taglineY,
          }}
          className="absolute z-10 pointer-events-none bottom-[12vh] left-[clamp(1.5rem,4vw,4.5rem)] max-w-[280px] md:max-w-[320px]"
          data-phase="1-bottom-left"
        >
          <p className="font-display text-[clamp(1rem,2.2vw,1.35rem)] font-medium italic leading-snug tracking-wide text-white/85 mb-3">
            Your freedom to
            <br />
            live differently
          </p>
          <div className="w-10 h-[1px] bg-white/25 mb-3" />
          <p className="text-[11px] md:text-xs leading-[1.7] text-white/30 font-light tracking-wide">
            Every stay is designed around your rhythm —
            <br />
            so you can focus on what truly matters,
            <br />
            while nature takes care of everything else.
          </p>
        </motion.div>

        {/* BOTTOM-CENTER: Scroll indicator + journey text */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/20"
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 0v14M5 14L0 9M5 14l5-5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </motion.div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-light">
            Scroll down
          </span>
          <span className="text-[9px] tracking-[0.18em] uppercase text-white/12 font-light hidden sm:inline">
            to start the journey
          </span>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            PHASE 2 — MID-FLIGHT CENTER STATEMENT
            ═══════════════════════════════════════════════ */}

        {/* Left side accent — thin vertical text */}
        <motion.div
          style={{
            opacity: p2_leftAccentOpacity,
            x: p2_leftAccentX,
          }}
          className="absolute z-10 pointer-events-none left-[clamp(1.5rem,4vw,4.5rem)] top-1/2 -translate-y-1/2"
        >
          <div className="flex flex-col items-start gap-4">
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <p
              className="text-[10px] tracking-[0.35em] uppercase text-white/30 font-light"
              style={{
                writingMode: "vertical-lr",
                textOrientation: "mixed",
              }}
            >
              Explore
            </p>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/15 to-transparent" />
          </div>
        </motion.div>

        {/* Center statement */}
        <motion.div
          style={{
            opacity: p2_opacity,
            y: p2_y,
            scale: p2_scale,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center px-6">
            <h2
              className="font-display uppercase leading-[1] font-extralight tracking-[0.06em] mb-4"
              style={{ fontSize: "clamp(2.4rem, 7vw, 7.5rem)" }}
            >
              Escape
              <br />
              <span className="text-white/40">the ordinary</span>
            </h2>
            <p className="text-white/25 text-sm md:text-base tracking-[0.15em] font-light">
              A slower way to live.
            </p>
          </div>
        </motion.div>

        {/* Right side accent — coordinates/location style */}
        <motion.div
          style={{
            opacity: p2_rightAccentOpacity,
            x: p2_rightAccentX,
          }}
          className="absolute z-10 pointer-events-none right-[clamp(1.5rem,4vw,4.5rem)] top-1/2 -translate-y-1/2 text-right"
        >
          <div className="flex flex-col items-end gap-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-light">
              N 12°58&apos;
            </p>
            <div className="w-8 h-[1px] bg-white/15" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-light">
              E 77°35&apos;
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            PHASE 3 — ARRIVAL: SPLIT REVEAL FROM SIDES
            ═══════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: p3_opacity }}
          className="absolute inset-0 z-10 flex items-center justify-between pointer-events-none px-[clamp(1.5rem,4vw,4.5rem)]"
        >
          {/* Left text slides in from left */}
          <motion.div style={{ x: p3_leftX }}>
            <h2
              className="font-display uppercase leading-[0.92] font-extralight tracking-[0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
            >
              Stay
              <br />
              <span
                className="text-white/30 tracking-[0.12em] block mt-2"
                style={{ fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)" }}
              >
                close to nature
              </span>
            </h2>
          </motion.div>

          {/* Right text slides in from right */}
          <motion.div style={{ x: p3_rightX }} className="text-right">
            <h2
              className="font-display uppercase leading-[0.92] font-extralight tracking-[0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
            >
              Experience
              <br />
              <span
                className="text-white/30 tracking-[0.12em] block mt-2"
                style={{ fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)" }}
              >
                what matters
              </span>
            </h2>
          </motion.div>
        </motion.div>

        {/* Phase 3 — Bottom CTA */}
        <motion.div
          style={{
            opacity: p3_ctaOpacity,
            y: p3_ctaY,
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-auto"
        >
          <button className="text-[11px] uppercase tracking-[0.25em] font-light border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-[#050505] transition-all duration-600 backdrop-blur-sm bg-white/[0.04]">
            Discover Zhisusa
          </button>
        </motion.div>
      </div>
    </section>
  );
}
