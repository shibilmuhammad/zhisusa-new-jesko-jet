"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SequenceCanvas } from "./SequenceCanvas";

interface HeroScrollProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function HeroScroll({ onLoadProgress, onLoaded }: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ═══════════════════════════════════════════════════════
  //  TEXT ANIMATIONS — Synced to the drone fly-through
  //  The drone enters the gate, flies forward through a
  //  luxury resort compound. Texts enter from sides like
  //  they're attached to the environment being flown past.
  // ═══════════════════════════════════════════════════════

  // ── TOP-LEFT: "Work. Live. Leisure." ──
  // Appears early, slides in from the left as the drone enters
  const topLeftOpacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.22, 0.32],
    [1, 1, 1, 0]
  );
  const topLeftX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32],
    [0, 0, -120]
  );
  const topLeftBlur = useTransform(
    scrollYProgress,
    [0.22, 0.32],
    ["blur(0px)", "blur(12px)"]
  );

  // ── BOTTOM-RIGHT: "We are nature" ──
  // Appears simultaneously with top-left, anchored bottom-right
  const bottomRightOpacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.22, 0.32],
    [1, 1, 1, 0]
  );
  const bottomRightX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32],
    [0, 0, 120]
  );
  const bottomRightBlur = useTransform(
    scrollYProgress,
    [0.22, 0.32],
    ["blur(0px)", "blur(12px)"]
  );

  // ── BOTTOM-LEFT: Tagline + description ──
  // Small editorial text, appears with a slight delay
  const bottomLeftOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.2, 0.28],
    [0, 1, 1, 0]
  );
  const bottomLeftY = useTransform(
    scrollYProgress,
    [0.02, 0.08, 0.28],
    [30, 0, -40]
  );

  // ── PHASE 2: CENTER — "Escape the ordinary" ──
  // Mid-flight, the drone is inside the compound — big statement
  const centerOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.6, 0.68],
    [0, 1, 1, 0]
  );
  const centerY = useTransform(
    scrollYProgress,
    [0.34, 0.44],
    [80, 0]
  );
  const centerScale = useTransform(
    scrollYProgress,
    [0.34, 0.44, 0.6, 0.68],
    [0.92, 1, 1, 1.05]
  );
  const centerBlur = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.6, 0.68],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"]
  );

  // ── PHASE 3: SPLIT — "Stay" left + "Experience" right ──
  // Final phase — the drone reaches the destination
  const splitOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.78, 0.9, 0.97],
    [0, 1, 1, 0]
  );
  const splitLeftX = useTransform(
    scrollYProgress,
    [0.7, 0.8],
    [-100, 0]
  );
  const splitRightX = useTransform(
    scrollYProgress,
    [0.7, 0.8],
    [100, 0]
  );
  const splitBlur = useTransform(
    scrollYProgress,
    [0.7, 0.78],
    ["blur(6px)", "blur(0px)"]
  );

  // ── SCROLL INDICATOR ──
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.04],
    [1, 0]
  );

  // ── VIGNETTE intensity — pulses with text phases ──
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.35, 0.5, 0.65, 0.85, 1],
    [0.7, 0.5, 0.65, 0.45, 0.65, 0.5, 0.75]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] bg-background"
      aria-label="Hero cinematic sequence"
    >
      {/* ──────────── STICKY VIEWPORT ──────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas — the scroll-driven video */}
        <SequenceCanvas
          path="/sequence-1"
          frameCount={96}
          progress={scrollYProgress}
          className="absolute inset-0"
          onLoadProgress={onLoadProgress}
          onLoaded={onLoaded}
        />

        {/* ═══ RADIAL VIGNETTE — sides dark, center bright ═══ */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(5,5,5,0.25) 50%, rgba(5,5,5,0.75) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top + bottom gradient fades */}
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 z-[5] pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/80 to-transparent" />
        </motion.div>

        {/* ═══════════════════════════════════════════
             PHASE 1 — OPENING: Side-placed text
             Like Jesko Jets "We are movement" layout
            ═══════════════════════════════════════════ */}

        {/* TOP-LEFT: Big display text */}
        <motion.div
          style={{
            opacity: topLeftOpacity,
            x: topLeftX,
            filter: topLeftBlur,
          }}
          className="absolute top-[15vh] left-8 md:left-12 lg:left-16 z-10 pointer-events-none"
        >
          <h1 className="font-display text-[clamp(2.5rem,7vw,7rem)] uppercase leading-[0.95] font-extralight tracking-[0.02em]">
            Work.
            <br />
            Live.
            <br />
            <span className="text-white/70">Leisure.</span>
          </h1>
        </motion.div>

        {/* BOTTOM-RIGHT: Big italic/serif statement */}
        <motion.div
          style={{
            opacity: bottomRightOpacity,
            x: bottomRightX,
            filter: bottomRightBlur,
          }}
          className="absolute bottom-[12vh] right-8 md:right-12 lg:right-16 z-10 pointer-events-none text-right"
        >
          <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] uppercase leading-[0.95] font-extralight tracking-[0.02em]">
            We are
            <br />
            <span className="font-light italic tracking-[0.04em]">nature</span>
          </h2>
        </motion.div>

        {/* BOTTOM-LEFT: Editorial tagline + paragraph */}
        <motion.div
          style={{
            opacity: bottomLeftOpacity,
            y: bottomLeftY,
          }}
          className="absolute bottom-[12vh] left-8 md:left-12 lg:left-16 z-10 pointer-events-none max-w-xs md:max-w-sm"
        >
          <p className="font-display text-base md:text-lg font-medium italic tracking-wide mb-3 text-white/90">
            Your freedom to
            <br />
            live differently
          </p>
          <div className="w-8 h-[1px] bg-white/30 mb-3" />
          <p className="text-[11px] md:text-xs leading-relaxed text-white/40 font-light tracking-wide">
            Every stay is designed around your rhythm —
            <br />
            so you can focus on what truly matters,
            <br />
            while nature takes care of everything else.
          </p>
        </motion.div>

        {/* BOTTOM-CENTER: Scroll indicator (Jesko-style) */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/30"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 0L5 10M5 10L0 5M5 10L10 5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </motion.div>
            <span className="text-[9px] tracking-[0.35em] uppercase text-white/30 font-light">
              Scroll down
            </span>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/20 font-light hidden sm:block">
            to start the journey
          </span>
        </motion.div>

        {/* ═══════════════════════════════════════════
             PHASE 2 — MID-FLIGHT: Center statement
             Drone is inside the compound, big reveal
            ═══════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: centerOpacity,
            y: centerY,
            scale: centerScale,
            filter: centerBlur,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center px-6">
            <h2 className="font-display text-[clamp(2rem,6vw,6.5rem)] uppercase leading-[1] font-extralight tracking-[0.06em] mb-4">
              Escape
              <br />
              <span className="text-white/50">the ordinary</span>
            </h2>
            <p className="text-white/35 text-sm md:text-base tracking-[0.15em] font-light">
              A slower way to live.
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
             PHASE 3 — ARRIVAL: Split reveal
             Drone reaches destination — words from sides
            ═══════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: splitOpacity, filter: splitBlur }}
          className="absolute inset-0 z-10 flex items-center justify-between pointer-events-none px-8 md:px-12 lg:px-16"
        >
          {/* Left word */}
          <motion.div style={{ x: splitLeftX }}>
            <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] uppercase leading-[0.95] font-extralight tracking-[0.04em]">
              Stay
              <br />
              <span className="text-white/40 text-[clamp(1rem,2vw,1.8rem)] tracking-[0.15em]">
                close to nature
              </span>
            </h2>
          </motion.div>

          {/* Right word */}
          <motion.div style={{ x: splitRightX }} className="text-right">
            <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] uppercase leading-[0.95] font-extralight tracking-[0.04em]">
              Experience
              <br />
              <span className="text-white/40 text-[clamp(1rem,2vw,1.8rem)] tracking-[0.15em]">
                what matters
              </span>
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
