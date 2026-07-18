import type { BlogPost } from "@/types/blog";

export const blogPosts = [
  {
    author: "Shree Velora Editorial",
    category: "Wedding",
    content: [
      {
        body: "A luxury wedding theme should begin with the venue, guest experience, ceremony needs, and the couple's personal style. Royal themes work beautifully in heritage spaces, while white floral and modern luxury themes suit hotels and contemporary banquets.",
        heading: "Start With Venue And Mood"
      },
      {
        body: "The strongest themes repeat a clear visual language across entry, mandap, stage, table styling, lighting, flowers, and photo moments. This makes the entire wedding feel intentional instead of decorated in separate parts.",
        heading: "Create A Visual Thread"
      }
    ],
    date: "2026-06-10",
    description:
      "A practical guide to choosing a wedding decor theme that feels premium, personal, and photo-ready.",
    fallbackClassName: "from-[#2D2238] via-[#7d5ea1] to-[#D4AF37]",
    featured: true,
    imageAlt: "Luxury wedding mandap decor planning",
    imageSrc: "/images/blog/luxury-wedding-theme-guide.webp",
    readingTime: "5 min read",
    relatedSlugs: ["corporate-event-stage-design", "event-budget-planning-tips"],
    slug: "choose-luxury-wedding-theme",
    title: "How To Choose A Luxury Wedding Theme"
  },
  {
    author: "Shree Velora Planning Team",
    category: "Corporate",
    content: [
      {
        body: "Corporate stages need clarity before decoration. The audience must see the speaker, logo, screens, award movement, and camera angles without visual clutter.",
        heading: "Design For Visibility"
      },
      {
        body: "Premium corporate events rely on cue sheets, rehearsals, brand-safe colors, and clean lighting. The result should feel polished and reliable.",
        heading: "Make Production Predictable"
      }
    ],
    date: "2026-05-28",
    description:
      "What makes a corporate event stage look premium and function smoothly for guests, cameras, and leadership.",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    featured: true,
    imageAlt: "Corporate event stage design",
    imageSrc: "/images/blog/corporate-event-stage-design.webp",
    readingTime: "4 min read",
    relatedSlugs: ["event-budget-planning-tips", "choose-luxury-wedding-theme"],
    slug: "corporate-event-stage-design",
    title: "Corporate Event Stage Design That Looks Premium"
  },
  {
    author: "Shree Velora Budget Desk",
    category: "Planning",
    content: [
      {
        body: "Your first budget split should separate venue, decor, food, photography, lighting, sound, entertainment, and hospitality. This keeps decisions clear and prevents overspending in one area.",
        heading: "Separate Major Cost Buckets"
      },
      {
        body: "A good estimate includes a planning buffer for weather backup, guest count changes, last-minute vendor additions, and premium upgrades.",
        heading: "Keep A Practical Buffer"
      }
    ],
    date: "2026-05-12",
    description:
      "A simple framework to estimate an event budget before requesting a final quotation.",
    fallbackClassName: "from-[#3b2c44] via-[#826841] to-[#D4AF37]",
    featured: false,
    imageAlt: "Event budget planning table",
    imageSrc: "/images/blog/event-budget-planning-tips.webp",
    readingTime: "6 min read",
    relatedSlugs: ["choose-luxury-wedding-theme", "corporate-event-stage-design"],
    slug: "event-budget-planning-tips",
    title: "Event Budget Planning Tips For Premium Celebrations"
  }
] as const satisfies readonly BlogPost[];
