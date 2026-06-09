"use client";

import { HorizontalGallery } from "../cinematic/HorizontalGallery";
import type { GalleryCard } from "../cinematic/HorizontalGallery";

const leisureActivities: GalleryCard[] = [
  {
    title: "Kayaking",
    subtitle: "Dawn on the water",
    description: "Glide through the morning mist and let the rhythm of the river set your pace.",
    image: "/leisure_kayaking.png",
    index: "01",
  },
  {
    title: "Fishing",
    subtitle: "Morning stillness",
    description: "Find clarity and patience in the quiet anticipation of the catch.",
    image: "/exp_trails_1778668542925.png",
    index: "02",
  },
  {
    title: "Volleyball",
    subtitle: "Afternoon energy",
    description: "Connect with others and embrace the active spirit of the sunlit hours.",
    image: "/exp_social_1778668512362.png",
    index: "03",
  },
  {
    title: "Table Tennis",
    subtitle: "Sunset rallies",
    description: "Fast-paced fun and friendly competition as the day winds down into dusk.",
    image: "/exp_wellness_1778668492340.png",
    index: "04",
  },
  {
    title: "Bonfires",
    subtitle: "Nighttime warmth",
    description: "Gather around the fire under the canopy to share stories and slow time.",
    image: "/leisure_bonfire.png",
    index: "05",
  },
  {
    title: "Stargazing",
    subtitle: "Midnight wonders",
    description: "Look up and lose yourself in the vastness of the unpolluted night sky.",
    image: "/exp_meditation_1778668575248.png",
    index: "06",
  },
];

export function LeisureGallerySection() {
  return (
    <HorizontalGallery
      watermark="Play"
      tagline="Embrace your"
      taglineEmphasis="leisure."
      cards={leisureActivities}
      ariaLabel="Leisure experiences gallery"
      sectionHeight="300vh" // slightly longer since there are 6 cards
    />
  );
}
