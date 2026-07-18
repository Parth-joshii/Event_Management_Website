import type { EventTheme } from "@/types/theme";

export const eventThemes = [
  {
    category: "Royal Palace",
    colorPalette: ["#2D2238", "#BFA2DB", "#D4AF37", "#FFFFFF"],
    description:
      "Palace arches, carved mandap forms, candlelit entries, and gold floral detailing for a grand wedding signature.",
    fallbackClassName: "from-[#2D2238] via-[#7d5ea1] to-[#D4AF37]",
    flowersUsed: ["White roses", "Rajnigandha", "Hydrangea", "Marigold"],
    gallery: ["/images/themes/royal-palace-01.webp"],
    heroImage: "/images/themes/royal-palace.webp",
    idealGuestCount: "300 - 900 guests",
    lightingUsed: ["Amber wash", "Pin spots", "Candle lines"],
    recommendedBudget: "INR 25L+",
    recommendedThemeSlugs: ["luxury-gold", "traditional-royal", "vintage-palace"],
    slug: "royal-palace",
    suitableVenues: ["Palaces", "Luxury hotels", "Heritage resorts"],
    title: "Royal Palace",
    videoSrc: "/videos/portfolio/royal-palace-theme.mp4"
  },
  {
    category: "Luxury Gold",
    colorPalette: ["#1E1728", "#D4AF37", "#F7E7B4", "#FFFFFF"],
    description:
      "A polished gold-led theme for receptions, award nights, and wedding evenings that need a rich premium mood.",
    fallbackClassName: "from-[#1E1728] via-[#8b6f43] to-[#D4AF37]",
    flowersUsed: ["Orchids", "Roses", "Baby breath"],
    gallery: ["/images/themes/luxury-gold-01.webp"],
    heroImage: "/images/themes/luxury-gold.webp",
    idealGuestCount: "200 - 700 guests",
    lightingUsed: ["Gold wash", "Warm uplights", "Crystal shimmer"],
    recommendedBudget: "INR 18L+",
    recommendedThemeSlugs: ["royal-palace", "vintage-palace", "reception-stage"],
    slug: "luxury-gold",
    suitableVenues: ["Banquets", "Five-star hotels", "Lawns"],
    title: "Luxury Gold",
    videoSrc: "/videos/portfolio/luxury-gold-theme.mp4"
  },
  {
    category: "Traditional",
    colorPalette: ["#7A1F1F", "#D4AF37", "#F4E4C1", "#2D2238"],
    description:
      "Classic Indian styling with marigolds, brass, sacred florals, and warm ceremony-friendly lighting.",
    fallbackClassName: "from-[#7A1F1F] via-[#D4AF37] to-[#2D2238]",
    flowersUsed: ["Marigold", "Lotus", "Rajnigandha"],
    gallery: ["/images/themes/traditional-royal-01.webp"],
    heroImage: "/images/themes/traditional-royal.webp",
    idealGuestCount: "150 - 800 guests",
    lightingUsed: ["Warm lamps", "Mandap spots", "Traditional diyas"],
    recommendedBudget: "INR 10L+",
    recommendedThemeSlugs: ["royal-palace", "mandap-themes", "haldi-theme"],
    slug: "traditional-royal",
    suitableVenues: ["Community halls", "Lawns", "Temple courtyards"],
    title: "Traditional Royal",
    videoSrc: "/videos/portfolio/traditional-theme.mp4"
  },
  {
    category: "Modern Luxury",
    colorPalette: ["#2D2238", "#BFA2DB", "#EBDCFB", "#FFFFFF"],
    description:
      "Clean lines, reflective finishes, sculptural florals, and contemporary lighting for a refined modern celebration.",
    fallbackClassName: "from-[#2D2238] via-[#BFA2DB] to-[#FFFFFF]",
    flowersUsed: ["Hydrangea", "Tulips", "White roses"],
    gallery: ["/images/themes/modern-luxury-01.webp"],
    heroImage: "/images/themes/modern-luxury.webp",
    idealGuestCount: "120 - 600 guests",
    lightingUsed: ["Cool wash", "LED accents", "Pin spots"],
    recommendedBudget: "INR 14L+",
    recommendedThemeSlugs: ["minimal-luxe", "white-floral", "pastel-luxe"],
    slug: "modern-luxury",
    suitableVenues: ["Hotels", "Modern banquets", "Convention halls"],
    title: "Modern Luxury",
    videoSrc: "/videos/portfolio/modern-luxury-theme.mp4"
  },
  {
    category: "White Floral",
    colorPalette: ["#FFFFFF", "#EBDCFB", "#D4AF37", "#2D2238"],
    description:
      "White floral arches, mirrored surfaces, candles, and soft fragrance for a graceful reception or wedding.",
    fallbackClassName: "from-[#FFFFFF] via-[#EBDCFB] to-[#BFA2DB]",
    flowersUsed: ["White roses", "Orchids", "Baby breath"],
    gallery: ["/images/themes/white-floral-01.webp"],
    heroImage: "/images/themes/white-floral.webp",
    idealGuestCount: "150 - 700 guests",
    lightingUsed: ["Soft white", "Candle glow", "Floral pin spots"],
    recommendedBudget: "INR 16L+",
    recommendedThemeSlugs: ["modern-luxury", "pastel-luxe", "garden-wedding"],
    slug: "white-floral",
    suitableVenues: ["Resorts", "Lawns", "Luxury hotels"],
    title: "White Floral",
    videoSrc: "/videos/portfolio/white-floral-theme.mp4"
  },
  {
    category: "Haldi Theme",
    colorPalette: ["#D4AF37", "#F7D354", "#FFFFFF", "#2D2238"],
    description:
      "Fresh turmeric tones, marigold canopies, brass props, and playful seating for bright Haldi mornings.",
    fallbackClassName: "from-[#D4AF37] via-[#F7D354] to-[#FFFFFF]",
    flowersUsed: ["Marigold", "Sunflower", "Mogra"],
    gallery: ["/images/themes/haldi-theme-01.webp"],
    heroImage: "/images/themes/haldi-theme.webp",
    idealGuestCount: "80 - 350 guests",
    lightingUsed: ["Natural light", "Warm lanterns"],
    recommendedBudget: "INR 5L+",
    recommendedThemeSlugs: ["traditional-royal", "boho-mehndi", "garden-wedding"],
    slug: "haldi-theme",
    suitableVenues: ["Courtyards", "Lawns", "Poolside spaces"],
    title: "Haldi Theme",
    videoSrc: "/videos/portfolio/haldi-theme.mp4"
  }
] as const satisfies readonly EventTheme[];
