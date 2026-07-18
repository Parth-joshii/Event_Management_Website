import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  compress: true,
  eslint: {
    ignoreDuringBuilds: false
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip"
    ]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  },
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
