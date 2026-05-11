"use client";

import { useState, useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";
import { Navbar } from "@/components/layout/Navbar";
import { HeroScroll } from "@/components/cinematic/HeroScroll";
import { StaySection } from "@/components/sections/StaySection";
import { WorkspaceMorph } from "@/components/cinematic/WorkspaceMorph";
import { LeisureSection } from "@/components/sections/LeisureSection";
import { TableTennisMorph } from "@/components/cinematic/TableTennisMorph";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/cinematic/GrainOverlay";
import { IntroLoader } from "@/components/cinematic/IntroLoader";

export default function HomePage() {
  useLenis();

  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  const handleHeroLoadProgress = useCallback((progress: number) => {
    setHeroProgress(progress);
  }, []);

  const handleHeroLoaded = useCallback(() => {
    setHeroLoaded(true);
  }, []);

  return (
    <>
      <IntroLoader isLoading={!heroLoaded} progress={heroProgress} />

      <main className="bg-background text-foreground overflow-hidden selection:bg-white/15 selection:text-white">
        <GrainOverlay />
        <Navbar />

        {/* Section 1: Cinematic Hero */}
        <HeroScroll
          onLoadProgress={handleHeroLoadProgress}
          onLoaded={handleHeroLoaded}
        />

        {/* Section 2: Stay Experience */}
        <div id="stay">
          <StaySection />
        </div>

        {/* Section 3: Workspace Morph */}
        <div id="work">
          <WorkspaceMorph />
        </div>

        {/* Section 4: Leisure */}
        <div id="leisure">
          <LeisureSection />
        </div>

        {/* Section 5: Table Tennis Morph */}
        <TableTennisMorph />

        {/* Section 6: Experiences */}
        <div id="experiences">
          <ExperienceSection />
        </div>

        {/* Section 7: Philosophy */}
        <PhilosophySection />

        {/* Section 8: CTA */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
