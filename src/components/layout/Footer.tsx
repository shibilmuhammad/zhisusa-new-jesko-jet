"use client";


import { FadeText } from "../cinematic/FadeText";

const footerColumns = [
  {
    title: "Explore",
    links: ["Philosophy", "Destinations", "Experiences", "Journal"],
  },
  {
    title: "Stay",
    links: ["Private Villas", "Luxury Tents", "Tree Houses", "Glass Cabins"],
  },
  {
    title: "Connect",
    links: ["Contact", "Instagram", "Twitter", "Newsletter"],
  },
];

export function Footer() {
  return (
    <footer
      className="w-full bg-background border-t border-white/[0.04] pt-24 md:pt-32 pb-12 px-6 md:px-10 lg:px-16"
      role="contentinfo"
    >
      <div className="max-w-[90rem] mx-auto">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 mb-24 md:mb-32">
          {/* Brand */}
          <div className="flex-shrink-0">
            <FadeText>
              <a
                href="#"
                className="font-display text-2xl md:text-3xl tracking-[0.25em] uppercase font-light block mb-8 hover:opacity-70 transition-opacity duration-500"
              >
                Zhisusa
              </a>
            </FadeText>
            <FadeText delay={0.1}>
              <p className="text-white/25 font-light max-w-xs tracking-wide text-sm leading-relaxed">
                A premium lifestyle platform for escaping routine and
                reconnecting with nature. Where every stay is a story.
              </p>
            </FadeText>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-16 md:gap-20 lg:gap-24">
            {footerColumns.map((column, colIndex) => (
              <FadeText key={column.title} delay={0.1 + colIndex * 0.1}>
                <div className="flex flex-col gap-5">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase text-white/50 font-light mb-1">
                    {column.title}
                  </h4>
                  {column.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-sm text-white/20 hover:text-white/60 transition-colors duration-500 font-light tracking-wide"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </FadeText>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <FadeText delay={0.4}>
          <div className="mb-20 md:mb-24 max-w-md">
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 font-light mb-4">
              Stay Updated
            </p>
            <div className="flex items-center gap-0 border-b border-white/10 pb-3 group focus-within:border-white/30 transition-colors duration-500">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm text-white/60 placeholder:text-white/15 font-light tracking-wide outline-none"
                aria-label="Email for newsletter"
              />
              <button className="text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors duration-500 font-light px-4">
                Subscribe
              </button>
            </div>
          </div>
        </FadeText>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/[0.04]">
          <p className="text-[10px] text-white/15 font-light tracking-[0.15em]">
            © {new Date().getFullYear()} Zhisusa. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-[10px] text-white/15 hover:text-white/40 transition-colors duration-500 tracking-[0.15em] font-light"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[10px] text-white/15 hover:text-white/40 transition-colors duration-500 tracking-[0.15em] font-light"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
