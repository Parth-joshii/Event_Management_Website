"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Images, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { ScrollVideo } from "@/components/animations/scroll-video";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomizerWizard } from "@/components/lead/event-customizer-wizard";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { serviceOfferings } from "@/features/services/data/services";
import { eventCategories } from "@/features/events/data/event-categories";
import { useContentStore } from "@/stores/content-store";
import { siteConfig } from "@/config/site";
import { resolveRenderableImageSrc } from "@/lib/utils";

interface HeroSectionProps {
  readonly desktopVideoSrc?: string;
  readonly mobileVideoSrc?: string;
}

/** Renders the cinematic landing hero with modal triggers for Customizer and Portfolio. */
export function HeroSection({
  desktopVideoSrc,
  mobileVideoSrc
}: HeroSectionProps): React.ReactElement {
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const { photos } = useContentStore();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#2D2238] text-white"
    >
      <ScrollVideo desktopSrc={desktopVideoSrc} mobileSrc={mobileVideoSrc} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,34,56,0.55)_0%,rgba(45,34,56,0.58)_42%,rgba(45,34,56,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(191,162,219,0.32),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.24),transparent_26%)]" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center pt-2 pb-24 -translate-y-12 sm:pt-10 sm:-translate-y-10 lg:-translate-y-16">
        <Reveal className="mx-auto max-w-6xl text-center">
          <p className="mx-auto mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[8px] sm:text-[9px] font-semibold tracking-[0.22em] text-[#EBDCFB]/90 uppercase backdrop-blur shadow-sm">
            Crafting Extraordinary Celebrations
          </p>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-balance sm:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs font-normal tracking-wide text-balance text-[#EBDCFB]/80 sm:text-sm lg:text-base">
            {siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Design Your Celebration Modal */}
            <Dialog onOpenChange={setCustomizerOpen} open={customizerOpen}>
              <MagneticButton>
                <DialogTrigger asChild>
                  <GradientButton type="button">
                    <WandSparkles aria-hidden="true" className="size-4" />
                    Design Your Celebration
                  </GradientButton>
                </DialogTrigger>
              </MagneticButton>
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

            {/* Explore Our Portfolio / Projects Modal */}
            <Dialog>
              <MagneticButton>
                <DialogTrigger asChild>
                  <GradientButton tone="light" type="button">
                    <Images aria-hidden="true" className="size-4" />
                    Explore Our Projects
                  </GradientButton>
                </DialogTrigger>
              </MagneticButton>
              <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto border-[#EBDCFB] bg-[#FAF7FF] p-6 text-[#2D2238] sm:p-8">
                <DialogHeader className="mb-6 text-left">
                  <DialogTitle className="font-display text-2xl font-bold text-[#2D2238]">
                    Our Portfolio & Expertise
                  </DialogTitle>
                  <DialogDescription className="text-[#5c4b6e]">
                    Discover curated service offerings, signature celebration categories, and featured project stages.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="expertise" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#EBDCFB]/50 p-1">
                    <TabsTrigger value="expertise">Our Expertise</TabsTrigger>
                    <TabsTrigger value="occasions">Signature Occasions</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery Showcase</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Our Expertise */}
                  <TabsContent value="expertise" className="space-y-6">
                    <div className="text-left mb-4">
                      <h3 className="font-display text-xl font-bold text-[#2D2238]">
                        Curated Services For Remarkable Celebrations
                      </h3>
                      <p className="mt-1 text-sm text-[#5c4b6e]">
                        From intimate gatherings to grand-scale productions, every service is tailored with refined aesthetics, thoughtful hospitality, and flawless operational detail.
                      </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {serviceOfferings.map((service) => {
                        const Icon = service.icon;

                        return (
                          <div
                            className="group overflow-hidden rounded-xl border border-[#EBDCFB] bg-white p-5 shadow-sm transition hover:shadow-md"
                            key={service.title}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-[#EBDCFB] text-[#7d5ea1]">
                                <Icon aria-hidden="true" className="size-5" />
                              </div>
                              <h4 className="font-display text-lg font-semibold text-[#2D2238]">
                                {service.title}
                              </h4>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-[#5c4b6e]">
                              {service.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {service.included.map((item) => (
                                <Badge
                                  className="border-[#BFA2DB]/50 bg-[#FAF7FF] text-[#5c4b6e] text-xs"
                                  key={item}
                                  variant="outline"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                            <button
                              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#7d5ea1] hover:text-[#2D2238]"
                              onClick={() => setCustomizerOpen(true)}
                              type="button"
                            >
                              Curate Your Event
                              <ArrowRight className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* Tab 2: Signature Occasions */}
                  <TabsContent value="occasions" className="space-y-6">
                    <div className="text-left mb-4">
                      <h3 className="font-display text-xl font-bold text-[#2D2238]">
                        Distinctive Experiences For Every Celebration
                      </h3>
                      <p className="mt-1 text-sm text-[#5c4b6e]">
                        Discover celebrations shaped with individual character—from timeless weddings and private soirées to polished corporate and cultural occasions.
                      </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {eventCategories.map((category) => {
                        const Icon = category.icon;

                        return (
                          <div
                            className="group relative h-64 overflow-hidden rounded-xl border border-[#EBDCFB] bg-[#2D2238] shadow-sm text-white"
                            key={category.title}
                          >
                            <ResponsiveImage
                              alt={category.imageAlt}
                              className="size-full"
                              fallbackClassName={category.fallbackClassName}
                              imageClassName="transition duration-700 group-hover:scale-110"
                              sizes="(min-width: 768px) 33vw, 100vw"
                              src={category.imageSrc}
                              title={category.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/90 via-[#2D2238]/30 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                <Icon aria-hidden="true" className="size-4 text-[#D4AF37]" />
                              </div>
                              <h4 className="text-lg font-semibold">{category.title}</h4>
                              <p className="mt-1 text-xs leading-5 text-white/80 line-clamp-2">
                                {category.description}
                              </p>
                              <button
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]"
                                onClick={() => setCustomizerOpen(true)}
                                type="button"
                              >
                                Discover More
                                <ArrowUpRight className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* Tab 3: Gallery Showcase */}
                  <TabsContent value="gallery">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {photos.map((item) => (
                        <article
                          className="group relative h-60 overflow-hidden rounded-xl border border-white/70 bg-[#2D2238] shadow-md text-white text-left"
                          key={item.id || item.title}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={item.alt || item.title}
                            className="size-full object-cover transition duration-700 group-hover:scale-110"
                            src={resolveRenderableImageSrc(item.imageSrc)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/gallery/wedding-stage.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/85 via-transparent to-transparent opacity-90" />
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <p className="text-xs font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
                              {item.category}
                            </p>
                            <h4 className="mt-1 text-base font-semibold">{item.title}</h4>
                          </div>
                        </article>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
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
