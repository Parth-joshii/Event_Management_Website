"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, Images, WandSparkles } from "lucide-react";
import { GoldenParticles } from "@/components/animations/golden-particles";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { ScrollVideo } from "@/components/animations/scroll-video";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";
import { useContentStore } from "@/stores/content-store";

const DEFAULT_CDN_DESKTOP_VIDEO =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.mp4";
const DEFAULT_CDN_MOBILE_VIDEO =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428708/shree_velora/videos/hero_mobile_video.mp4";
const DEFAULT_CDN_POSTER =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.jpg";

interface HeroSectionProps {
  readonly desktopVideoSrc?: string;
  readonly mobileVideoSrc?: string;
}

/** Renders the cinematic landing hero with Cloudinary Video, floating gold dust particles & direct navigation. */
export function HeroSection({
  desktopVideoSrc,
  mobileVideoSrc
}: HeroSectionProps): React.ReactElement {
  const { siteContent } = useContentStore();
  const hero = siteContent?.hero || {
    badge: "Crafting Extraordinary Celebrations",
    title: siteConfig.name,
    tagline: siteConfig.tagline,
    ctaPrimaryText: "Design Your Celebration",
    ctaSecondaryText: "Explore Our Works"
  };

  const finalDesktopVideo = hero.desktopVideoUrl || desktopVideoSrc || DEFAULT_CDN_DESKTOP_VIDEO;
  const finalMobileVideo = hero.mobileVideoUrl || mobileVideoSrc || DEFAULT_CDN_MOBILE_VIDEO;
  const finalPoster = hero.posterImageUrl || DEFAULT_CDN_POSTER;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#2D2238] text-white"
    >
      <ScrollVideo
        desktopSrc={finalDesktopVideo}
        mobileSrc={finalMobileVideo}
        poster={finalPoster}
      />

      {/* Atmospheric dark gradient overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,34,56,0.55)_0%,rgba(45,34,56,0.58)_42%,rgba(45,34,56,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(191,162,219,0.32),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.24),transparent_26%)]" />

      {/* Floating golden dust & bokeh sparkles */}
      <GoldenParticles count={22} className="opacity-80" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center pt-2 pb-24 -translate-y-12 sm:pt-10 sm:-translate-y-10 lg:-translate-y-16">
        <Reveal className="mx-auto max-w-6xl text-center">
          <p className="mx-auto mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[8px] sm:text-[9px] font-semibold tracking-[0.22em] text-[#EBDCFB]/90 uppercase backdrop-blur shadow-sm">
            {hero.badge || "Crafting Extraordinary Celebrations"}
          </p>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-balance sm:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            {hero.title || siteConfig.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs font-normal tracking-wide text-balance text-[#EBDCFB]/80 sm:text-sm lg:text-base">
            {hero.tagline || siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <GradientButton asChild>
                <Link href="/customize" className="inline-flex items-center gap-2">
                  <WandSparkles aria-hidden="true" className="size-4" />
                  {hero.ctaPrimaryText || "Design Your Celebration"}
                </Link>
              </GradientButton>
            </MagneticButton>

            <MagneticButton>
              <GradientButton asChild tone="light">
                <Link href="/gallery" className="inline-flex items-center gap-2">
                  <Images aria-hidden="true" className="size-4" />
                  {hero.ctaSecondaryText || "Explore Our Works"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </GradientButton>
            </MagneticButton>
          </div>
        </Reveal>
      </Container>

      <Link
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none md:flex"
        href="#about"
      >
        <span>Scroll</span>
        <ArrowDown aria-hidden="true" className="size-4 animate-bounce" />
      </Link>
    </section>
  );
}
