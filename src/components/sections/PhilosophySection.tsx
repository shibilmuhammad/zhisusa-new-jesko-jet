"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeText } from "../cinematic/FadeText";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.95, 1]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-40 md:py-56 lg:py-64 px-6 md:px-10 lg:px-16 bg-background overflow-hidden"
      aria-label="Our philosophy"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_rgba(138,154,134,0.3)_0%,_transparent_50%)] pointer-events-none" />

      <motion.div
        style={{ opacity, scale }}
        className="max-w-4xl mx-auto text-center"
      >
        <FadeText>
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="w-16 h-[1px] bg-white/10" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/20 font-light">
              Our Philosophy
            </span>
            <div className="w-16 h-[1px] bg-white/10" />
          </div>
        </FadeText>

        <motion.blockquote style={{ y: quoteY }}>
          <FadeText delay={0.2}>
            <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.08em] font-extralight leading-relaxed mb-12 text-balance">
              We don&apos;t build resorts.
              <br />
              <span className="text-white/40">We create worlds</span>
              <br />
              where time moves differently.
            </p>
          </FadeText>
        </motion.blockquote>

        <FadeText delay={0.4}>
          <p className="text-white/25 text-base md:text-lg tracking-wide font-light max-w-2xl mx-auto text-balance">
            Zhisusa was born from a simple belief — that the best work, the
            deepest rest, and the most meaningful connections happen when we
            return to nature. Not as tourists, but as residents of a gentler
            world.
          </p>
        </FadeText>
      </motion.div>
    </section>
  );
}
