"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when user scrolls down 1.5 screen heights
      if (window.scrollY > window.innerHeight * 1.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-32 right-6 md:right-10 z-[100] w-10 h-10 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-500 group"
          aria-label="Scroll to top"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/40 transition-all duration-500 -z-10" />
          
          {/* Responsive Icon */}
          <ArrowUp strokeWidth={3} className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-y-1 transition-transform duration-500" />
          
          {/* Label (Visible on hover, desktop only) */}
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-14 md:right-20 text-[10px] uppercase tracking-[0.3em] font-bold text-white whitespace-nowrap pointer-events-none drop-shadow-md hidden md:block"
          >
            Top
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
