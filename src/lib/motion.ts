// Cinematic motion presets for Framer Motion
// All transitions are slow, organic, and premium-feeling

export const smooth = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const slowReveal = {
  duration: 1.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const ultraSlow = {
  duration: 2.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const gentle = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Stagger children preset
export const stagger = {
  staggerChildren: 0.15,
  delayChildren: 0.1,
};

export const staggerSlow = {
  staggerChildren: 0.25,
  delayChildren: 0.2,
};

// Common animation variants
export const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export const slideFromLeft = {
  initial: { opacity: 0, x: -80 },
  animate: { opacity: 1, x: 0 },
};

export const slideFromRight = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
};

// Section transition variants
export const sectionReveal = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: smooth,
};

export const imageReveal = {
  initial: { opacity: 0, scale: 0.92, filter: "blur(10px)" },
  whileInView: { opacity: 1, scale: 1, filter: "blur(0px)" },
  viewport: { once: true, margin: "-50px" },
  transition: slowReveal,
};
