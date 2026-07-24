"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowDown, Images, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { ScrollVideo } from "@/components/animations/scroll-video";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { EventCustomizerWizard } from "@/components/lead/event-customizer-wizard";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { featuredGallery } from "@/features/gallery/data/featured-gallery";
import { siteConfig } from "@/config/site";

interface HeroSectionProps {
  readonly desktopVideoSrc?: string;
  readonly mobileVideoSrc?: string;
}

/** Renders the cinematic landing hero with modal triggers for Customizer and Portfolio. */
export function HeroSection({
  desktopVideoSrc,
  mobileVideoSrc
}: HeroSectionProps): React.ReactElement {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#2D2238] text-white"
    >
      <ScrollVideo desktopSrc={desktopVideoSrc} mobileSrc={mobileVideoSrc} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,34,56,0.55)_0%,rgba(45,34,56,0.58)_42%,rgba(45,34,56,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(191,162,219,0.32),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.24),transparent_26%)]" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-16">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-[#EBDCFB] uppercase backdrop-blur">
            Crafting Extraordinary Celebrations
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 text-xl font-medium text-balance text-[#EBDCFB] sm:text-2xl">
            {siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Design Your Celebration Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <MagneticButton>
                  <GradientButton type="button">
                    <WandSparkles aria-hidden="true" className="size-4" />
                    Design Your Celebration
                  </GradientButton>
                </MagneticButton>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto border-[#EBDCFB] bg-[#FAF7FF] p-6 text-[#2D2238] sm:p-8">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-display text-2xl font-bold text-[#2D2238]">
                    Design Your Celebration
                  </DialogTitle>
                  <DialogDescription className="text-[#5c4b6e]">
                    Configure your event type, functions, theme, services, and budget step-by-step.
                  </DialogDescription>
                </DialogHeader>
                <EventCustomizerWizard />
              </DialogContent>
            </Dialog>

            {/* Explore Our Portfolio Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <MagneticButton>
                  <GradientButton tone="light" type="button">
                    <Images aria-hidden="true" className="size-4" />
                    Explore Our Portfolio
                  </GradientButton>
                </MagneticButton>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto border-[#EBDCFB] bg-[#FAF7FF] p-6 text-[#2D2238] sm:p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="font-display text-2xl font-bold text-[#2D2238]">
                    Signature Celebrations Portfolio
                  </DialogTitle>
                  <DialogDescription className="text-[#5c4b6e]">
                    Discover our collection of bespoke stages, lighting atmospheres, and luxury setups.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredGallery.map((item) => (
                    <article
                      className="group relative h-64 overflow-hidden rounded-xl border border-white/70 bg-white shadow-md"
                      key={item.title}
                    >
                      <ResponsiveImage
                        alt={item.alt}
                        className="size-full"
                        fallbackClassName={item.fallbackClassName}
                        imageClassName="transition duration-700 group-hover:scale-110"
                        sizes="(min-width: 768px) 33vw, 100vw"
                        src={item.imageSrc}
                        title={item.category}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/85 via-transparent to-transparent opacity-90" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-xs font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
                          {item.category}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                      </div>
                    </article>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
