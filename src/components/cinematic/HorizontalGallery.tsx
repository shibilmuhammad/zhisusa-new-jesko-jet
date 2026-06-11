"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, MouseEvent } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface GalleryCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  index: string;
}

export interface HorizontalGalleryProps {
  watermark: string;
  tagline: string;
  taglineEmphasis?: string;
  cards: GalleryCard[];
  ariaLabel?: string;
}

// ── Component ────────────────────────────────────────────────────────────────
export function HorizontalGallery({
  watermark,
  tagline,
  taglineEmphasis,
  cards,
  ariaLabel = "Horizontal gallery",
}: HorizontalGalleryProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // ── Drag to Scroll State ──
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ── Progress Bar State ──
  const [scrollProgress, setScrollProgress] = useState(0);

  // Split tagline for optional italic emphasis
  const taglineBase = taglineEmphasis
    ? tagline.replace(taglineEmphasis, "").trim()
    : tagline;

  // ── Handlers ──
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };

  // Click to center image
  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    // If we are dragging, don't trigger click action
    if (isDown && sliderRef.current) {
      // Small movements might be interpreted as clicks, we can ignore them if needed.
    }
    
    const target = e.currentTarget;
    if (sliderRef.current) {
      const containerCenter = sliderRef.current.clientWidth / 2;
      const itemCenter = target.offsetLeft + target.clientWidth / 2;
      sliderRef.current.scrollTo({
        left: itemCenter - containerCenter,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="relative bg-background py-16 md:py-24 overflow-hidden flex flex-col"
      aria-label={ariaLabel}
    >
      {/* ══ HEADER ROW: title left + tagline right ══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4 px-8 md:px-12 lg:px-16 pb-4 md:pb-5 flex-shrink-0"
      >
        {/* ── Big gradient title ── */}
        <h2
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
        </h2>

        {/* ── Right-side tagline ── */}
        <div className="text-left sm:text-right mb-1 sm:mb-3 md:mb-4 flex-shrink-0 max-w-[240px]">
          <p className="text-brand-teal text-sm md:text-base tracking-wide font-sans leading-snug">
            {taglineBase}{" "}
            {taglineEmphasis && (
              <em className="not-italic font-semibold text-brand-forest">
                {taglineEmphasis}
              </em>
            )}
          </p>
        </div>
      </motion.div>

      {/* ── Thin separator line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-[1px] mx-8 md:mx-12 lg:mx-16 bg-brand-forest/[0.08] origin-left flex-shrink-0 mb-8 md:mb-12"
      />

      {/* ══ SCROLLABLE / DRAGGABLE GALLERY ══ */}
      <div 
        ref={sliderRef}
        className={`relative w-full overflow-x-auto flex items-start gap-4 md:gap-5 pl-8 md:pl-12 lg:pl-16 pr-[15vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDown ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
      >
        {cards.map((item, index) => (
          <div
            key={item.title}
            onClick={handleImageClick}
            className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[44vw] lg:w-[36vw] xl:w-[30vw] h-[55vh] md:h-[65vh] rounded-[16px] md:rounded-[20px] overflow-hidden group"
          >
            {/* Card Image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-cinematic group-hover:scale-[1.06] pointer-events-none"
              draggable={false}
              loading={index < 2 ? "eager" : "lazy"}
            />

            {/* Strong bottom gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Card Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 lg:p-8 pointer-events-none">
              <span className="text-[9px] tracking-[0.45em] uppercase text-brand-terra font-sans font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {item.index}
              </span>

              <div className="transform translate-y-1.5 group-hover:translate-y-0 transition-transform duration-600 ease-cinematic">
                <p className="text-[10px] uppercase tracking-[0.28em] text-brand-terra/80 font-sans mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-50">
                  {item.subtitle}
                </p>

                <h4 className="font-display text-xl md:text-2xl lg:text-[1.65rem] uppercase tracking-[0.1em] font-medium text-white leading-tight">
                  {item.title}
                </h4>

                <p className="text-white/80 text-[11px] md:text-xs tracking-wide font-sans leading-relaxed mt-2 max-w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-sm pointer-events-none" />

            {/* Bottom teal accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-teal/0 via-brand-teal/40 to-brand-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* ── Progress indicator bottom-left ── */}
      <div className="pl-8 md:pl-12 lg:pl-16 mt-8 md:mt-12">
        <div className="w-24 h-[1px] bg-brand-forest/[0.1] relative overflow-hidden rounded-full">
          <div
            style={{ width: `${scrollProgress * 100}%` }}
            className="absolute inset-y-0 left-0 bg-brand-teal/60 rounded-full transition-all duration-300 ease-out"
          />
        </div>
        <p className="text-[8px] uppercase tracking-[0.45em] text-brand-teal mt-1.5 font-sans">
          Scroll or drag to explore
        </p>
      </div>
    </section>
  );
}
