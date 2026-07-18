import type { MetadataRoute } from "next";
import { blogPosts } from "@/features/blogs/data/blog-posts";
import { absoluteUrl } from "@/lib/utils";

/** Generates the initial sitemap for the platform foundation. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1 },
    { path: "/gallery", priority: 0.9 },
    { path: "/events", priority: 0.9 },
    { path: "/themes", priority: 0.86 },
    { path: "/packages", priority: 0.86 },
    { path: "/venues", priority: 0.84 },
    { path: "/portfolio", priority: 0.82 },
    { path: "/customize", priority: 0.95 },
    { path: "/budget-calculator", priority: 0.9 },
    { path: "/contact", priority: 0.9 },
    { path: "/about", priority: 0.78 },
    { path: "/blog", priority: 0.76 },
    { path: "/faq", priority: 0.72 },
    { path: "/privacy-policy", priority: 0.4 },
    { path: "/terms-and-conditions", priority: 0.4 },
    { path: "/refund-policy", priority: 0.4 },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.7
    }))
  ] as const;

  return routes.map((route) => ({
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: route.priority,
    url: absoluteUrl(route.path)
  }));
}
