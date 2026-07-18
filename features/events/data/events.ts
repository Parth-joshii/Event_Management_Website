import type { PortfolioEvent } from "@/types/event";

export const portfolioEvents = [
  {
    budgetRange: "INR 35L - 50L",
    category: "Luxury Weddings",
    challenges: [
      "Coordinating multiple rituals across two venues",
      "Maintaining a royal look without blocking guest movement"
    ],
    clientName: "Riya Sharma & Aman Mehta",
    clientReview:
      "The decor, lighting, and complete management were absolutely beautiful. Our reception looked royal and stress-free.",
    clientStory:
      "Riya and Aman wanted a royal wedding experience that felt cinematic yet deeply personal for their families.",
    decorationTheme: "Royal Palace",
    duration: "3 Days",
    entertainment: "Live Sufi band, Sangeet choreographers, bridal entry team",
    fallbackClassName: "from-[#2D2238] via-[#7d5ea1] to-[#D4AF37]",
    finalResult:
      "A seamless three-day celebration with a palace mandap, candlelit reception, and complete guest support.",
    food: "Multi-cuisine royal dining counters with live dessert stations",
    gallery: [
      "/images/events/riya-aman-01.webp",
      "/images/events/riya-aman-02.webp",
      "/images/events/riya-aman-03.webp"
    ],
    guestCount: 620,
    heroImage: "/images/events/riya-aman-royal-wedding.webp",
    heroImageAlt: "Royal wedding stage for Riya and Aman",
    lighting: "Amber wash, pin spots, moving heads, and floral edge lights",
    location: "Jaipur",
    photography: "Cinematic photo and highlight film team",
    servicesUsed: ["Decor", "Lighting", "Photography", "Sound", "Artists"],
    slug: "riya-aman-royal-wedding",
    solutions: [
      "Created separate ritual zones with one visual language",
      "Used timed vendor entries and a dedicated guest movement crew"
    ],
    testimonial:
      "Shree Velora Event's made our reception look royal and handled every detail calmly.",
    theme: "Royal Palace",
    timeline: [
      {
        description: "Family consultation, venue walk-through, and mood board.",
        label: "Planning"
      },
      {
        description: "Haldi, Mehndi, and Sangeet decor installed overnight.",
        label: "Pre-Wedding"
      },
      {
        description: "Mandap, guest entry, photography, and rituals managed.",
        label: "Wedding"
      },
      {
        description: "Reception stage, dining, and farewell experience.",
        label: "Reception"
      }
    ],
    title: "Riya & Aman Royal Wedding",
    venue: "Jaipur Heritage Palace",
    videoSrc: "/videos/events/riya-aman-highlight.mp4",
    year: 2026
  },
  {
    budgetRange: "INR 18L - 26L",
    category: "Corporate",
    challenges: [
      "Brand compliance across stage and print",
      "Fast award-night transitions"
    ],
    clientName: "Aster Technologies",
    clientReview:
      "The team handled our annual meet with complete professionalism, from stage setup to guest coordination.",
    clientStory:
      "Aster needed a premium annual meet that looked polished for leadership, partners, and employees.",
    decorationTheme: "Modern Luxury",
    duration: "1 Day",
    entertainment: "Anchor, award cues, DJ closing set",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    finalResult:
      "A sharp corporate night with stage discipline, branding, smooth awards, and high guest satisfaction.",
    food: "Executive dinner buffet and coffee service",
    gallery: [
      "/images/events/aster-01.webp",
      "/images/events/aster-02.webp",
      "/images/events/aster-03.webp"
    ],
    guestCount: 420,
    heroImage: "/images/events/aster-annual-meet.webp",
    heroImageAlt: "Corporate annual meet stage",
    lighting: "Clean stage wash, branded gobos, and controlled audience light",
    location: "Gurugram",
    photography: "Corporate photo and aftermovie crew",
    servicesUsed: ["Stage", "Branding", "Sound", "Lighting", "Guest Desk"],
    slug: "aster-corporate-annual-meet",
    solutions: [
      "Prepared brand-safe stage templates",
      "Built a cue sheet for awards, AV, and anchor moments"
    ],
    testimonial:
      "Professional, punctual, and premium. The event felt effortless for our team.",
    theme: "Modern Luxury",
    timeline: [
      {
        description: "Brand audit, agenda planning, vendor briefing.",
        label: "Planning"
      },
      {
        description: "Stage, sound, lighting, registration desk setup.",
        label: "Setup"
      },
      {
        description: "Awards, leadership speeches, entertainment.",
        label: "Event"
      }
    ],
    title: "Aster Corporate Annual Meet",
    venue: "Gurugram Convention Centre",
    videoSrc: "/videos/events/aster-annual-meet.mp4",
    year: 2026
  },
  {
    budgetRange: "INR 7L - 12L",
    category: "Birthday",
    challenges: ["Creating child-safe decor", "Balancing premium styling with games"],
    clientName: "Neha Jain Family",
    clientReview:
      "The theme decoration and event flow were amazing. Everything looked premium and perfectly planned.",
    clientStory:
      "The family wanted a refined first-birthday celebration with soft colors, stage moments, and playful guest zones.",
    decorationTheme: "Pastel Luxury",
    duration: "1 Evening",
    entertainment: "Anchor, games, mascot entry, DJ",
    fallbackClassName: "from-[#573268] via-[#BFA2DB] to-[#D4AF37]",
    finalResult:
      "A premium birthday experience with a photo-friendly stage and a comfortable flow for families.",
    food: "Family buffet, kids counter, dessert wall",
    gallery: [
      "/images/events/neha-birthday-01.webp",
      "/images/events/neha-birthday-02.webp"
    ],
    guestCount: 180,
    heroImage: "/images/events/neha-birthday-celebration.webp",
    heroImageAlt: "Pastel luxury birthday celebration",
    lighting: "Soft lavender wash and warm table glow",
    location: "Pune",
    photography: "Event photo and candid kids coverage",
    servicesUsed: ["Theme Decor", "Anchor", "Games", "Photography", "Sound"],
    slug: "neha-birthday-celebration",
    solutions: [
      "Used stable stage structures and soft edges",
      "Separated kids games from dining and photo zones"
    ],
    testimonial: "Every detail looked beautiful and the event moved perfectly.",
    theme: "Pastel",
    timeline: [
      {
        description: "Theme selection, child-safe planning, guest flow.",
        label: "Planning"
      },
      {
        description: "Stage, games, food counters, and photo zone.",
        label: "Setup"
      },
      {
        description: "Entry, cake, games, family photos.",
        label: "Celebration"
      }
    ],
    title: "Neha Jain Birthday Celebration",
    venue: "Pune Luxury Banquet",
    videoSrc: "/videos/events/neha-birthday.mp4",
    year: 2025
  },
  {
    budgetRange: "INR 55L - 80L",
    category: "Destination Wedding",
    challenges: ["Multi-city vendor logistics", "Outdoor weather planning"],
    clientName: "Anaya & Dev",
    clientReview:
      "Their destination planning gave us a beautiful celebration without the stress of coordinating anything ourselves.",
    clientStory:
      "Anaya and Dev wanted an intimate coastal wedding with luxury hospitality and an outdoor mandap.",
    decorationTheme: "Destination Palace",
    duration: "4 Days",
    entertainment: "Live percussion, beach welcome night, DJ, folk artists",
    fallbackClassName: "from-[#1c3240] via-[#6c9aa8] to-[#D4AF37]",
    finalResult:
      "A coastal destination wedding with thoughtful hospitality, drone coverage, and weather-safe execution.",
    food: "Regional coastal menus, live counters, premium bar",
    gallery: ["/images/events/anaya-dev-01.webp", "/images/events/anaya-dev-02.webp"],
    guestCount: 240,
    heroImage: "/images/events/anaya-dev-destination-wedding.webp",
    heroImageAlt: "Destination wedding mandap by the sea",
    lighting: "Outdoor fairy canopy, mandap spots, pathway lanterns",
    location: "Goa",
    photography: "Drone, photo, highlight film, reels",
    servicesUsed: ["Venue", "Hospitality", "Decor", "Drone", "Artists"],
    slug: "anaya-dev-destination-wedding",
    solutions: [
      "Created a backup indoor layout",
      "Grouped vendor transport, storage, and installation windows"
    ],
    testimonial: "The wedding felt like a luxury holiday for every guest.",
    theme: "Destination",
    timeline: [
      {
        description: "Travel, rooms, vendor plan, and weather backup.",
        label: "Planning"
      },
      {
        description: "Welcome dinner and beach night.",
        label: "Welcome"
      },
      {
        description: "Haldi, Mehndi, Sangeet, Wedding, Reception.",
        label: "Functions"
      }
    ],
    title: "Anaya & Dev Destination Wedding",
    venue: "Goa Sea View Resort",
    videoSrc: "/videos/events/anaya-dev-destination.mp4",
    year: 2026
  }
] as const satisfies readonly PortfolioEvent[];
