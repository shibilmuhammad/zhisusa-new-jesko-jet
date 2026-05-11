"use client";

import { motion } from "framer-motion";
import { FadeText } from "../cinematic/FadeText";

const experiences = [
  {
    title: "Wellness Spaces",
    description: "Rejuvenate mind and body in nature's sanctuary.",
    span: "col-span-1 md:col-span-2 row-span-1",
    aspect: "aspect-[21/9]",
    gradient: "from-[#121715] to-[#0a0a0a]",
    accentPos: "top-0 right-0",
    accentGradient:
      "bg-[radial-gradient(circle_at_top_right,_rgba(138,154,134,0.08)_0%,_transparent_60%)]",
  },
  {
    title: "Social Gatherings",
    description: "Connect with like-minded souls over shared stories.",
    span: "col-span-1",
    aspect: "aspect-square",
    gradient: "from-[#171412] to-[#0a0a0a]",
    accentPos: "bottom-0 left-0",
    accentGradient:
      "bg-[radial-gradient(circle_at_bottom_left,_rgba(229,220,197,0.06)_0%,_transparent_60%)]",
  },
  {
    title: "Nature Trails",
    description: "Lose yourself in the wild. Find yourself renewed.",
    span: "col-span-1",
    aspect: "aspect-square",
    gradient: "from-[#10150f] to-[#0a0a0a]",
    accentPos: "top-0 left-0",
    accentGradient:
      "bg-[radial-gradient(circle_at_top_left,_rgba(138,154,134,0.06)_0%,_transparent_60%)]",
  },
  {
    title: "Curated Dining",
    description: "Farm-to-table meals crafted with local essence.",
    span: "col-span-1",
    aspect: "aspect-[4/3]",
    gradient: "from-[#151210] to-[#0a0a0a]",
    accentPos: "bottom-0 right-0",
    accentGradient:
      "bg-[radial-gradient(circle_at_bottom_right,_rgba(229,220,197,0.05)_0%,_transparent_60%)]",
  },
  {
    title: "Guided Meditation",
    description: "Stillness sessions at dawn, led by nature itself.",
    span: "col-span-1 md:col-span-2",
    aspect: "aspect-[21/9]",
    gradient: "from-[#111417] to-[#0a0a0a]",
    accentPos: "top-0 left-1/2",
    accentGradient:
      "bg-[radial-gradient(circle_at_top_center,_rgba(232,234,235,0.04)_0%,_transparent_60%)]",
  },
];

export function ExperienceSection() {
  return (
    <section
      className="relative w-full py-32 md:py-48 px-6 md:px-10 lg:px-16 bg-background overflow-hidden"
      aria-label="Curated experiences"
    >
      {/* Section heading */}
      <div className="max-w-[90rem] mx-auto mb-20 md:mb-28">
        <FadeText>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-12 h-[1px] bg-white/15" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-white/25 font-light">
              Curated for you
            </span>
          </div>
        </FadeText>
        <FadeText delay={0.1}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl uppercase tracking-[0.1em] font-extralight mb-6">
            Experiences
          </h2>
        </FadeText>
        <FadeText delay={0.2}>
          <p className="text-white/35 text-base md:text-lg tracking-wide font-light max-w-xl">
            Design your perfect escape. Every experience is an invitation to
            discover something deeper.
          </p>
        </FadeText>
      </div>

      {/* Bento grid */}
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.title}
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 1.2,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`group relative overflow-hidden rounded-xl cursor-pointer ${exp.span} ${exp.aspect}`}
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} transition-transform duration-[1.2s] ease-cinematic group-hover:scale-105`}
            />

            {/* Accent glow */}
            <div
              className={`absolute inset-0 ${exp.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}
            />

            {/* Gradient for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-cinematic">
                <h3 className="font-display text-lg md:text-xl lg:text-2xl uppercase tracking-[0.12em] font-light mb-2">
                  {exp.title}
                </h3>
                <p className="text-white/35 text-sm tracking-wide font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 max-w-md">
                  {exp.description}
                </p>
              </div>
            </div>

            {/* Hover border accent */}
            <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/[0.06] transition-colors duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
