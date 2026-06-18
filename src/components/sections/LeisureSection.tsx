/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { FadeText } from "../cinematic/FadeText";
import { Anchor, Fish, Volleyball, CircleDashed, Flame, Star, Sun } from "lucide-react";

const activities = [
  {
    name: "Kayaking",
    timePhase: "Dawn",
    time: "6:00 AM",
    desc: "Paddle into peaceful mornings.",
    icon: Anchor,
    image: "/1_Kayaking.png"
  },
  {
    name: "Fishing",
    timePhase: "Morning",
    time: "8:30 AM",
    desc: "Cast a line, catch a moment.",
    icon: Fish,
    image: "/2_Gardening.png"
  },
  {
    name: "Volleyball",
    timePhase: "Late Morning",
    time: "10:30 AM",
    desc: "Play, laugh, connect.",
    icon: Volleyball,
    image: "/3_Volleyball.png"
  },
  {
    name: "Tennis",
    timePhase: "Afternoon",
    time: "2:00 PM",
    desc: "Rally under the open sky.",
    icon: CircleDashed,
    image: "/leisure_tennis.png"
  },
  {
    name: "Bonfires",
    timePhase: "Sunset",
    time: "6:30 PM",
    desc: "Stories, warmth & starry views.",
    icon: Flame,
    image: "/leisure_bonfire.png"
  },
  {
    name: "Stargazing",
    timePhase: "Night",
    time: "8:30 PM",
    desc: "Look up. Disconnect to reconnect.",
    icon: Star,
    image: "/leisure_stargazing.png"
  },
];

export function LeisureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const [activeActivity, setActiveActivity] = useState(activities[0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[650px] lg:h-screen bg-background overflow-hidden flex flex-col"
      aria-label="Leisure experiences"
    >
      {/* ── Background Image Layer (absolute to cover behind text and timeline) ── */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute top-0 left-0 w-full h-[85%] md:h-full origin-left z-0 overflow-hidden"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={activeActivity.image}
            src={activeActivity.image}
            alt={activeActivity.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-[30%_center]"
          />
        </AnimatePresence>
        {/* Gradients to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-background md:to-[75%] hidden md:block z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent md:hidden z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/95 z-10 pointer-events-none" />
      </motion.div>

      {/* ── Top/Middle Content ── */}
      <div className="relative w-full flex flex-col justify-center items-center md:items-end pt-32 md:pt-40 z-10 flex-shrink-0">

        {/* Right Text Content */}
        <div className="relative px-6 md:px-16 lg:px-24 flex flex-col items-center md:items-end w-full">
          <FadeText>
            <motion.h2
              style={{ y: headingY }}
              className="font-display  text-[4.8rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem] uppercase tracking-[-0.02em] font-light leading-[0.8] text-brand-forest/[0.22] select-none text-center md:text-right w-full overflow-hidden whitespace-nowrap"
            >
              Leisure.
            </motion.h2>
          </FadeText>

          <div className="mt-[-2rem] md:mt-[-4rem] flex flex-col items-center md:items-end max-w-xl text-center md:text-right z-20">
            <FadeText delay={0.2}>
              <h3 className="font-display mt-12 lg:mt-20 text-[2.5rem] md:text-5xl lg:text-[4rem] uppercase tracking-[0.05em] font-medium text-brand-forest mb-4 md:mb-6 leading-[1.05]">
                Life Beyond<br />The Screen
              </h3>
            </FadeText>
            <FadeText delay={0.3}>
              <p className="text-brand-forest/90 text-sm md:text-base tracking-wide font-sans leading-relaxed max-w-[280px] md:max-w-md mx-auto md:ml-auto md:mr-0 drop-shadow-sm font-medium">
                Kayaking at sunrise. Bonfires after midnight.<br className="hidden md:block" /> Slow conversations under quiet skies.
              </p>
            </FadeText>
          </div>
        </div>
      </div>

      {/* ── Bottom Timeline ── */}
      <div className="relative w-full px-6 md:px-12 lg:px-16 pb-8 md:pb-12 pt-16 md:pt-20 z-20 mt-8 md:mt-auto">

        {/* Timeline Container */}
        <div className="relative w-full max-w-[1400px] mx-auto">
          {/* SVG Wavy Line (Hidden on Mobile) */}
          <div className="absolute top-[5rem] left-[4rem] right-[4rem] h-10 z-0 hidden md:block">
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full h-full text-brand-forest/30"
              preserveAspectRatio="none"
              viewBox="0 0 100 24"
            >
              <path d="M 0 12 Q 10 0, 20 12 T 40 12 T 60 12 T 80 12 T 100 12" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 2" />
            </motion.svg>
          </div>

          {/* Activities List */}
          <div className="relative flex flex-nowrap overflow-x-auto md:overflow-visible justify-start md:justify-between items-start gap-6 md:gap-4 pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activities.map((act, i) => {
              const isActive = activeActivity.name === act.name;
              return (
                <motion.div
                  key={act.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="w-28 md:w-32 flex-shrink-0 flex flex-col items-center text-center group cursor-pointer"
                  onMouseEnter={() => {
                    if (activeActivity.name !== act.name) {
                      setActiveActivity(act);
                    }
                  }}
                  onClick={() => {
                    if (activeActivity.name !== act.name) {
                      setActiveActivity(act);
                    }
                  }}
                >
                  {/* Time Phase */}
                  <div className="h-10 flex flex-col items-center justify-end mb-4">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-forest/90 mb-1 whitespace-nowrap">{act.timePhase}</span>
                    <span className="text-[9px] md:text-[10px] tracking-wider text-brand-forest/50 font-medium whitespace-nowrap">{act.time}</span>
                  </div>

                  {/* Icon in Circle */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-500 z-10 mb-4 md:mb-5 relative ${
                    isActive 
                      ? "bg-brand-forest border-brand-forest text-white scale-110 shadow-md shadow-brand-forest/20" 
                      : "bg-background border-brand-forest/20 text-brand-forest group-hover:bg-brand-forest group-hover:border-brand-forest group-hover:text-white"
                  }`}>
                    <act.icon 
                      size={16} 
                      strokeWidth={1.5} 
                      className={`transition-colors duration-500 md:w-[18px] md:h-[18px] ${
                        isActive ? "text-white" : "text-brand-forest group-hover:text-white"
                      }`} 
                    />
                    {/* Outer pulse ring on hover/active */}
                    <div className={`absolute inset-0 rounded-full border transition-all duration-700 pointer-events-none ${
                      isActive 
                        ? "border-brand-forest/30 scale-[1.3]" 
                        : "border-brand-forest/0 group-hover:border-brand-forest/30 group-hover:scale-[1.3]"
                    }`} />
                  </div>

                  {/* Title & Desc */}
                  <h4 className={`font-display text-xs md:text-sm uppercase tracking-[0.1em] font-medium transition-colors duration-500 mb-2 ${
                    isActive ? "text-brand-teal scale-105" : "text-brand-forest group-hover:text-brand-teal"
                  }`}>
                    {act.name}
                  </h4>
                  <p className={`text-[9px] md:text-[11px] leading-relaxed font-sans px-1 transition-all duration-500 ${
                    isActive 
                      ? "text-brand-forest/90 opacity-100" 
                      : "text-brand-forest/60 opacity-80 group-hover:opacity-100 group-hover:text-brand-forest/90"
                  }`}>
                    {act.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 md:mt-16 flex items-center justify-center border-t border-brand-forest/10 pt-6 max-w-[1400px] mx-auto"
        >
          {/* Tip */}
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-brand-terra" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium text-brand-forest/60">TIP: CHECK WEATHER & SUN TIMES</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
