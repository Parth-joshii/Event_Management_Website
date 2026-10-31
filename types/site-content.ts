export interface HighlightCardContent {
  id: string;
  number: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export interface SiteContentData {
  hero: {
    badge: string;
    title: string;
    tagline: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    cards: HighlightCardContent[];
  };
  eventsSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  testimonialsSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  ctaSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
  contact: {
    phone: string;
    whatsappNumber: string;
    email: string;
    location: string;
    businessHours: string;
  };
}

export const defaultSiteContent: SiteContentData = {
  hero: {
    badge: "Crafting Extraordinary Celebrations",
    title: "Shree Velora Event's",
    tagline: "Where Moments Become the Masterpiece",
    ctaPrimaryText: "Design Your Celebration",
    ctaSecondaryText: "Explore Our Works"
  },
  about: {
    eyebrow: "About Shree Velora",
    title: "Signature Events, Flawlessly Executed",
    description:
      "Shree Velora Event's brings creative direction, luxury decor, and seamless coordination to royal weddings and grand celebrations.",
    cards: [
      {
        id: "bespoke-design",
        number: "01",
        title: "Bespoke Design",
        description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
        imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385048/shree_velora/about/diklrziwqbjvwhkm99vt.jpg"
      },
      {
        id: "flawless-execution",
        number: "02",
        title: "Flawless Execution",
        description: "Seamless vendor management and attentive on-day coordination.",
        imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385061/shree_velora/about/ryd7tzoa7dm5amkx6ne5.jpg"
      },
      {
        id: "curated-network",
        number: "03",
        title: "Curated Network",
        description: "Exclusive access to top-tier venues, artists, and production masters.",
        imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385074/shree_velora/about/zzryvnbb59enkedgocky.jpg"
      },
      {
        id: "transparent-pricing",
        number: "04",
        title: "Transparent Pricing",
        description: "Clear line-item quotes and real-time budget management.",
        imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385092/shree_velora/about/vx3ensckhdh1xsvit46v.jpg"
      }
    ]
  },
  eventsSection: {
    eyebrow: "Signature Occasions",
    title: "Distinctive Experiences For Every Celebration",
    description:
      "Click on any event below to explore all photos, decor highlights, and luxury stage setups created by Shree Velora Event's."
  },
  testimonialsSection: {
    eyebrow: "Client Stories",
    title: "Celebrations Remembered, Trust Earned",
    description:
      "Words from families, brands, and hosts who entrusted Shree Velora with their most meaningful occasions."
  },
  ctaSection: {
    eyebrow: "Your Celebration, Beautifully Imagined",
    title: "Let Us Create Something Truly Unforgettable",
    description:
      "Share your vision and allow our team to compose a tailored celebration proposal, considered budget, and distinctive design direction.",
    ctaPrimaryText: "Begin Your Journey",
    ctaSecondaryText: "WhatsApp Us"
  },
  contact: {
    phone: "+91 99770 24666",
    whatsappNumber: "919977024666",
    email: "shreeveloraevents@gmail.com",
    location: "India",
    businessHours: "Monday to Sunday, 9:00 AM - 8:00 PM"
  }
};
