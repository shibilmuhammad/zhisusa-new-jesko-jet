"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeText } from "../cinematic/FadeText";

const accommodations = [
  {
    title: "Private Villas",
    description: "Hidden between ancient forests, wrapped in silence.",
    gradient: "from-[#1a1f1a] via-[#141414] to-[#0a0a0a]",
    accentColor: "from-accent-olive/20",
  },
  {
    title: "Luxury Tents",
    description: "Beneath open skies, where comfort meets wilderness.",
    gradient: "from-[#1a1815] via-[#141414] to-[#0a0a0a]",
    accentColor: "from-accent-beige/15",
  },
  {
    title: "Tree Houses",
    description: "Built for silence, elevated above the ordinary.",
    gradient: "from-[#151a17] via-[#141414] to-[#0a0a0a]",
    accentColor: "from-accent-olive/15",
  },
  {
    title: "Glass Cabins",
    description: "Nature on every side. Nothing between you and the sky.",
    gradient: "from-[#181a1f] via-[#141414] to-[#0a0a0a]",
    accentColor: "from-accent-fog/10",
  },
];

export function StaySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for the heading
  const headingY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-48 lg:py-56 px-6 md:px-10 lg:px-16 bg-background overflow-hidden"
      aria-label="Stay experiences"
    >
      {/* Large editorial heading */}
      <div className="max-w-[90rem] mx-auto mb-24 md:mb-32">
        <FadeText>
          <motion.h2
            style={{ y: headingY }}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] uppercase tracking-[0.05em] font-extralight leading-[0.9] text-white/[0.06]"
          >
            Stay.
          </motion.h2>
        </FadeText>

        <div className="mt-8 md:mt-12 max-w-2xl">
          <FadeText delay={0.2}>
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] font-extralight mb-6">
              Immersive
              <br />
              Accommodations
            </h3>
          </FadeText>
          <FadeText delay={0.3}>
            <div className="space-y-4 text-white/40 text-base md:text-lg tracking-wide font-light max-w-lg">
              <p>Private villas hidden between forests.</p>
              <p>Luxury tents beneath open skies.</p>
              <p>Tree houses built for silence.</p>
            </div>
          </FadeText>
        </div>
      </div>

      {/* Accommodation cards — asymmetric editorial grid */}
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {accommodations.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 1.2,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`group relative overflow-hidden rounded-xl cursor-pointer ${
              index === 0 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[16/10]"
            }`}
          >
            {/* Background gradient (placeholder for imagery) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-1000 ease-cinematic group-hover:scale-105`}
            />

            {/* Accent radial glow */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${item.accentColor} via-transparent to-transparent`}
            />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20baseFrequency%3D%220.9%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />

            {/* Bottom gradient for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-cinematic">
                <h4 className="font-display text-xl md:text-2xl uppercase tracking-[0.15em] font-light mb-2">
                  {item.title}
                </h4>
                <p className="text-white/40 text-sm tracking-wide font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 max-w-sm">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-tr-sm" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
