import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F4EE",
        foreground: "#1F3A36",
        secondary: "rgba(31,58,54,0.55)",
        brand: {
          cream: "#F7F4EE",
          silver: "#B8B8A8",
          teal: "#4E7C7A",
          terra: "#D8C3A5",
          forest: "#1F3A36",
        },
        accent: {
          olive: "#4E7C7A",
          beige: "#D8C3A5",
          charcoal: "#2A3D38",
          fog: "#EDE9E0",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-bodoni)", "var(--font-poppins)", "serif"],
        mono: ["var(--font-poppins)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-in": "fadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
