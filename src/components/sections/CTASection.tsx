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
  const glowScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.5]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-48 md:py-64 lg:py-80 px-6 md:px-10 bg-background flex items-center justify-center overflow-hidden"
      aria-label="Book your journey"
    >
      {/* Ambient lighting — radial glow */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_50%)] pointer-events-none"
      />

      <motion.div
        style={{ scale, opacity }}
        className="text-center z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Decorative top element */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] bg-white/15 mb-16"
        />

        <motion.h2
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-9xl uppercase tracking-[0.08em] font-extralight mb-8 leading-tight"
        >
          Ready to
          <br />
          <span className="text-white/60">Escape?</span>
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
          className="text-white/30 text-base md:text-lg tracking-wide font-light mb-16 max-w-lg text-balance"
        >
          Begin your journey to a place where nature sets the pace, and every
          moment is yours to define.
        </motion.p>

        <motion.button
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
            borderColor: "rgba(255,255,255,0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          className="relative border border-white/15 px-14 py-5 rounded-full uppercase tracking-[0.2em] text-sm font-light transition-colors duration-700 group overflow-hidden"
        >
          {/* Hover fill effect */}
          <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-cinematic origin-left rounded-full" />
          <span className="relative z-10 group-hover:text-background transition-colors duration-500">
            Book Your Journey
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}
