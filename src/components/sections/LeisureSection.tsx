"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeText } from "../cinematic/FadeText";
import { Anchor, Fish, Volleyball, CircleDashed, Flame, Star, Sun, ChevronRight, ChevronLeft } from "lucide-react";

const activities = [
  { 
    name: "Kayaking", 
    timePhase: "Dawn", 
    time: "6:00 AM",
    desc: "Paddle into peaceful mornings.",
    icon: Anchor 
  },
  { 
    name: "Fishing", 
    timePhase: "Morning", 
    time: "8:30 AM",
    desc: "Cast a line, catch a moment.",
    icon: Fish 
  },
  { 
    name: "Volleyball", 
    timePhase: "Late Morning", 
    time: "10:30 AM",
    desc: "Play, laugh, connect.",
    icon: Volleyball 
  },
  { 
    name: "Tennis", 
    timePhase: "Afternoon", 
    time: "2:00 PM",
    desc: "Rally under the open sky.",
    icon: CircleDashed 
  },
  { 
    name: "Bonfires", 
    timePhase: "Sunset", 
    time: "6:30 PM",
    desc: "Stories, warmth & starry views.",
    icon: Flame 
  },
  { 
    name: "Stargazing", 
    timePhase: "Night", 
    time: "8:30 PM",
    desc: "Look up. Disconnect to reconnect.",
    icon: Star 
  },
];

export function LeisureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[900px] md:h-screen bg-background overflow-hidden flex flex-col justify-end pb-12 pt-24"
      aria-label="Leisure experiences"
    >
      {/* ── Background Image Layer ── */}
      <motion.div 
        style={{ scale: imageScale }}
        className="absolute top-0 left-0 w-full md:w-[65%] h-full origin-left z-0"
      >
        <img 
          src="/leisure_kayaking.png" 
          alt="Kayaking at sunrise" 
          className="w-full h-full object-cover object-[30%_center]" 
        />
        {/* Gradients to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/80 to-background hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </motion.div>

      {/* ── Top/Middle Content ── */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col items-end mb-auto pt-8 pointer-events-none">
        <FadeText>
          <motion.h2 
            style={{ y: headingY }}
            className="font-display text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem] uppercase tracking-[-0.02em] font-light leading-[0.8] text-brand-forest/[0.08] select-none text-right"
          >
            Leisure.
          </motion.h2>
        </FadeText>
        
        <div className="mt-[-1.5rem] md:mt-[-4rem] flex flex-col items-end max-w-xl text-right z-20 pointer-events-auto">
          <FadeText delay={0.2}>
            <h3 className="font-display text-3xl md:text-5xl lg:text-[4rem] uppercase tracking-[0.05em] font-medium text-brand-forest mb-4 md:mb-6 leading-[1.05]">
              Life Beyond<br/>The Screen
            </h3>
          </FadeText>
          <FadeText delay={0.3}>
            <p className="text-brand-forest/80 text-xs md:text-base tracking-wide font-sans leading-relaxed max-w-sm md:max-w-md ml-auto">
              Kayaking at sunrise. Bonfires after midnight.<br className="hidden md:block" /> Slow conversations under quiet skies.
            </p>
          </FadeText>
        </div>
      </div>

      {/* ── Bottom Timeline ── */}
      <div className="relative w-full px-6 md:px-12 lg:px-16 z-20 mt-16 md:mt-24">
        
        {/* Timeline Container */}
        <div className="relative w-full max-w-[1400px] mx-auto">
          {/* SVG Wavy Line (Hidden on Mobile) */}
          <div className="absolute top-[4.5rem] left-[4rem] right-[4rem] h-10 z-0 hidden md:block">
             <motion.svg 
               initial={{ pathLength: 0, opacity: 0 }}
               whileInView={{ pathLength: 1, opacity: 1 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 2, ease: "easeInOut" }}
               className="w-full h-full text-brand-forest/30" 
               preserveAspectRatio="none" 
               viewBox="0 0 100 24"
             >
               <path d="M 0 12 Q 10 0, 20 12 T 40 12 T 60 12 T 80 12 T 100 12" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2.5" />
             </motion.svg>
          </div>

          {/* Activities List */}
          <div className="relative flex flex-nowrap overflow-x-auto md:overflow-visible justify-start md:justify-between items-start gap-6 md:gap-4 pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activities.map((act, i) => (
              <motion.div 
                key={act.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-28 md:w-32 flex-shrink-0 flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Time Phase */}
                <div className="h-10 flex flex-col items-center justify-end mb-4">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-forest/90 mb-1 whitespace-nowrap">{act.timePhase}</span>
                  <span className="text-[9px] md:text-[10px] tracking-wider text-brand-forest/50 font-medium whitespace-nowrap">{act.time}</span>
                </div>

                {/* Icon in Circle */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-forest/20 flex items-center justify-center bg-background group-hover:bg-brand-forest group-hover:border-brand-forest transition-all duration-500 z-10 mb-4 md:mb-5 relative">
                  <act.icon size={16} strokeWidth={1.5} className="text-brand-forest group-hover:text-white transition-colors duration-500 md:w-[18px] md:h-[18px]" />
                  {/* Outer pulse ring on hover */}
                  <div className="absolute inset-0 rounded-full border border-brand-forest/0 group-hover:border-brand-forest/30 group-hover:scale-[1.3] transition-all duration-700 pointer-events-none" />
                </div>

                {/* Title & Desc */}
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.1em] font-medium text-brand-forest mb-2 group-hover:text-brand-teal transition-colors duration-500">{act.name}</h4>
                <p className="text-[9px] md:text-[11px] leading-relaxed text-brand-forest/60 font-sans px-1 opacity-80 group-hover:opacity-100 transition-opacity duration-500">{act.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Elements */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 md:mt-16 flex flex-col lg:flex-row items-center justify-between border-t border-brand-forest/10 pt-6 gap-6 lg:gap-0 max-w-[1400px] mx-auto"
        >
          {/* Tip */}
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-brand-terra" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium text-brand-forest/60">TIP: CHECK WEATHER & SUN TIMES</span>
          </div>

          {/* Button */}
          <button className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-brand-forest/80 hover:bg-brand-forest transition-colors duration-500 text-white group backdrop-blur-sm shadow-lg shadow-brand-forest/10">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">VIEW FULL ACTIVITY GUIDE</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Pagination */}
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full border border-brand-forest/20 flex items-center justify-center hover:bg-brand-forest hover:text-white transition-colors text-brand-forest/60">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] tracking-[0.2em] font-medium text-brand-forest/60">1 / 7</span>
            <button className="w-8 h-8 rounded-full border border-brand-forest/20 flex items-center justify-center hover:bg-brand-forest hover:text-white transition-colors text-brand-forest/60">
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
