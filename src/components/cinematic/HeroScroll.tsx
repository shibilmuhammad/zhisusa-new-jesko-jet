"use client";

import { useRef } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
} from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";

interface HeroScrollProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function HeroScroll({ onLoadProgress, onLoaded }: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Scroll Tracking (using Framer Motion for Lenis sync) ──
  // useScroll is critical when using Lenis because native scroll events
  // fire out-of-sync with Lenis's RAF loop, causing lag/jitter.
  const { scrollYProgress: scrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 185,
    damping: 28,
    mass: 0.3,
  });

  // Shared zoom curve to create Jesko-like "camera + typography" illusion.
  const heroZoom = useTransform(smoothProgress, [0, 0.12, 0.3], [1, 1.12, 1.24]);
  const heroDriftY = useTransform(smoothProgress, [0, 0.3], [0, -36]);
  // ═══════════════════════════════════════════════════════════
  // PHASE 1 — OPENING (0% → 28%)
  // Drone enters through the gate. Jesko Jets editorial layout.
  // "Work. Live. Leisure." top-left, "We are nature" bottom-right
  // ═══════════════════════════════════════════════════════════

  // TOP-LEFT: "Work. Live. Leisure." — visible from start, like Jesko Jets
  const p1_topLeftOpacity = useTransform(
    smoothProgress,
    [0, 0.03, 0.14, 0.22],
    [0.6, 1, 1, 0]
  );
  const p1_topLeftExitX = useTransform(
    smoothProgress,
    // High sensitivity: tiny scroll immediately drifts outward
    [0, 0.02, 0.06, 0.18],
    [0, -28, -90, -240]
  );
  const p1_topLeftScale = useTransform(
    smoothProgress,
    [0, 0.02, 0.06, 0.18],
    [0.8, 0.9, 1.02, 1.13]
  );
  const p1_topLeftY = useTransform(smoothProgress, [0, 0.06, 0.18], [0, -6, -14]);

  // Staggered EXIT — each word fades at slightly different times
  // as the drone "passes by" them. Creates parallax depth.
  const p1_word1_opacity = useTransform(smoothProgress, [0, 0.16, 0.22], [1, 1, 0]);
  const p1_word2_opacity = useTransform(smoothProgress, [0, 0.17, 0.23], [1, 1, 0]);
  // Words shift up slightly as drone passes for parallax
  const p1_word1_y = useTransform(smoothProgress, [0.1, 0.22], [0, -20]);
  const p1_word2_y = useTransform(smoothProgress, [0.12, 0.22], [0, -15]);

  // BOTTOM-RIGHT: "We are nature" — visible from start
  const p1_bottomRightOpacity = useTransform(
    smoothProgress,
    [0, 0.03, 0.14, 0.22],
    [0.6, 1, 1, 0]
  );
  const p1_bottomRightY = useTransform(
    smoothProgress,
    [0, 0.08, 0.2],
    [26, 0, 12]
  );
  const p1_bottomRightExitX = useTransform(
    smoothProgress,
    [0, 0.02, 0.06, 0.18],
    [0, 28, 90, 240]
  );
  const p1_bottomRightScale = useTransform(
    smoothProgress,
    [0, 0.02, 0.06, 0.18],
    [0.8, 0.9, 1.02, 1.13]
  );

  // BOTTOM-LEFT: Tagline + description (Jesko's "Your freedom to enjoy life")
  const p1_taglineOpacity = useTransform(
    smoothProgress,
    [0, 0.14, 0.22],
    [1, 1, 0]
  );
  const p1_taglineY = useTransform(
    smoothProgress,
    [0.12, 0.22],
    [0, 15]
  );
  const p1_taglineX = useTransform(
    smoothProgress,
    [0, 0.02, 0.06, 0.18],
    [0, -10, -36, -120]
  );
  const p1_taglineScale = useTransform(
    smoothProgress,
    [0, 0.02, 0.06, 0.18],
    [0.9, 0.96, 1.03, 1.1]
  );

  // CENTER: "Zhisusa" brand text (like Jesko Jets center logo)
  const p1_centerOpacity = useTransform(
    smoothProgress,
    [0, 0.02, 0.1, 0.17],
    [1, 1, 1, 0]
  );
  const p1_centerScale = useTransform(
    smoothProgress,
    [0, 0.20],
    [1, 0.92]
  );

  // BOTTOM-CENTER: Scroll indicator
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.04],
    [1, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 2 — MID-FLIGHT (30% → 60%)
  // Drone flying over terrain. Big cinematic center reveal.
  // ═══════════════════════════════════════════════════════════

  const p2_opacity = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.55, 0.62],
    [0, 1, 1, 0]
  );
  const p2_y = useTransform(
    smoothProgress,
    [0.30, 0.40],
    [50, 0]
  );
  const p2_scale = useTransform(
    smoothProgress,
    [0.30, 0.40, 0.55, 0.62],
    [0.95, 1, 1, 1.03]
  );

  // Side accents for phase 2
  const p2_leftAccentOpacity = useTransform(
    smoothProgress,
    [0.34, 0.42, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_leftAccentX = useTransform(
    smoothProgress,
    [0.34, 0.44],
    [-40, 0]
  );
  const p2_rightAccentOpacity = useTransform(
    smoothProgress,
    [0.36, 0.44, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_rightAccentX = useTransform(
    smoothProgress,
    [0.36, 0.46],
    [40, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 3 — ARRIVAL (65% → 95%)
  // Drone settling. Split reveal from both sides.
  // ═══════════════════════════════════════════════════════════

  const p3_opacity = useTransform(
    smoothProgress,
    [0.65, 0.73, 0.88, 0.96],
    [0, 1, 1, 0]
  );
  const p3_leftX = useTransform(
    smoothProgress,
    [0.65, 0.76],
    [-100, 0]
  );
  const p3_rightX = useTransform(
    smoothProgress,
    [0.65, 0.76],
    [100, 0]
  );

  // Bottom CTA at the very end
  const p3_ctaOpacity = useTransform(
    smoothProgress,
    [0.80, 0.88, 0.95, 1.0],
    [0, 1, 1, 0.6]
  );
  const p3_ctaY = useTransform(
    smoothProgress,
    [0.80, 0.90],
    [20, 0]
  );

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        height: "600vh",
        position: "relative",
        contain: "layout paint",
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
          transform: "translateZ(0)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            scale: heroZoom,
            y: heroDriftY,
            transformOrigin: "50% 50%",
          }}
        >
          {/* Black fallback background */}
          <div className="absolute inset-0 bg-[#050505]" />

          {/* Canvas — the scroll-driven drone video */}
          <SequenceCanvas
            path="/sequence-1"
            frameCount={96}
            progress={scrollProgress}
            className="absolute inset-0"
            onLoadProgress={onLoadProgress}
            onLoaded={onLoaded}
          />
        </motion.div>

        {/* Global darkening layer to improve text readability and soften compression artifacts */}
        <div className="absolute inset-0 z-[2] bg-black/45 pointer-events-none" />

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
            scale: p1_topLeftScale,
            y: p1_topLeftY,
          }}
          className="absolute z-10 pointer-events-none top-[14vh] left-[clamp(1.5rem,4vw,4.5rem)]"
          data-phase="1-top-left"
        >
          <h1
            className="font-display leading-[0.88] tracking-[0.01em]"
            // Match Jesko-like editorial sizing at rest; scaling handles the "zoom" feel.
            style={{ fontSize: "clamp(2.5rem, 7.2vw, 7rem)" }}
          >
            <motion.span
              style={{ opacity: p1_word1_opacity, y: p1_word1_y }}
              className="block font-medium text-white/95"
            >
              Nature-first
            </motion.span>
            <motion.span
              style={{ opacity: p1_word2_opacity, y: p1_word2_y }}
              className="block font-medium text-white/95"
            >
              Lifestyle
            </motion.span>
          </h1>
        </motion.div>

        {/* CENTER: "Zhisusa" brand (like Jesko Jets center logo) */}
        <motion.div
          style={{
            opacity: p1_centerOpacity,
            scale: p1_centerScale,
          }}
          className="absolute inset-0 z-[8] pointer-events-none flex items-center justify-center"
          data-phase="1-center"
        >
          <p
            className="font-display tracking-[0.08em] font-light text-white/80"
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
            scale: p1_bottomRightScale,
          }}
          className="absolute z-10 pointer-events-none bottom-[12vh] right-[clamp(0.15rem,1.2vw,1rem)] text-right"
          data-phase="1-bottom-right"
        >
          <h2
            className="font-display uppercase leading-[0.88] tracking-[0.01em]"
            style={{ fontSize: "clamp(2.5rem, 7.2vw, 7rem)" }}
          >
            <span className="block font-medium text-white/95">Work</span>
            <span className="block font-medium tracking-[0.02em] text-white/95">Live</span>
            <span className="block font-medium tracking-[0.02em] text-white/95">Leisure</span>
          </h2>
        </motion.div>

        {/* BOTTOM-LEFT: Tagline + paragraph */}
        <motion.div
          style={{
            opacity: p1_taglineOpacity,
            y: p1_taglineY,
            x: p1_taglineX,
            scale: p1_taglineScale,
          }}
          className="absolute z-10 pointer-events-none bottom-[12vh] left-[clamp(1.5rem,4vw,4.5rem)] max-w-[280px] md:max-w-[320px] text-left"
          data-phase="1-bottom-left"
        >
          <p className="font-display text-[clamp(1rem,2.2vw,1.35rem)] font-medium italic leading-snug tracking-wide text-white/85 mb-3">
            Premium nature-first
            <br />
            work and travel
          </p>
          <div className="w-10 h-[1px] bg-white/25 mb-3" />
          <p className="text-[11px] md:text-xs leading-[1.7] text-white/30 font-light tracking-wide">
            Stay in private villas, luxury tents, tree houses,
            <br />
            and modern retreats with offices, co-working
            <br />
            zones, and leisure experiences built for
            <br />
            comfort, slow living, and meaningful travel.
          </p>
        </motion.div>

        {/* BOTTOM-CENTER: Scroll indicator */}
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
            to enter zhisusa
          </span>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            PHASE 2 — MID-FLIGHT CENTER STATEMENT
            ═══════════════════════════════════════════════ */}

        {/* Left side accent — vertical text */}
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
              Work zones
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
              Work. Stay.
              <br />
              <span className="text-white/40">Leisure.</span>
            </h2>
            <p className="text-white/25 text-sm md:text-base tracking-[0.15em] font-light">
              One immersive platform for nature-first living.
            </p>
          </div>
        </motion.div>

        {/* Right side accent — coordinates */}
        <motion.div
          style={{
            opacity: p2_rightAccentOpacity,
            x: p2_rightAccentX,
          }}
          className="absolute z-10 pointer-events-none right-[clamp(1.5rem,4vw,4.5rem)] top-1/2 -translate-y-1/2 text-right"
        >
          <div className="flex flex-col items-end gap-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-light">
              Fishing
            </p>
            <div className="w-8 h-[1px] bg-white/15" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-light">
              Kayaking
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
          <motion.div style={{ x: p3_leftX }}>
            <h2
              className="font-display uppercase leading-[0.92] font-extralight tracking-[0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
            >
              Work
              <br />
              <span
                className="text-white/30 tracking-[0.12em] block mt-2"
                style={{ fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)" }}
              >
                peacefully in nature
              </span>
            </h2>
          </motion.div>

          <motion.div style={{ x: p3_rightX }} className="text-right">
            <h2
              className="font-display uppercase leading-[0.92] font-extralight tracking-[0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
            >
              Leisure
              <br />
              <span
                className="text-white/30 tracking-[0.12em] block mt-2"
                style={{ fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)" }}
              >
                reconnect and slow down
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
