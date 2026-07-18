import type { SiteConfig } from "@/types/site";

export const siteConfig = {
  address: {
    addressCountry: "IN",
    addressLocality: "India",
    addressRegion: "India",
    streetAddress: "Consultation by appointment"
  },
  contact: {
    businessHours: "Monday to Sunday, 9:00 AM - 8:00 PM",
    email: "hello@shreeveloraevents.com",
    location: "India",
    phone: "+91 98765 43210",
    whatsappNumber: "919876543210"
  },
  description:
    "Shree Velora Event's creates luxury weddings, corporate events, birthday parties, private celebrations, religious events, and school functions with premium decor, lighting, sound, photography, and complete event management.",
  keywords: [
    "luxury wedding planner",
    "event management company",
    "wedding decorator",
    "corporate event planner",
    "birthday event planner",
    "religious event decoration",
    "event planner in India"
  ],
  locale: "en_IN",
  name: "Shree Velora Event's",
  services: [
    "Luxury Weddings",
    "Corporate Events",
    "Birthday Parties",
    "Private Parties",
    "School & College Events",
    "Religious Events",
    "Destination Weddings",
    "Luxury Decorations",
    "Photography",
    "Lighting",
    "Sound",
    "SFX",
    "Artists",
    "Anchors",
    "Band",
    "Ghodi",
    "Vintage Cars",
    "Venue Management",
    "Event Planning"
  ],
  social: {
    facebook: "",
    instagram: "",
    whatsapp:
      "https://wa.me/919876543210?text=Hi%20Shree%20Velora%20Event's%2C%20I%20want%20to%20plan%20an%20event.",
    youtube: ""
  },
  tagline: "Turning Every Occasion Into A Luxury Celebration",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
} as const satisfies SiteConfig;
