import {
  BriefcaseBusiness,
  Cake,
  Heart,
  Landmark,
  PartyPopper,
  School
} from "lucide-react";
import type { EventCategoryPreview } from "@/types/event";

export const eventCategories = [
  {
    description: "Royal rituals, grand entries, floral stages, and memories.",
    fallbackClassName: "from-[#2D2238] via-[#7d5e9d] to-[#D4AF37]",
    href: "#gallery",
    icon: Heart,
    imageAlt: "Wedding celebration with luxury floral decor",
    imageSrc: "/images/events/weddings.jpg",
    title: "Weddings"
  },
  {
    description: "Brand-led production for launches, meets, and award nights.",
    fallbackClassName: "from-[#232837] via-[#526074] to-[#BFA2DB]",
    href: "#gallery",
    icon: BriefcaseBusiness,
    imageAlt: "Corporate event with stage and lighting",
    imageSrc: "/images/events/corporate.jpg",
    title: "Corporate"
  },
  {
    description: "Theme-led birthdays designed for delight and detail.",
    fallbackClassName: "from-[#51335f] via-[#BFA2DB] to-[#D4AF37]",
    href: "#gallery",
    icon: Cake,
    imageAlt: "Birthday event theme decor",
    imageSrc: "/images/events/birthday.jpg",
    title: "Birthday"
  },
  {
    description: "Private gatherings with refined hosting and warm ambience.",
    fallbackClassName: "from-[#2D2238] via-[#73548c] to-[#EBDCFB]",
    href: "#gallery",
    icon: PartyPopper,
    imageAlt: "Private celebration dinner setup",
    imageSrc: "/images/events/private.jpg",
    title: "Private"
  },
  {
    description: "Cultural programs, farewells, freshers, and annual days.",
    fallbackClassName: "from-[#293042] via-[#6c5c91] to-[#FAF7FF]",
    href: "#gallery",
    icon: School,
    imageAlt: "School and college stage function",
    imageSrc: "/images/events/school-college.jpg",
    title: "School & College"
  },
  {
    description: "Traditional ceremonies with graceful decor and coordination.",
    fallbackClassName: "from-[#3b2c44] via-[#8b6f43] to-[#D4AF37]",
    href: "#gallery",
    icon: Landmark,
    imageAlt: "Religious event traditional decor",
    imageSrc: "/images/events/religious.jpg",
    title: "Religious"
  }
] as const satisfies readonly EventCategoryPreview[];
