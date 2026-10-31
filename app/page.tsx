import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { AboutPreview } from "@/components/sections/about-preview";
import { CtaSection } from "@/components/sections/cta-section";
import { FeaturedGallerySection } from "@/components/sections/featured-gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { siteConfig } from "@/config/site";
import { optionalPublicAsset } from "@/lib/public-assets";
import { createHomepageJsonLd } from "@/utils/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    description: siteConfig.description,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "Shree Velora Event's | Luxury Wedding & Event Planner",
    type: "website",
    url: siteConfig.url
  },
  title: "Shree Velora Event's | Luxury Wedding & Event Planner",
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    title: "Shree Velora Event's | Luxury Wedding & Event Planner"
  }
};

const CLOUDINARY_HERO_DESKTOP_VIDEO =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.mp4";
const CLOUDINARY_HERO_MOBILE_VIDEO =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428708/shree_velora/videos/hero_mobile_video.mp4";

/** Renders the complete premium landing page with Cloudinary Video CDN. */
export default function HomePage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const desktopHeroVideoSrc =
    CLOUDINARY_HERO_DESKTOP_VIDEO ??
    optionalPublicAsset("/videos/landing-page.mp4") ??
    optionalPublicAsset("/videos/hero-desktop.mp4");
  const mobileHeroVideoSrc =
    CLOUDINARY_HERO_MOBILE_VIDEO ??
    optionalPublicAsset("/videos/landing-page.mp4") ??
    optionalPublicAsset("/videos/hero-mobile.mp4");

  return (
    <>
      <JsonLd data={createHomepageJsonLd()} />
      <Header logoSrc={logoSrc} />
      <main id="main-content">
        <HeroSection
          desktopVideoSrc={desktopHeroVideoSrc}
          mobileVideoSrc={mobileHeroVideoSrc}
        />
        <AboutPreview />
        <FeaturedGallerySection />
        <CtaSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
