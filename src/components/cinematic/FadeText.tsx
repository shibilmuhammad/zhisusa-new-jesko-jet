"use client";

import { motion } from "framer-motion";

interface FadeTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down";
  duration?: number;
}

export function FadeText({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 1.4,
}: FadeTextProps) {
  const yOffset = direction === "up" ? 60 : -60;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
