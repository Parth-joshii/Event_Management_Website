export const featureModules = [
  "gallery",
  "booking",
  "admin",
  "dashboard",
  "client",
  "authentication",
  "customizer",
  "calculator",
  "planner",
  "contact",
  "packages",
  "themes",
  "venues",
  "services",
  "blogs",
  "testimonials",
  "faq"
] as const;

export type FeatureModule = (typeof featureModules)[number];
