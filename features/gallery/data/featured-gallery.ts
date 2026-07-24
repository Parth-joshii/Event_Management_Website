import type { FeaturedGalleryItem } from "@/types/gallery";

export const featuredGallery = [
  {
    alt: "Luxury wedding stage with floral decor",
    category: "Wedding Stage",
    fallbackClassName: "from-[#2D2238] via-[#8768a8] to-[#D4AF37]",
    imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    title: "Royal Wedding Stage"
  },
  {
    alt: "Haldi ceremony decor with yellow floral accents",
    category: "Haldi Decor",
    fallbackClassName: "from-[#8d6b20] via-[#D4AF37] to-[#EBDCFB]",
    imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    title: "Sunlit Haldi Decor"
  },
  {
    alt: "Reception decor with luxury lighting",
    category: "Reception",
    fallbackClassName: "from-[#2D2238] via-[#4d385f] to-[#BFA2DB]",
    imageSrc: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    title: "Cinematic Reception"
  },
  {
    alt: "Corporate setup with premium stage lighting",
    category: "Corporate Setup",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    imageSrc: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    title: "Executive Stage"
  },
  {
    alt: "Birthday theme decor with premium styling",
    category: "Birthday Theme",
    fallbackClassName: "from-[#573268] via-[#BFA2DB] to-[#D4AF37]",
    imageSrc: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    title: "Signature Birthday"
  },
  {
    alt: "Religious event decor with floral stage",
    category: "Religious Event",
    fallbackClassName: "from-[#3b2c44] via-[#826841] to-[#D4AF37]",
    imageSrc: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1200&q=80",
    title: "Sacred Ceremony"
  }
] as const satisfies readonly FeaturedGalleryItem[];
