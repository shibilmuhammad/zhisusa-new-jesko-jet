"use client";

import { HorizontalGallery } from "../cinematic/HorizontalGallery";
import type { GalleryCard } from "../cinematic/HorizontalGallery";

const accommodations: GalleryCard[] = [
  {
    title: "Private Villas",
    subtitle: "Hidden between forests",
    description: "Wrapped in silence, designed for slow mornings and open skies.",
    image: "/stay_villa_1778668418060.png",
    index: "01",
  },
  {
    title: "Luxury Tents",
    subtitle: "Beneath open skies",
    description: "Where comfort meets wilderness — unfiltered and untouched.",
    image: "/stay_tent_1778668433003.png",
    index: "02",
  },
  {
    title: "Tree Houses",
    subtitle: "Built for silence",
    description: "Elevated above the ordinary, surrounded by canopy and calm.",
    image: "/stay_treehouse_1778668450104.png",
    index: "03",
  },
  {
    title: "Glass Cabins",
    subtitle: "Nothing between you and the sky",
    description: "Nature on every side — transparent living at its finest.",
    image: "/stay_cabin_1778668472270.png",
    index: "04",
  },
];

export function StaySection() {
  return (
    <HorizontalGallery
      watermark="Live"
      tagline="Find your perfect"
      taglineEmphasis="retreat."
      cards={accommodations}
      ariaLabel="Live experiences"
      sectionHeight="200vh"
    />
  );
}
