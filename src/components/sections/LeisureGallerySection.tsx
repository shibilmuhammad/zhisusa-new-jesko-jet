"use client";

import { HorizontalGallery } from "../cinematic/HorizontalGallery";
import type { GalleryCard } from "../cinematic/HorizontalGallery";

const leisureActivities: GalleryCard[] = [
  {
    title: "Kayaking",
    subtitle: "Dawn on the water",
    description: "Glide through the morning mist and let the rhythm of the river set your pace.",
    image: "/1_Kayaking.png",
    index: "01",
  },
  {
    title: "Gardening",
    subtitle: "Morning nurture",
    description: "Connect with the earth and discover the grounding peace of working the soil.",
    image: "/2_Gardening.png",
    index: "02",
  },
  {
    title: "Fishing",
    subtitle: "Morning stillness",
    description: "Find clarity and patience in the quiet anticipation of the catch.",
    image: "/leisure_fishing.png",
    index: "03",
  },
  {
    title: "Volleyball",
    subtitle: "Afternoon energy",
    description: "Connect with others and embrace the active spirit of the sunlit hours.",
    image: "/3_Volleyball.png",
    index: "04",
  },
  {
    title: "Tennis",
    subtitle: "Afternoon rallies",
    description: "Rally on our premium outdoor court surrounded by towering forest trees.",
    image: "/leisure_tennis.png",
    index: "05",
  },
  {
    title: "Bonfires",
    subtitle: "Nighttime warmth",
    description: "Gather around the fire under the canopy to share stories and slow time.",
    image: "/leisure_bonfire.png",
    index: "06",
  },
  {
    title: "Stargazing",
    subtitle: "Midnight wonders",
    description: "Look up and lose yourself in the vastness of the unpolluted night sky.",
    image: "/leisure_stargazing.png",
    index: "07",
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
