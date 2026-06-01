"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

const accommodations = [
  {
    title: "Private Villas",
    subtitle: "Hidden between forests",
    description: "Wrapped in silence, designed for slow mornings and open skies.",
    image: "/stay_villa_1778668418060.png",
    index: "01",
  },
  {
    title: "Luxury Tents",
    subtitle: "Beneath open skies",
    description: "Where comfort meets wilderness — unfiltered and untouched.",
    image: "/stay_tent_1778668433003.png",
    index: "02",
  },
  {
    title: "Tree Houses",
    subtitle: "Built for silence",
    description: "Elevated above the ordinary, surrounded by canopy and calm.",
    image: "/stay_treehouse_1778668450104.png",
    index: "03",
  },
  {
    title: "Glass Cabins",
    subtitle: "Nothing between you and the sky",
    description: "Nature on every side — transparent living at its finest.",
    image: "/stay_cabin_1778668472270.png",
    index: "04",
  },
];

// Section height controls how much vertical scroll drives the horizontal travel.
// At ~200vh the sticky releases gradually, giving the WORK section room to emerge.
const SECTION_HEIGHT = "200vh";

export function StaySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cinematic spring for buttery-smooth motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 60,
    mass: 0.3,
    restDelta: 0.0001,
  });

  // Trigger cinematic text animations shortly after pinning
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.01 && !isTextVisible) {
      setIsTextVisible(true);
    } else if (latest <= 0.01 && isTextVisible) {
      setIsTextVisible(false);
    }
  });

  // ──────────────────────────────────────────────────────────────
  // HORIZONTAL GALLERY TRAVEL
  // Spreads across the entire scroll length. It reaches the end exactly
  // when the section un-sticks, so the next section follows immediately.
  // ──────────────────────────────────────────────────────────────
  const galleryX = useTransform(smoothProgress, [0.05, 1.0], ["2%", "-40%"]);

  // ── Editorial text animations
  // Outro is handled here to fade out right at the end of the section.
  const textOutroOpacity = useTransform(smoothProgress, [0.9, 1.0], [1, 0]);

  // ── Progress bar
  const progressWidth = useTransform(smoothProgress, [0.05, 1.0], ["0%", "100%"]);

  // ── Per-card parallax
  const card0Parallax = useTransform(smoothProgress, [0.05, 1.0], [0, -12]);
  const card1Parallax = useTransform(smoothProgress, [0.05, 1.0], [0, -25]);
  const card2Parallax = useTransform(smoothProgress, [0.05, 1.0], [0, -40]);
  const card3Parallax = useTransform(smoothProgress, [0.05, 1.0], [0, -55]);
  const cardParallax = [card0Parallax, card1Parallax, card2Parallax, card3Parallax];

  // ── Per-card scale
  const card0Scale = useTransform(smoothProgress, [0.02, 0.12, 0.28, 0.38], [0.94, 1, 1, 0.97]);
  const card1Scale = useTransform(smoothProgress, [0.12, 0.25, 0.40, 0.52], [0.94, 1, 1, 0.97]);
  const card2Scale = useTransform(smoothProgress, [0.25, 0.40, 0.55, 0.65], [0.94, 1, 1, 0.97]);
  const card3Scale = useTransform(smoothProgress, [0.40, 0.55, 0.68, 0.80], [0.94, 1, 1, 0.97]);
  const cardScales = [card0Scale, card1Scale, card2Scale, card3Scale];

  // ── Per-card opacity
  const card0Opacity = useTransform(smoothProgress, [0.02, 0.10, 0.30, 0.45], [0.5, 1, 1, 0.6]);
  const card1Opacity = useTransform(smoothProgress, [0.10, 0.25, 0.45, 0.60], [0.5, 1, 1, 0.6]);
  const card2Opacity = useTransform(smoothProgress, [0.25, 0.40, 0.60, 0.80], [0.5, 1, 1, 0.6]);
  const card3Opacity = useTransform(smoothProgress, [0.40, 0.60, 0.85, 1.0], [0.5, 1, 1, 1.0]);
  const cardOpacities = [card0Opacity, card1Opacity, card2Opacity, card3Opacity];

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: SECTION_HEIGHT }}
      aria-label="Stay experiences"
    >
      {/* ── STICKY VIEWPORT ── */}
      {/* Standard sticky block. No artificial fading. */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col will-change-transform"
      >

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP: Editorial text block                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: textOutroOpacity }}
          className="relative z-20 px-6 md:px-10 lg:px-16 pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-10 flex-shrink-0"
        >

          {/* Oversized "STAY." watermark */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 40 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[5.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.04em] font-light leading-[0.82] text-brand-forest/[0.06] select-none"
          >
            Stay.
          </motion.h2>

          {/* Section title */}
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 30 }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.12em] font-medium text-brand-forest/90 leading-tight mt-3 md:mt-4"
          >
            Immersive
            <br />
            Accommodations
          </motion.h3>

          {/* Supporting copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 20 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 md:mt-5 max-w-lg"
          >
            <div className="w-10 h-[1px] bg-brand-teal/40 mb-3" />
            <p className="text-brand-forest/50 text-xs md:text-sm tracking-wide leading-relaxed font-sans">
              Private villas hidden between forests. Luxury tents beneath open skies. Tree houses built for silence.
            </p>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* BOTTOM: Horizontal scrolling gallery                      */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 min-h-0">
          <motion.div
            style={{ x: galleryX }}
            className="absolute top-0 h-full flex items-center gap-5 md:gap-7 pl-6 md:pl-10 lg:pl-16 pr-[30vw]"
          >
            {accommodations.map((item, index) => (
              <motion.div
                key={item.title}
                style={{
                  y: cardParallax[index],
                  scale: cardScales[index],
                  opacity: cardOpacities[index],
                }}
                className="relative flex-shrink-0 w-[340px] sm:w-[400px] md:w-[460px] lg:w-[520px] h-[85%] rounded-[20px] md:rounded-[24px] overflow-hidden cursor-pointer group"
              >
                {/* ── Card Image ── */}
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-cinematic group-hover:scale-[1.06]"
                  style={{ willChange: "transform" }}
                  loading={index < 2 ? "eager" : "lazy"}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Subtle edge vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.25)]" />

                {/* ── Card Content ── */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  {/* Index number */}
                  <span className="text-[10px] tracking-[0.4em] uppercase text-brand-teal/60 font-sans font-medium mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {item.index}
                  </span>

                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-cinematic">
                    {/* Subtitle */}
                    <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/45 font-sans mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-75">
                      {item.subtitle}
                    </p>

                    {/* Title */}
                    <h4 className="font-display text-lg md:text-xl lg:text-2xl uppercase tracking-[0.12em] font-medium text-white/90">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-white/45 text-[11px] md:text-xs tracking-wide font-sans leading-relaxed mt-1.5 max-w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-5 right-5 w-6 h-6 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-tr-sm" />

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-teal/0 via-brand-teal/25 to-brand-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </motion.div>

          {/* Left fade for cards entering */}
          <div className="absolute top-0 left-0 bottom-0 w-6 md:w-10 lg:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        </div>

        {/* ── Progress bar (bottom of sticky frame) ── */}
        <motion.div
          style={{ opacity: textOutroOpacity }}
          className="absolute bottom-8 left-6 md:left-10 lg:left-16 z-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isTextVisible ? 1 : 0, x: isTextVisible ? 0 : -20 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-[100px] h-[1px] bg-white/[0.06] relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-brand-teal/50 rounded-full"
              />
            </div>
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/15 mt-2 font-sans">
              Scroll to explore
            </p>
          </motion.div>
        </motion.div>

        {/* ── Edge gradients ── */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
