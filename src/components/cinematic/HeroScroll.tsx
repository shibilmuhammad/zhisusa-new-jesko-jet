"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";

interface HeroScrollProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function HeroScroll({ onLoadProgress, onLoaded }: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Manual scroll progress (bypasses Framer Motion's useScroll bug) ──
  // We create our own MotionValue and drive it from native scroll events.
  // This eliminates the "container must have non-static position" issue
  // and gives us reliable 0→1 progress across the full scroll range.
  const scrollProgress = useMotionValue(0);

  const updateProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const sectionH = el.offsetHeight;

    // Progress: 0 when section top is at viewport top,
    //           1 when section bottom is at viewport bottom
    // scrollRange = sectionHeight - viewportHeight
    const scrollRange = sectionH - windowH;
    if (scrollRange <= 0) return;

    // rect.top starts at 0 (section at viewport top) and goes to -(sectionH - windowH)
    const rawProgress = -rect.top / scrollRange;
    const clamped = Math.max(0, Math.min(1, rawProgress));

    scrollProgress.set(clamped);
  }, [scrollProgress]);

  useEffect(() => {
    // Initial calculation
    updateProgress();

    // Synchronous scroll handler — no RAF delay.
    // This ensures the canvas frame updates on the SAME paint frame
    // as the scroll, eliminating black flashes between frames.
    const onScroll = () => {
      updateProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  // ═══════════════════════════════════════════════════════════
  // PHASE 1 — OPENING (0% → 28%)
  // Drone enters through the gate. Jesko Jets editorial layout.
  // "Work. Live. Leisure." top-left, "We are nature" bottom-right
  // ═══════════════════════════════════════════════════════════

  // TOP-LEFT: "Work. Live. Leisure." — visible from start, like Jesko Jets
  const p1_topLeftOpacity = useTransform(
    scrollProgress,
    [0, 0.18, 0.26],
    [1, 1, 0]
  );
  const p1_topLeftExitX = useTransform(
    scrollProgress,
    [0.18, 0.28],
    [0, -80]
  );

  // Staggered EXIT — each word fades at slightly different times
  // as the drone "passes by" them. Creates parallax depth.
  const p1_word1_opacity = useTransform(scrollProgress, [0, 0.16, 0.22], [1, 1, 0]);
  const p1_word2_opacity = useTransform(scrollProgress, [0, 0.18, 0.24], [1, 1, 0]);
  const p1_word3_opacity = useTransform(scrollProgress, [0, 0.20, 0.26], [1, 1, 0]);
  // Words shift up slightly as drone passes for parallax
  const p1_word1_y = useTransform(scrollProgress, [0.14, 0.24], [0, -20]);
  const p1_word2_y = useTransform(scrollProgress, [0.16, 0.26], [0, -15]);
  const p1_word3_y = useTransform(scrollProgress, [0.18, 0.28], [0, -10]);

  // BOTTOM-RIGHT: "We are nature" — visible from start
  const p1_bottomRightOpacity = useTransform(
    scrollProgress,
    [0, 0.18, 0.26],
    [1, 1, 0]
  );
  const p1_bottomRightY = useTransform(
    scrollProgress,
    [0.16, 0.26],
    [0, 20]
  );
  const p1_bottomRightExitX = useTransform(
    scrollProgress,
    [0.18, 0.28],
    [0, 80]
  );

  // BOTTOM-LEFT: Tagline + description (Jesko's "Your freedom to enjoy life")
  const p1_taglineOpacity = useTransform(
    scrollProgress,
    [0, 0.18, 0.26],
    [1, 1, 0]
  );
  const p1_taglineY = useTransform(
    scrollProgress,
    [0.16, 0.26],
    [0, 15]
  );

  // CENTER: "Zhisusa" brand text (like Jesko Jets center logo)
  const p1_centerOpacity = useTransform(
    scrollProgress,
    [0, 0.02, 0.12, 0.20],
    [1, 1, 1, 0]
  );
  const p1_centerScale = useTransform(
    scrollProgress,
    [0, 0.20],
    [1, 0.92]
  );

  // BOTTOM-CENTER: Scroll indicator
  const scrollIndicatorOpacity = useTransform(
    scrollProgress,
    [0, 0.04],
    [1, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 2 — MID-FLIGHT (30% → 60%)
  // Drone flying over terrain. Big cinematic center reveal.
  // ═══════════════════════════════════════════════════════════

  const p2_opacity = useTransform(
    scrollProgress,
    [0.30, 0.38, 0.55, 0.62],
    [0, 1, 1, 0]
  );
  const p2_y = useTransform(
    scrollProgress,
    [0.30, 0.40],
    [50, 0]
  );
  const p2_scale = useTransform(
    scrollProgress,
    [0.30, 0.40, 0.55, 0.62],
    [0.95, 1, 1, 1.03]
  );

  // Side accents for phase 2
  const p2_leftAccentOpacity = useTransform(
    scrollProgress,
    [0.34, 0.42, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_leftAccentX = useTransform(
    scrollProgress,
    [0.34, 0.44],
    [-40, 0]
  );
  const p2_rightAccentOpacity = useTransform(
    scrollProgress,
    [0.36, 0.44, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const p2_rightAccentX = useTransform(
    scrollProgress,
    [0.36, 0.46],
    [40, 0]
  );

  // ═══════════════════════════════════════════════════════════
  // PHASE 3 — ARRIVAL (65% → 95%)
  // Drone settling. Split reveal from both sides.
  // ═══════════════════════════════════════════════════════════

  const p3_opacity = useTransform(
    scrollProgress,
    [0.65, 0.73, 0.88, 0.96],
    [0, 1, 1, 0]
  );
  const p3_leftX = useTransform(
    scrollProgress,
    [0.65, 0.76],
    [-100, 0]
  );
  const p3_rightX = useTransform(
    scrollProgress,
    [0.65, 0.76],
    [100, 0]
  );

  // Bottom CTA at the very end
  const p3_ctaOpacity = useTransform(
    scrollProgress,
    [0.80, 0.88, 0.95, 1.0],
    [0, 1, 1, 0.6]
  );
  const p3_ctaY = useTransform(
    scrollProgress,
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

        {/* BOTTOM-LEFT: Tagline + paragraph */}
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
            to start the journey
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
