import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { AboutPreview } from "@/components/sections/about-preview";
import { ContactPreviewSection } from "@/components/sections/contact-preview-section";
import { CtaSection } from "@/components/sections/cta-section";
import { EventCategoriesSection } from "@/components/sections/event-categories-section";
import { FeaturedGallerySection } from "@/components/sections/featured-gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessTimelineSection } from "@/components/sections/process-timeline-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { siteConfig } from "@/config/site";
import { optionalPublicAsset, publicAssetExists } from "@/lib/public-assets";
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

/** Renders the complete premium landing page. */
export default function HomePage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const hasHeroVideo = publicAssetExists("/videos/hero-event.mp4");

  return (
    <>
      <JsonLd data={createHomepageJsonLd()} />
      <Header logoSrc={logoSrc} />
      <main id="main-content">
        <HeroSection hasHeroVideo={hasHeroVideo} />
        <AboutPreview />
        <WhyChooseUs />
        <ServicesSection />
        <EventCategoriesSection />
        <StatsSection />
        <FeaturedGallerySection />
        <ProcessTimelineSection />
        <CtaSection />
        <TestimonialsSection />
        <ContactPreviewSection />
      </main>
      <Footer />
    </>
  );
}
