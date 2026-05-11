"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeText } from "../cinematic/FadeText";

const activities = [
  { name: "Kayaking", time: "Dawn" },
  { name: "Fishing", time: "Morning" },
  { name: "Volleyball", time: "Afternoon" },
  { name: "Table Tennis", time: "Sunset" },
  { name: "Bonfires", time: "Night" },
  { name: "Stargazing", time: "Midnight" },
];

export function LeisureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const listX = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-48 lg:py-56 px-6 md:px-10 lg:px-16 bg-background overflow-hidden"
      aria-label="Leisure experiences"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(138,154,134,0.04)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[90rem] mx-auto">
        {/* Editorial heading — right-aligned for contrast with Stay section */}
        <div className="flex flex-col items-end mb-24 md:mb-32">
          <FadeText>
            <motion.h2
              style={{ y: headingY }}
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] uppercase tracking-[0.05em] font-extralight leading-[0.9] text-white/[0.06] text-right"
            >
              Leisure.
            </motion.h2>
          </FadeText>

          <div className="mt-8 md:mt-12 max-w-2xl text-right">
            <FadeText delay={0.2}>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] font-extralight mb-6">
                Life Beyond
                <br />
                The Screen
              </h3>
            </FadeText>
            <FadeText delay={0.3}>
              <div className="space-y-4 text-white/40 text-base md:text-lg tracking-wide font-light">
                <p>Kayaking at sunrise.</p>
                <p>Bonfires after midnight.</p>
                <p>Slow conversations under quiet skies.</p>
              </div>
            </FadeText>
          </div>
        </div>

        {/* Activity timeline — horizontal scroll-driven list */}
        <motion.div
          style={{ x: listX }}
          className="flex gap-12 md:gap-16 lg:gap-24 overflow-visible py-8"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Time label */}
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-light">
                  {activity.time}
                </span>

                {/* Dot */}
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors duration-700" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-white/10 group-hover:scale-[3] transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                </div>

                {/* Activity name */}
                <span className="font-display text-lg md:text-xl tracking-[0.15em] uppercase font-light text-white/50 group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                  {activity.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative line */}
        <FadeText delay={0.5}>
          <div className="mt-24 flex items-center justify-center gap-6">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-white/15 font-light">
              Every hour, a new story
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
        </FadeText>
      </div>
    </section>
  );
}
