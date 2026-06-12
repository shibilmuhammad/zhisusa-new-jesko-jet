/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-48 md:py-64 lg:py-80 px-6 md:px-10 bg-[#060a09] flex items-center justify-center overflow-hidden"
      aria-label="Book your journey"
    >
      {/* Background Image Layer with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] origin-center z-0"
      >
        <img
          src="/cta_background.png"
          alt="Luxury forest cabin background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay to ensure copy readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-black/55 to-[#0a0a0a]/90" />
      </motion.div>

      <motion.div
        style={{ scale, opacity }}
        className="text-center z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Decorative top line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] bg-brand-cream/20 mb-16"
        />

        <motion.h2
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-9xl uppercase tracking-[0.08em] font-extralight mb-8 leading-tight text-white"
        >
          Ready to
          <br />
          <span className="text-[#D8C3A5]">Escape?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-brand-cream/80 text-base md:text-lg tracking-wide font-light mb-16 max-w-lg text-balance"
        >
          Begin your journey to a place where nature sets the pace, and every
          moment is yours to define.
        </motion.p>

        <motion.button
          onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(255,255,255,0.6)",
          }}
          whileTap={{ scale: 0.98 }}
          className="relative border border-brand-cream/35 px-14 py-5 rounded-full uppercase tracking-[0.2em] text-sm font-light transition-colors duration-700 group overflow-hidden text-brand-cream"
        >
          {/* Hover fill effect */}
          <span className="absolute inset-0 bg-brand-cream scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-cinematic origin-left rounded-full" />
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            Book Your Journey
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}
