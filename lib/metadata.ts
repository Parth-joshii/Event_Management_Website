import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const defaultMetadata: Metadata = {
  alternates: {
    canonical: siteConfig.url
  },
  applicationName: siteConfig.name,
  authors: [
    {
      name: siteConfig.name
    }
  ],
  creator: siteConfig.name,
  description: siteConfig.description,
  formatDetection: {
    address: false,
    email: false,
    telephone: false
  },
  metadataBase: new URL(siteConfig.url),
  keywords: [...siteConfig.keywords],
  openGraph: {
    description: siteConfig.description,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`
    },
    type: "website",
    url: siteConfig.url
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    title: siteConfig.name
  }
};
