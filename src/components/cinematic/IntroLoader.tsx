"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroLoaderProps {
  isLoading: boolean;
  progress: number;
}

export function IntroLoader({ isLoading, progress }: IntroLoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Keep loader until sequence is fully ready for smooth first interaction.
    if (!isLoading) {
      const delay = 300;
      const timer = setTimeout(() => setShowLoader(false), delay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  // Safety fallback for slow networks.
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.35em] uppercase font-light mb-12">
              Zhisusa
            </h1>

            {/* Progress bar */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white/50"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-8 text-xs tracking-[0.3em] uppercase text-white/30 font-light"
            >
              Entering Zhisusa
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
