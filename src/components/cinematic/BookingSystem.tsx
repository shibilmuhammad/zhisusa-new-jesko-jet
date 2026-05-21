"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Calendar, Users, Coffee, Home, Activity } from "lucide-react";

type Category = "WORK" | "LIVE" | "LEISURE";

export function BookingSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("LIVE");
  // State for the new global button visibility
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reveal button after a short delay for cinematic entry
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleModal = () => setIsOpen(!isOpen);

  const categories: { id: Category; icon: React.ElementType; label: string }[] = [
    { id: "WORK", icon: Coffee, label: "Workspaces" },
    { id: "LIVE", icon: Home, label: "Accommodations" },
    { id: "LEISURE", icon: Activity, label: "Experiences" },
  ];

  const workspaceOptions = ["Private Office", "Conference Room", "Co-working Space", "Outdoor Workspace", "Indoor Workspace"];
  const accommodationOptions = ["Private Villa", "Tree House", "Luxury Tent", "Glass Cabin", "Nature Retreat"];
  const activityOptions = ["Fishing", "Boating", "Kayaking", "Campfire", "Games", "Nature Activities"];

  return (
    <>
      {/* ── GLOBAL CENTERED BOOKING CTA ── */}
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[100] pointer-events-none"
          >
            <motion.button
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleModal}
              className="group relative pointer-events-auto flex items-center gap-3 bg-brand-teal px-7 py-2.5 rounded-full shadow-[0_15px_40px_rgba(36,95,115,0.5)] transition-all duration-500"
            >
              {/* Outer Glass Effect Ring */}
              <div className="absolute -inset-[6px] rounded-full bg-brand-teal/20 backdrop-blur-xl border-[1.5px] border-brand-teal/40 -z-10 group-hover:bg-brand-teal/30 transition-all duration-500" />
              
              <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-white pl-1 font-sans">
                Book Escape
              </span>
              
              <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 border border-white/30">
                <ChevronRight size={12} strokeWidth={3} />
              </div>

              {/* Floating Glow */}
              <div className="absolute inset-0 rounded-full bg-brand-teal/60 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOOKING MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center px-4 pb-4 md:pb-10 overflow-hidden">
            {/* Backdrop Blur/Dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-crosshair"
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.96 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 28, 
                mass: 0.8 
              }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 z-50"
              >
                <X size={20} />
              </button>

              {/* ── LEFT SIDE: Category Tabs ── */}
              <div className="w-full md:w-[32%] bg-brand-teal/5 border-r border-brand-teal/10 p-8 md:p-12 flex flex-col justify-between shrink-0">
                <div>
                  <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white mb-1">Reserve</h2>
                  <p className="text-brand-silver text-[10px] tracking-widest uppercase mb-12 font-sans">Your Curated Escape</p>
                  
                  <nav className="flex flex-col gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group ${
                          activeCategory === cat.id 
                            ? "bg-brand-teal text-white" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <cat.icon size={16} className={activeCategory === cat.id ? "text-white" : "text-white/40 group-hover:text-white transition-colors"} />
                        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold font-sans">{cat.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-12 pt-8 border-t border-brand-teal/15 hidden md:block">
                  <p className="text-[10px] text-brand-silver/40 uppercase tracking-[0.4em] leading-relaxed font-sans">
                    Zhisusa Concierge<br />
                    Available 24/7 for tailored requests.
                  </p>
                </div>
              </div>

              {/* ── RIGHT SIDE: Form ── */}
              <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="pb-10"
                  >
                      <div className="max-w-xl">
                        <header className="mb-10">
                          <h3 className="font-display text-4xl md:text-5xl uppercase tracking-[0.06em] text-white font-normal leading-tight italic">
                            {activeCategory === "WORK" && "Focus with purpose."}
                            {activeCategory === "LIVE" && "Sleep between trees."}
                            {activeCategory === "LEISURE" && "Reconnect with life."}
                          </h3>
                        </header>

                        <div className="space-y-10">
                          {/* ── DYNAMIC FIELDS ── */}
                          
                          {/* Field 1: Type Selection */}
                          <div className="space-y-3">
                            <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Select Experience</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(activeCategory === "WORK" ? workspaceOptions : 
                                activeCategory === "LIVE" ? accommodationOptions : activityOptions).map((opt) => (
                                <button key={opt} className="px-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.03] text-left text-white/60 text-[11px] font-sans tracking-wide hover:border-brand-teal/40 hover:bg-brand-teal/10 hover:text-brand-teal transition-all duration-300">
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Field 2: Dates/Time */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">
                                {activeCategory === "LEISURE" ? "Preferred Date" : "Arrival Date"}
                              </label>
                              <div className="relative group">
                                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-brand-teal/60 transition-colors" size={15} />
                                <input 
                                  type="text" 
                                  placeholder={activeCategory === "LEISURE" ? "Select Date" : "Check-in"} 
                                  className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/60 transition-colors placeholder:text-white/10"
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">
                                {activeCategory === "LEISURE" ? "Preferred Time" : "Departure Date"}
                              </label>
                              <div className="relative group">
                                <Users className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-brand-teal/60 transition-colors" size={15} />
                                <input 
                                  type="text" 
                                  placeholder={activeCategory === "LEISURE" ? "Select Time" : "Check-out"} 
                                  className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/60 transition-colors placeholder:text-white/10"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Field 3: Guests/People */}
                          <div className="space-y-3">
                            <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Number of People</label>
                            <div className="flex gap-3">
                              {[1, 2, 3, 4, "5+"].map((num) => (
                                <button key={num.toString()} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-xs font-sans text-white/50 hover:border-brand-teal hover:text-brand-teal hover:bg-brand-teal/10 transition-all duration-300">
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Field 4: Notes */}
                          <div className="space-y-3">
                            <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Additional Requests</label>
                            <textarea 
                              placeholder="Notes or special requests..."
                              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/30 focus:bg-brand-teal/5 transition-all min-h-[90px] placeholder:text-white/10"
                            />
                          </div>

                          {/* Submit */}
                          <div className="pt-6">
                            <button className="w-full py-5 rounded-2xl bg-brand-teal text-white text-[11px] uppercase tracking-[0.35em] font-semibold font-sans hover:bg-brand-teal/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 shadow-[0_20px_50px_rgba(36,95,115,0.3)]">
                              Confirm Reservation
                            </button>
                            <p className="text-center text-brand-silver/30 text-[9px] uppercase tracking-[0.3em] mt-5 font-sans">
                              Our team will contact you within 2 hours.
                            </p>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
