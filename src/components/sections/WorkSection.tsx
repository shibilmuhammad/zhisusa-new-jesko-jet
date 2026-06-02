"use client";

import { HorizontalGallery } from "../cinematic/HorizontalGallery";
import type { GalleryCard } from "../cinematic/HorizontalGallery";

const workspaces: GalleryCard[] = [
  {
    title: "Private Offices",
    subtitle: "Focused & undisturbed",
    description: "Floor-to-ceiling forest views, minimal design, maximum clarity of thought.",
    image: "/work_private_office.png",
    index: "01",
  },
  {
    title: "Conference Rooms",
    subtitle: "Where ideas meet nature",
    description: "Premium boardroom experience with panoramic tropical views.",
    image: "/work_conference_room.png",
    index: "02",
  },
  {
    title: "Open Air Decks",
    subtitle: "Work in the canopy",
    description: "Floating decks in the jungle — wifi, silence, and wild inspiration.",
    image: "/work_outdoor_cowork.png",
    index: "03",
  },
  {
    title: "Focus Pods",
    subtitle: "Deep work sanctuaries",
    description: "Wabi-sabi solitude spaces designed for uninterrupted deep thinking.",
    image: "/work_focus_pod.png",
    index: "04",
  },
];

export function WorkSection() {
  return (
    <HorizontalGallery
      watermark="Work"
      tagline="Design your ideal"
      taglineEmphasis="workspace."
      cards={workspaces}
      ariaLabel="Work experiences"
      sectionHeight="200vh"
    />
  );
}
