"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface GalleryCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  index: string;
}

export interface HorizontalGalleryProps {
  /** Large title text e.g. "STAY" */
  watermark: string;
  /** Short right-side tagline e.g. "Find your perfect retreat." */
  tagline: string;
  /** Optional italic emphasis within tagline (last word) */
  taglineEmphasis?: string;
  /** Cards to display */
  cards: GalleryCard[];
  /** aria-label for the section element */
  ariaLabel?: string;
  /** Total vertical scroll height that drives horizontal movement (default 200vh) */
  sectionHeight?: string;
}

// ── Component ────────────────────────────────────────────────────────────────
export function HorizontalGallery({
  watermark,
  tagline,
  taglineEmphasis,
  cards,
  ariaLabel = "Horizontal gallery",
  sectionHeight = "200vh",
}: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cinematic spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 60,
    mass: 0.3,
    restDelta: 0.0001,
  });

  // Trigger text intro shortly after the section pins
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.01 && !isTextVisible) {
      setIsTextVisible(true);
    } else if (latest <= 0.01 && isTextVisible) {
      setIsTextVisible(false);
    }
  });

  // ── Responsive scroll distance to avoid Safari calc() crashes ──
  const [endX, setEndX] = useState("-44%");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setEndX("-85%"); // Mobile needs to travel further for wide cards
      } else if (window.innerWidth < 1024) {
        setEndX("-65%"); // Tablet
      } else {
        setEndX("-44%"); // Desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const galleryX = useTransform(smoothProgress, [0.05, 1.0], ["0%", endX]);

  // ── Outro fades ──────────────────────────────────────────────────────────
  const headerOutro = useTransform(smoothProgress, [0.88, 1.0], [1, 0]);

  // ── Progress bar ─────────────────────────────────────────────────────────
  const progressWidth = useTransform(smoothProgress, [0.05, 1.0], ["0%", "100%"]);

  // ── Per-card parallax ─────────────────────────────────────────────────────
  const parallaxValues = [
    useTransform(smoothProgress, [0.05, 1.0], [0, -10]),
    useTransform(smoothProgress, [0.05, 1.0], [0, -20]),
    useTransform(smoothProgress, [0.05, 1.0], [0, -32]),
    useTransform(smoothProgress, [0.05, 1.0], [0, -44]),
  ];

  // ── Per-card scale ────────────────────────────────────────────────────────
  const scaleValues = [
    useTransform(smoothProgress, [0.02, 0.12, 0.28, 0.38], [0.94, 1, 1, 0.97]),
    useTransform(smoothProgress, [0.12, 0.25, 0.40, 0.52], [0.94, 1, 1, 0.97]),
    useTransform(smoothProgress, [0.25, 0.40, 0.55, 0.65], [0.94, 1, 1, 0.97]),
    useTransform(smoothProgress, [0.40, 0.55, 0.68, 0.80], [0.94, 1, 1, 0.97]),
  ];

  // ── Per-card opacity ──────────────────────────────────────────────────────
  const opacityValues = [
    useTransform(smoothProgress, [0.02, 0.10, 0.30, 0.45], [0.4, 1, 1, 0.7]),
    useTransform(smoothProgress, [0.10, 0.25, 0.45, 0.60], [0.4, 1, 1, 0.7]),
    useTransform(smoothProgress, [0.25, 0.40, 0.60, 0.80], [0.4, 1, 1, 0.7]),
    useTransform(smoothProgress, [0.40, 0.60, 0.85, 1.0],  [0.4, 1, 1, 1.0]),
  ];

  // Split tagline for optional italic emphasis
  const taglineBase = taglineEmphasis
    ? tagline.replace(taglineEmphasis, "").trim()
    : tagline;

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
      aria-label={ariaLabel}
    >
      {/* ── STICKY VIEWPORT ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col will-change-transform">

        {/* ══ HEADER ROW: title left + tagline right ══ */}
        <motion.div
          style={{ opacity: headerOutro }}
          className="relative z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4 px-8 md:px-12 lg:px-16 pt-16 md:pt-20 pb-4 md:pb-5 flex-shrink-0"
        >
          {/* ── Big gradient title ── */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 50 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[12rem] uppercase tracking-[-0.01em] font-light leading-[0.88] select-none"
            style={{
              backgroundImage:
                "linear-gradient(160deg, #1F3A36 0%, #4E7C7A 45%, #8aaa98 75%, rgba(31,58,54,0.25) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {watermark}
          </motion.h2>

          {/* ── Right-side tagline ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isTextVisible ? 1 : 0, x: isTextVisible ? 0 : 20 }}
            transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-left sm:text-right mb-1 sm:mb-3 md:mb-4 flex-shrink-0 max-w-[240px]"
          >
            <p className="text-brand-teal text-sm md:text-base tracking-wide font-sans leading-snug">
              {taglineBase}{" "}
              {taglineEmphasis && (
                <em className="not-italic font-semibold text-brand-forest">
                  {taglineEmphasis}
                </em>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* ── Thin separator line ── */}
        <motion.div
          style={{ opacity: headerOutro }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isTextVisible ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] mx-8 md:mx-12 lg:mx-16 bg-brand-forest/[0.08] origin-left flex-shrink-0"
        />

        {/* ══ GALLERY: fixed height with breathing room ══ */}
        <div className="relative flex-1 min-h-0 mt-3 md:mt-4 mb-8 md:mb-10">
          <motion.div
            style={{ x: galleryX }}
            className="absolute top-0 bottom-0 flex items-start gap-4 md:gap-5 pl-8 md:pl-12 lg:pl-16 pr-[15vw]"
          >
            {cards.map((item, index) => (
              <motion.div
                key={item.title}
                style={{
                  y: parallaxValues[index] ?? parallaxValues[0],
                  scale: scaleValues[index] ?? scaleValues[0],
                  opacity: opacityValues[index] ?? opacityValues[0],
                }}
                className="relative flex-shrink-0 w-[60vw] sm:w-[52vw] md:w-[44vw] lg:w-[36vw] xl:w-[30vw] h-[62vh] md:h-[65vh] rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer group"
              >
                {/* Card Image — fills full card height */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-cinematic group-hover:scale-[1.06]"
                  style={{ willChange: "transform" }}
                  loading={index < 2 ? "eager" : "lazy"}
                />

                {/* Strong bottom gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 lg:p-8">
                  {/* Index tag */}
                  <span className="text-[9px] tracking-[0.45em] uppercase text-brand-terra font-sans font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.index}
                  </span>

                  <div className="transform translate-y-1.5 group-hover:translate-y-0 transition-transform duration-600 ease-cinematic">
                    {/* Subtitle */}
                    <p className="text-[10px] uppercase tracking-[0.28em] text-brand-terra/80 font-sans mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-50">
                      {item.subtitle}
                    </p>

                    {/* Title — always visible */}
                    <h4 className="font-display text-xl md:text-2xl lg:text-[1.65rem] uppercase tracking-[0.1em] font-medium text-white leading-tight">
                      {item.title}
                    </h4>

                    {/* Description — hover only */}
                    <p className="text-white/80 text-[11px] md:text-xs tracking-wide font-sans leading-relaxed mt-2 max-w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-sm" />

                {/* Bottom teal accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-teal/0 via-brand-teal/40 to-brand-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Progress indicator bottom-left ── */}
        <motion.div
          style={{ opacity: headerOutro }}
          className="absolute bottom-6 left-8 md:left-12 lg:left-16 z-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: isTextVisible ? 1 : 0, x: isTextVisible ? 0 : -16 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-24 h-[1px] bg-brand-forest/[0.1] relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-brand-teal/60 rounded-full"
              />
            </div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-brand-teal mt-1.5 font-sans">
              Scroll to explore
            </p>
          </motion.div>
        </motion.div>

        {/* Only top edge gradient — no bottom gradient blocking images */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
