import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

/** Generates robots directives for public and private platform routes. */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    host: siteConfig.url,
    rules: {
      allow: isProduction ? "/" : undefined,
      disallow: isProduction ? ["/admin", "/client", "/dashboard"] : "/",
      userAgent: "*"
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
