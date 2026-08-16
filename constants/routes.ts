import type { NavigationItem } from "@/types/navigation";

export const routes = {
  about: "/about",
  admin: "/sv-portal-99770",
  blog: "/blog",
  booking: "/booking",
  budgetCalculator: "/budget-calculator",
  client: "/client",
  contact: "/contact",
  customize: "/customize",
  dashboard: "/dashboard",
  events: "/events",
  gallery: "/gallery",
  home: "/",
  packages: "/packages",
  portfolio: "/portfolio",
  privacyPolicy: "/privacy-policy",
  refundPolicy: "/refund-policy",
  services: "/services",
  termsAndConditions: "/terms-and-conditions",
  themes: "/themes",
  venues: "/venues"
} as const;

export const sectionIds = {
  about: "about",
  contact: "contact",
  customize: "customize",
  events: "events",
  gallery: "gallery",
  home: "home",
  packages: "packages",
  process: "process",
  services: "services",
  testimonials: "testimonials"
} as const;

export const primaryNavigation: readonly NavigationItem[] = [
  {
    href: "#home",
    label: "Home"
  },
  {
    href: "#services",
    label: "Services"
  },
  {
    href: "#gallery",
    label: "Gallery"
  },
  {
    href: "/customize",
    label: "Design Your Celebration"
  },
  {
    href: "#packages",
    label: "Packages"
  },
  {
    href: "#about",
    label: "About"
  },
  {
    href: "#contact",
    label: "Contact"
  }
];

export const futureRoutes = [
  routes.events,
  routes.gallery,
  routes.customize,
  routes.packages,
  routes.portfolio,
  routes.themes,
  routes.about,
  routes.contact,
  routes.blog,
  routes.budgetCalculator,
  routes.privacyPolicy,
  routes.termsAndConditions,
  routes.refundPolicy
] as const;
