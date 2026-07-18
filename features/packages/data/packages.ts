import type { EventPackage } from "@/types/package";

export const eventPackages = [
  {
    brochurePath: "/documents/shree-velora-silver-package.pdf",
    description:
      "Elegant essentials for intimate celebrations and budget-aware events.",
    includedServices: ["Basic decoration", "Photography", "Sound", "Anchor"],
    name: "Silver",
    price: "Starting INR 2.5L",
    recommendedFor: "Birthdays, small private parties, school functions",
    services: {
      accommodation: false,
      anchor: true,
      band: false,
      decoration: true,
      drone: false,
      fireworks: false,
      flowers: true,
      food: false,
      led: false,
      lighting: true,
      luxuryEntry: false,
      photography: true
    }
  },
  {
    brochurePath: "/documents/shree-velora-gold-package.pdf",
    description:
      "A balanced package with stronger styling, lighting, and guest experience.",
    includedServices: ["Theme decoration", "Photography", "Lighting", "Anchor", "DJ"],
    name: "Gold",
    price: "Starting INR 5L",
    recommendedFor: "Receptions, Haldi, Mehndi, corporate events",
    services: {
      accommodation: false,
      anchor: true,
      band: false,
      decoration: true,
      drone: false,
      fireworks: false,
      flowers: true,
      food: true,
      led: true,
      lighting: true,
      luxuryEntry: false,
      photography: true
    }
  },
  {
    brochurePath: "/documents/shree-velora-diamond-package.pdf",
    description: "Premium production for weddings and high-impact corporate evenings.",
    includedServices: ["Premium decor", "Drone", "LED", "Band", "Food"],
    name: "Diamond",
    price: "Starting INR 12L",
    recommendedFor: "Luxury weddings, annual meets, receptions",
    services: {
      accommodation: false,
      anchor: true,
      band: true,
      decoration: true,
      drone: true,
      fireworks: false,
      flowers: true,
      food: true,
      led: true,
      lighting: true,
      luxuryEntry: true,
      photography: true
    }
  },
  {
    brochurePath: "/documents/shree-velora-royal-package.pdf",
    description:
      "A grand wedding package with high-detail decor and signature entries.",
    includedServices: ["Royal decor", "Vintage car", "Ghodi", "Band", "Fireworks"],
    name: "Royal",
    price: "Starting INR 25L",
    recommendedFor: "Royal weddings and destination celebrations",
    services: {
      accommodation: false,
      anchor: true,
      band: true,
      decoration: true,
      drone: true,
      fireworks: true,
      flowers: true,
      food: true,
      led: true,
      lighting: true,
      luxuryEntry: true,
      photography: true
    }
  },
  {
    brochurePath: "/documents/shree-velora-platinum-package.pdf",
    description:
      "Full luxury management for multi-day weddings and premium destination events.",
    includedServices: [
      "Hospitality",
      "Accommodation",
      "Full production",
      "Luxury entries"
    ],
    name: "Platinum",
    price: "Custom Quote",
    recommendedFor: "Multi-day destination weddings and elite corporate productions",
    services: {
      accommodation: true,
      anchor: true,
      band: true,
      decoration: true,
      drone: true,
      fireworks: true,
      flowers: true,
      food: true,
      led: true,
      lighting: true,
      luxuryEntry: true,
      photography: true
    }
  }
] as const satisfies readonly EventPackage[];
