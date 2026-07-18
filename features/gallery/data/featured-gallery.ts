import type { FeaturedGalleryItem } from "@/types/gallery";

export const featuredGallery = [
  {
    alt: "Luxury wedding stage with floral decor",
    category: "Wedding Stage",
    fallbackClassName: "from-[#2D2238] via-[#8768a8] to-[#D4AF37]",
    imageSrc: "/images/gallery/wedding-stage.jpg",
    title: "Royal Wedding Stage"
  },
  {
    alt: "Haldi ceremony decor with yellow floral accents",
    category: "Haldi Decor",
    fallbackClassName: "from-[#8d6b20] via-[#D4AF37] to-[#EBDCFB]",
    imageSrc: "/images/gallery/haldi-decor.jpg",
    title: "Sunlit Haldi Decor"
  },
  {
    alt: "Reception decor with luxury lighting",
    category: "Reception",
    fallbackClassName: "from-[#2D2238] via-[#4d385f] to-[#BFA2DB]",
    imageSrc: "/images/gallery/reception.jpg",
    title: "Cinematic Reception"
  },
  {
    alt: "Corporate setup with premium stage lighting",
    category: "Corporate Setup",
    fallbackClassName: "from-[#202635] via-[#556079] to-[#BFA2DB]",
    imageSrc: "/images/gallery/corporate-setup.jpg",
    title: "Executive Stage"
  },
  {
    alt: "Birthday theme decor with premium styling",
    category: "Birthday Theme",
    fallbackClassName: "from-[#573268] via-[#BFA2DB] to-[#D4AF37]",
    imageSrc: "/images/gallery/birthday-theme.jpg",
    title: "Signature Birthday"
  },
  {
    alt: "Religious event decor with floral stage",
    category: "Religious Event",
    fallbackClassName: "from-[#3b2c44] via-[#826841] to-[#D4AF37]",
    imageSrc: "/images/gallery/religious-event.jpg",
    title: "Sacred Ceremony"
  }
] as const satisfies readonly FeaturedGalleryItem[];
