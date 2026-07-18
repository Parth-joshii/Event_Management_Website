import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

/** Creates breadcrumb JSON-LD for showcase pages. */
export function createBreadcrumbJsonLd(
  items: readonly { href: string; label: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.href),
      name: item.label,
      position: index + 1
    }))
  };
}

/** Creates a generic collection schema for showcase listing pages. */
export function createCollectionJsonLd(
  name: string,
  description: string,
  url: string,
  itemNames: readonly string[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description,
    hasPart: itemNames.map((itemName) => ({
      "@type": "CreativeWork",
      name: itemName
    })),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    name,
    url: absoluteUrl(url)
  };
}

/** Creates an ImageGallery schema with ImageObject entries. */
export function createImageGalleryJsonLd(
  images: readonly {
    readonly alt: string;
    readonly caption: string;
    readonly description: string;
    readonly imageSrc: string;
  }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    associatedMedia: images.map((image) => ({
      "@type": "ImageObject",
      caption: image.caption,
      contentUrl: absoluteUrl(image.imageSrc),
      description: image.description,
      name: image.alt
    })),
    name: `${siteConfig.name} Luxury Gallery`
  };
}

/** Creates a structured Event schema for portfolio event details. */
export function createEventJsonLd(event: {
  readonly description: string;
  readonly image: string;
  readonly location: string;
  readonly name: string;
  readonly url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    description: event.description,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: absoluteUrl(event.image),
    location: {
      "@type": "Place",
      address: event.location,
      name: event.location
    },
    name: event.name,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    url: absoluteUrl(event.url)
  };
}

/** Creates FAQPage JSON-LD from public FAQ content. */
export function createFaqJsonLd(
  items: readonly { readonly answer: string; readonly question: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      },
      name: item.question
    }))
  };
}

/** Creates BlogPosting JSON-LD for individual blog articles. */
export function createBlogPostJsonLd(post: {
  readonly author: string;
  readonly date: string;
  readonly description: string;
  readonly imageSrc: string;
  readonly slug: string;
  readonly title: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Organization",
      name: post.author
    },
    datePublished: post.date,
    description: post.description,
    headline: post.title,
    image: absoluteUrl(post.imageSrc),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    url: absoluteUrl(`/blog/${post.slug}`)
  };
}
