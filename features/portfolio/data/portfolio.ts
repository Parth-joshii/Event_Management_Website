import type {
  ClientSuccessStory,
  PortfolioHighlight,
  PortfolioMetric,
  PortfolioVideo
} from "@/types/portfolio";

export const portfolioMetrics = [
  { label: "Events Planned", suffix: "+", value: 500 },
  { label: "Luxury Weddings", suffix: "+", value: 150 },
  { label: "Corporate Projects", suffix: "+", value: 50 },
  { label: "Client Satisfaction", suffix: "%", value: 98 }
] as const satisfies readonly PortfolioMetric[];

export const portfolioHighlights = [
  {
    description:
      "From intimate family rituals to multi-day destination weddings, the company journey is built on premium detailing and calm execution.",
    fallbackClassName: "from-[#2D2238] via-[#7d5ea1] to-[#D4AF37]",
    imageSrc: "/images/portfolio/company-journey.webp",
    title: "Company Journey"
  },
  {
    description:
      "Wedding decor, corporate staging, religious ceremonies, and institutional productions shaped with a luxury lens.",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    imageSrc: "/images/portfolio/projects.webp",
    title: "Projects"
  },
  {
    description:
      "Behind the scenes planning, vendor discipline, and guest-first coordination create the confidence clients remember.",
    fallbackClassName: "from-[#3b2c44] via-[#826841] to-[#D4AF37]",
    imageSrc: "/images/portfolio/behind-the-scenes.webp",
    title: "Behind The Scenes"
  }
] as const satisfies readonly PortfolioHighlight[];

export const portfolioVideos = [
  {
    category: "Wedding",
    description: "A cinematic highlight from a palace wedding with royal decor.",
    fallbackClassName: "from-[#2D2238] via-[#7d5ea1] to-[#D4AF37]",
    posterSrc: "/images/portfolio/videos/wedding-highlight.webp",
    title: "Royal Wedding Highlight",
    videoSrc: "/videos/portfolio/royal-wedding-highlight.mp4"
  },
  {
    category: "Corporate",
    description: "Award-night production with stage, sound, lighting, and guest flow.",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    posterSrc: "/images/portfolio/videos/corporate-highlight.webp",
    title: "Corporate Annual Meet",
    videoSrc: "/videos/portfolio/corporate-annual-meet.mp4"
  },
  {
    category: "Drone",
    description: "Aerial coverage of a destination wedding venue and outdoor mandap.",
    fallbackClassName: "from-[#1c3240] via-[#6c9aa8] to-[#D4AF37]",
    posterSrc: "/images/portfolio/videos/drone-highlight.webp",
    title: "Destination Drone Film",
    videoSrc: "/videos/portfolio/destination-drone-film.mp4"
  }
] as const satisfies readonly PortfolioVideo[];

export const clientSuccessStories = [
  {
    budget: "INR 35L - 50L",
    guestExperience:
      "Guests experienced a clear ritual flow, comfortable hospitality, and photo-ready moments across every function.",
    slug: "riya-aman-wedding-success-story",
    steps: [
      {
        description: "Mood board, budget, family requirements, and venue planning.",
        label: "Planning"
      },
      {
        description: "Palace venue walkthrough and guest movement design.",
        label: "Venue"
      },
      {
        description: "Yellow courtyard Haldi with marigold canopy.",
        label: "Haldi"
      },
      {
        description: "Pastel lounge styling and photo corners.",
        label: "Mehndi"
      },
      {
        description: "LED Sangeet stage, performances, and sound cues.",
        label: "Sangeet"
      },
      {
        description: "Royal mandap, rituals, and family coordination.",
        label: "Wedding"
      },
      {
        description: "White floral reception and candlelit entry.",
        label: "Reception"
      },
      {
        description: "Cinematic memories and a stress-free family experience.",
        label: "Result"
      }
    ],
    title: "Riya & Aman Wedding"
  }
] as const satisfies readonly ClientSuccessStory[];
