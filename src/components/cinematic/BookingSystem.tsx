"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Calendar, Users, Coffee, Home, Activity } from "lucide-react";

type Category = "WORK" | "LIVE" | "LEISURE";

interface CustomWindow extends Window {
  lenis?: {
    stop: () => void;
    start: () => void;
  };
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
};

export function BookingSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("LIVE");
  // State for the new global button visibility
  const [isReady, setIsReady] = useState(false);
  const [isCTAInView, setIsCTAInView] = useState(false);

  // Contact details & multi-step state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);



  // Form state
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [date1, setDate1] = useState<string>(""); // Check-in / Date
  const [date2, setDate2] = useState<string>(""); // Check-out / Time
  const [selectedGuests, setSelectedGuests] = useState<number | string>(2);
  const [notes, setNotes] = useState<string>("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset selections when category changes
  useEffect(() => {
    setSelectedExperience("");
    setDate1("");
    setDate2("");
    setNotes("");
    setFullName("");
    setEmail("");
    setPhone("");
    setStep(1);
  }, [activeCategory]);

  useEffect(() => {
    // Reveal button after a short delay for cinematic entry
    const timer = setTimeout(() => setIsReady(true), 1500);

    const handleOpenBooking = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-booking", handleOpenBooking);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-booking", handleOpenBooking);
    };
  }, []);

  useEffect(() => {
    const ctaElement = document.getElementById("cta-section");
    if (!ctaElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCTAInView(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(ctaElement);
    return () => observer.disconnect();
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    const lenisInstance = (window as unknown as CustomWindow).lenis;
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (lenisInstance) {
        lenisInstance.stop();
      }
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (lenisInstance) {
        lenisInstance.start();
      }
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (lenisInstance) {
        lenisInstance.start();
      }
    };
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Reset success state when closing modal
      setIsSuccess(false);
      setStep(1);
    }
  };

  const handleNextStep = () => {
    if (!selectedExperience) {
      alert("Please select an experience category (e.g. Private Villa) before continuing.");
      return;
    }
    if (!date1) {
      alert(activeCategory === "LEISURE" ? "Please select a date." : "Please select an arrival date.");
      return;
    }
    if (!date2) {
      alert(activeCategory === "LEISURE" ? "Please select a time." : "Please select a departure date.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    const payload = {
      category: activeCategory,
      experience: selectedExperience,
      arrivalDate: date1,
      departureDate: date2,
      guests: selectedGuests,
      notes: notes || "None",
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      submittedAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        alert(data.error || "Failed to submit booking request. Please check your connection and try again.");
      }
    } catch (err) {
      console.error("Booking API error:", err);
      alert("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {isReady && !isCTAInView && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[100] pointer-events-none"
          >
            <motion.button
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleModal}
              className="group relative pointer-events-auto flex items-center gap-2 md:gap-3 bg-brand-cream/80 md:bg-brand-teal backdrop-blur-xl border border-brand-cream/50 md:border-transparent px-5 md:px-7 py-2 md:py-2.5 rounded-full shadow-lg md:shadow-[0_15px_40px_rgba(36,95,115,0.5)] transition-all duration-500"
            >
              {/* Outer Glass Effect Ring - Desktop Only */}
              <div className="hidden md:block absolute -inset-[6px] rounded-full bg-brand-teal/20 backdrop-blur-xl border-[1.5px] border-brand-teal/40 -z-10 group-hover:bg-brand-teal/30 transition-all duration-500" />

              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.35em] font-semibold text-brand-forest md:text-white pl-1 font-sans">
                Book Your Escape
              </span>

              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-forest/10 md:bg-white/20 text-brand-forest md:text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 border border-brand-forest/20 md:border-white/30">
                <ChevronRight className="w-[10px] h-[10px] md:w-3 md:h-3" strokeWidth={3} />
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
              data-lenis-prevent
              className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] max-h-[800px] min-h-[500px] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 z-50"
              >
                <X size={20} />
              </button>

              {/* ── LEFT SIDE: Category Tabs ── */}
              <div className="w-full md:w-[32%] bg-[#0e1716] md:bg-brand-teal/5 border-b md:border-b-0 md:border-r border-brand-teal/10 p-6 md:p-12 flex flex-col justify-between shrink-0">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.1em] text-white mb-1">Reserve</h2>
                  <p className="text-brand-silver text-[9px] md:text-[10px] tracking-widest uppercase mb-4 md:mb-12 font-sans">Your Curated Escape</p>

                  <nav className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2.5 md:gap-4 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 group shrink-0 ${activeCategory === cat.id
                          ? "bg-brand-teal text-white"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <cat.icon size={14} className={activeCategory === cat.id ? "text-white" : "text-white/40 group-hover:text-white transition-colors"} />
                        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold font-sans">{cat.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-teal/15 hidden md:block">
                  <p className="text-[10px] text-brand-silver/40 uppercase tracking-[0.4em] leading-relaxed font-sans">
                    OUR TEAM WILL GET IN TOUCH WITH YOU IN ABOUT 24-48 WORKING HOURS
                  </p>
                </div>
              </div>

              {/* ── RIGHT SIDE: Form / Success State ── */}
              <div data-lenis-prevent className="flex-1 p-6 md:p-16 overflow-y-auto custom-scrollbar min-h-0 relative">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="text-center max-w-md mx-auto space-y-6 py-8 flex flex-col justify-center items-center h-full min-h-[450px]"
                    >
                      {/* Animated Checkmark Circle */}
                      <div className="w-20 h-20 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto text-brand-teal">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display text-3xl uppercase tracking-wider text-white">
                          Request Received
                        </h3>
                        <p className="text-brand-silver text-xs uppercase tracking-[0.2em]">
                          Your Curated Escape Awaits
                        </p>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left space-y-4 font-sans text-xs w-full max-w-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Name:</span>
                          <span className="text-white font-medium">{fullName}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Email:</span>
                          <span className="text-white font-medium">{email}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Phone:</span>
                          <span className="text-white font-medium">{phone}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Category:</span>
                          <span className="text-brand-teal font-semibold uppercase">{activeCategory}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Selected:</span>
                          <span className="text-white font-medium text-right">{selectedExperience || "None"}</span>
                        </div>
                        {(date1 || date2) && (
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-white/40">
                              {activeCategory === "LEISURE" ? "Date & Time:" : "Live Period:"}
                            </span>
                            <span className="text-white font-medium text-right">
                              {activeCategory === "LEISURE"
                                ? `${formatDate(date1)} at ${date2}`
                                : `${formatDate(date1)} to ${formatDate(date2)}`
                              }
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/40">Guests:</span>
                          <span className="text-white font-medium">{selectedGuests} {Number(selectedGuests) === 1 ? "Person" : "People"}</span>
                        </div>
                        {notes && (
                          <div className="pt-2">
                            <span className="text-white/40 block mb-1">Additional Requests:</span>
                            <p className="text-white/80 font-sans italic text-[11px] leading-relaxed max-h-16 overflow-y-auto custom-scrollbar break-words">
                              &quot;{notes}&quot;
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="text-white/60 text-xs leading-relaxed max-w-sm mx-auto font-sans">
                        Our Zhisusa Concierge team will review your selection and contact you within 2 hours to confirm your custom itinerary.
                      </p>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            // Reset state after closure transition
                            setTimeout(() => {
                              setIsSuccess(false);
                              setSelectedExperience("");
                              setDate1("");
                              setDate2("");
                              setNotes("");
                              setFullName("");
                              setEmail("");
                              setPhone("");
                              setStep(1);
                            }, 500);
                          }}
                          className="px-8 py-3 rounded-full bg-brand-teal text-white text-[10px] uppercase tracking-[0.25em] font-semibold font-sans hover:bg-brand-teal/90 transition-colors"
                        >
                          Back to Experience
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={`${activeCategory}-${step}`}
                      onSubmit={handleSubmit}
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

                        {step === 1 ? (
                          <div className="space-y-10 animate-fade-in">
                            {/* ── DYNAMIC FIELDS ── */}

                            {/* Field 1: Type Selection */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Select Experience</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(activeCategory === "WORK" ? workspaceOptions :
                                  activeCategory === "LIVE" ? accommodationOptions : activityOptions).map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      className={`px-4 py-3.5 rounded-xl border text-left text-[11px] font-sans tracking-wide transition-all duration-300 ${selectedExperience === opt
                                        ? "border-brand-teal bg-brand-teal/20 text-brand-teal shadow-[0_0_15px_rgba(78,124,122,0.15)]"
                                        : "border-white/5 bg-white/[0.03] text-white/60 hover:border-brand-teal/40 hover:bg-brand-teal/10 hover:text-brand-teal"
                                        }`}
                                      onClick={() => setSelectedExperience(opt)}
                                    >
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
                                <div className="relative group min-h-[46px]">
                                  <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-brand-teal/60 transition-colors pointer-events-none" size={15} />
                                  
                                  {/* Visible layer */}
                                  <div className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white text-sm font-sans transition-colors group-hover:border-brand-teal/40">
                                    <span className={date1 ? "text-white" : "text-white/20"}>
                                      {date1 ? formatDate(date1) : (activeCategory === "LEISURE" ? "Select Date" : "Check-in")}
                                    </span>
                                  </div>

                                  {/* Hidden native picker */}
                                  <input
                                    type="date"
                                    value={date1}
                                    onChange={(e) => setDate1(e.target.value)}
                                    onClick={(e) => {
                                      try {
                                        if ("showPicker" in e.currentTarget) {
                                          e.currentTarget.showPicker();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    onFocus={(e) => {
                                      try {
                                        if ("showPicker" in e.currentTarget) {
                                          e.currentTarget.showPicker();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    style={{ colorScheme: "dark" }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">
                                  {activeCategory === "LEISURE" ? "Preferred Time" : "Departure Date"}
                                </label>
                                <div className="relative group min-h-[46px]">
                                  <Users className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-brand-teal/60 transition-colors pointer-events-none" size={15} />
                                  
                                  {/* Visible layer */}
                                  <div className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white text-sm font-sans transition-colors group-hover:border-brand-teal/40">
                                    <span className={date2 ? "text-white" : "text-white/20"}>
                                      {date2 
                                        ? (activeCategory === "LEISURE" ? date2 : formatDate(date2))
                                        : (activeCategory === "LEISURE" ? "Select Time" : "Check-out")
                                      }
                                    </span>
                                  </div>

                                  {/* Hidden native picker */}
                                  <input
                                    type={activeCategory === "LEISURE" ? "time" : "date"}
                                    value={date2}
                                    onChange={(e) => setDate2(e.target.value)}
                                    onClick={(e) => {
                                      try {
                                        if ("showPicker" in e.currentTarget) {
                                          e.currentTarget.showPicker();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    onFocus={(e) => {
                                      try {
                                        if ("showPicker" in e.currentTarget) {
                                          e.currentTarget.showPicker();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    style={{ colorScheme: "dark" }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Field 3: Guests/People */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Number of People</label>
                              <div className="flex gap-3">
                                {[1, 2, 3, 4, "5+"].map((num) => (
                                  <button
                                    key={num.toString()}
                                    type="button"
                                    className={`w-11 h-11 rounded-full border flex items-center justify-center text-xs font-sans transition-all duration-300 ${selectedGuests === num
                                      ? "border-brand-teal bg-brand-teal/20 text-brand-teal font-semibold shadow-[0_0_15px_rgba(78,124,122,0.15)]"
                                      : "border-white/10 text-white/50 hover:border-brand-teal hover:text-brand-teal hover:bg-brand-teal/10"
                                      }`}
                                    onClick={() => setSelectedGuests(num)}
                                  >
                                    {num}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Field 4: Notes */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Additional Requests</label>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notes or special requests..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/30 focus:bg-brand-teal/5 transition-all min-h-[90px] placeholder:text-white/10"
                              />
                            </div>

                            {/* Submit (Continue) */}
                            <div className="pt-6">
                              <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-5 rounded-2xl bg-brand-teal text-white text-[11px] uppercase tracking-[0.35em] font-semibold font-sans hover:bg-brand-teal/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 shadow-[0_20px_50px_rgba(36,95,115,0.3)] flex items-center justify-center gap-2"
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-10 animate-fade-in">
                            <header className="mb-4">
                              <p className="text-[10px] text-brand-silver/40 uppercase tracking-[0.4em] mb-1 font-sans">Step 2 of 2</p>
                              <h4 className="font-display text-2xl uppercase tracking-wider text-white">Contact Details</h4>
                            </header>

                            {/* Full Name */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Full Name</label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  required
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  placeholder="John Doe"
                                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/60 transition-colors placeholder:text-white/10"
                                />
                              </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Email Address</label>
                              <div className="relative group">
                                <input
                                  type="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="john@example.com"
                                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/60 transition-colors placeholder:text-white/10"
                                />
                              </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-3">
                              <label className="text-[9px] uppercase tracking-[0.5em] text-brand-silver/50 font-semibold block font-sans">Phone Number</label>
                              <div className="relative group">
                                <input
                                  type="tel"
                                  required
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="+91 98765 43210"
                                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm font-sans focus:outline-none focus:border-brand-teal/60 transition-colors placeholder:text-white/10"
                                />
                              </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6 flex gap-4">
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-5 rounded-2xl border border-white/10 bg-transparent text-white text-[11px] uppercase tracking-[0.35em] font-semibold font-sans hover:bg-white/5 active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-2"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] py-5 rounded-2xl bg-brand-teal text-white text-[11px] uppercase tracking-[0.35em] font-semibold font-sans hover:bg-brand-teal/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 shadow-[0_20px_50px_rgba(36,95,115,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {isSubmitting ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Submitting...</span>
                                  </>
                                ) : (
                                  "Submit"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
