"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Stay", href: "#stay" },
  { label: "Work", href: "#work" },
  { label: "Leisure", href: "#leisure" },
  { label: "Experiences", href: "#experiences" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileMenuOpen(false);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 lg:px-16 py-5 md:py-6 transition-all duration-700",
          scrolled
            ? "bg-background/60 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="font-display text-lg md:text-xl tracking-[0.25em] uppercase font-light hover:opacity-70 transition-opacity duration-500"
        >
          Zhisusa
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-light text-white/50">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative hover:text-white transition-colors duration-500 group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500 ease-cinematic" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-[11px] uppercase tracking-[0.2em] font-light border border-white/15 px-6 py-2.5 rounded-full hover:bg-white hover:text-background transition-all duration-600 ease-cinematic">
            Book Escape
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[55] bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
      >
        {navLinks.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: mobileMenuOpen ? 1 : 0,
              y: mobileMenuOpen ? 0 : 30,
            }}
            transition={{
              duration: 0.6,
              delay: mobileMenuOpen ? index * 0.1 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-2xl tracking-[0.2em] uppercase font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            {link.label}
          </motion.a>
        ))}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            y: mobileMenuOpen ? 0 : 30,
          }}
          transition={{
            duration: 0.6,
            delay: mobileMenuOpen ? 0.4 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-4 text-sm uppercase tracking-[0.2em] font-light border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-background transition-all duration-500"
        >
          Book Escape
        </motion.button>
      </motion.div>
    </>
  );
}
