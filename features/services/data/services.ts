import {
  BriefcaseBusiness,
  Cake,
  Heart,
  Landmark,
  PartyPopper,
  School
} from "lucide-react";
import type { ServiceOffering } from "@/types/service";

export const serviceOfferings = [
  {
    description:
      "Royal decor, Haldi, Mehndi, Sangeet, Phere, Reception, bridal entries, floral design, lighting, photography, and complete wedding management.",
    fallbackClassName: "from-[#2D2238] via-[#7f5fa0] to-[#D4AF37]",
    href: "#customize",
    icon: Heart,
    imageAlt: "Luxury wedding stage with floral decor and warm lighting",
    imageSrc: "/images/services/luxury-weddings.jpg",
    included: ["Royal decor", "Bridal entries", "Photography"],
    title: "Luxury Weddings"
  },
  {
    description:
      "Professional conferences, product launches, award nights, annual meets, stage design, branding, sound, lighting, and guest management.",
    fallbackClassName: "from-[#2D2238] via-[#48506d] to-[#BFA2DB]",
    href: "#customize",
    icon: BriefcaseBusiness,
    imageAlt: "Corporate event stage with premium lighting and branding",
    imageSrc: "/images/services/corporate-events.jpg",
    included: ["Stage design", "Branding", "Guest management"],
    title: "Corporate Events"
  },
  {
    description:
      "Theme-based birthday celebrations with decor, lighting, sound, photography, anchors, games, and memorable experiences.",
    fallbackClassName: "from-[#51335f] via-[#BFA2DB] to-[#D4AF37]",
    href: "#customize",
    icon: Cake,
    imageAlt: "Premium birthday celebration with theme decor",
    imageSrc: "/images/services/birthday-parties.jpg",
    included: ["Theme decor", "Anchors", "Games"],
    title: "Birthday Parties"
  },
  {
    description:
      "Exclusive parties, anniversaries, family gatherings, luxury dinners, and personalized celebration planning.",
    fallbackClassName: "from-[#2D2238] via-[#714f8a] to-[#EBDCFB]",
    href: "#customize",
    icon: PartyPopper,
    imageAlt: "Private luxury dinner celebration setup",
    imageSrc: "/images/services/private-parties.jpg",
    included: ["Luxury dinners", "Anniversaries", "Personal planning"],
    title: "Private Parties"
  },
  {
    description:
      "Annual functions, farewells, freshers, cultural programs, stage setup, sound, lighting, anchoring, and event coordination.",
    fallbackClassName: "from-[#293042] via-[#7f5fa0] to-[#FAF7FF]",
    href: "#customize",
    icon: School,
    imageAlt: "School and college function stage setup",
    imageSrc: "/images/services/school-college-functions.jpg",
    included: ["Stage setup", "Anchoring", "Coordination"],
    title: "School & College Functions"
  },
  {
    description:
      "Traditional decor, devotional stage setup, lighting, sound, floral arrangements, seating, and complete ceremony management.",
    fallbackClassName: "from-[#3b2c44] via-[#8b6f43] to-[#D4AF37]",
    href: "#customize",
    icon: Landmark,
    imageAlt: "Religious event floral stage and devotional setup",
    imageSrc: "/images/services/religious-events.jpg",
    included: ["Floral setup", "Seating", "Ceremony management"],
    title: "Religious Events"
  }
] as const satisfies readonly ServiceOffering[];
