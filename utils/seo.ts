import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

/** Builds a canonical URL from an application pathname. */
export function createCanonicalUrl(pathname: string): string {
  return absoluteUrl(pathname);
}

/** Creates organization JSON-LD for the luxury event management brand. */
export function createOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanningBusiness",
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address
    },
    description: siteConfig.description,
    email: siteConfig.contact.email,
    name: siteConfig.name,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    slogan: siteConfig.tagline,
    telephone: siteConfig.contact.phone,
    url: siteConfig.url
  };
}

/** Creates LocalBusiness and EventService JSON-LD for the homepage. */
export function createHomepageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${siteConfig.url}/#business`,
        "@type": ["LocalBusiness", "EventPlanningBusiness"],
        address: {
          "@type": "PostalAddress",
          ...siteConfig.address
        },
        description: siteConfig.description,
        email: siteConfig.contact.email,
        name: siteConfig.name,
        openingHours: "Mo-Su 09:00-20:00",
        priceRange: "$$$",
        slogan: siteConfig.tagline,
        telephone: siteConfig.contact.phone,
        url: siteConfig.url
      },
      {
        "@id": `${siteConfig.url}/#event-service`,
        "@type": "Service",
        areaServed: "India",
        category: "Luxury Event Management",
        description: siteConfig.description,
        name: `${siteConfig.name} Luxury Wedding & Event Planning`,
        provider: {
          "@id": `${siteConfig.url}/#business`
        },
        serviceType: [
          "Luxury Wedding Planning",
          "Corporate Event Planning",
          "Birthday Party Planning",
          "Religious Event Decoration",
          "School Function Management",
          "Private Party Planning"
        ]
      }
    ]
  };
}
