"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { useContentStore } from "@/stores/content-store";

/** Renders interactive event category preview cards synced with Admin store & MongoDB. */
export function EventCategoriesSection(): React.ReactElement {
  const { events, fetchFromDatabase } = useContentStore();

  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  return (
    <section
      id="events"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#2D2238_100%)] py-24 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Signature Occasions"
            title="Distinctive Experiences For Every Celebration"
            description="Discover celebrations shaped with individual character—from timeless weddings and private soirées to polished corporate and cultural occasions."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((category, index) => (
            <Reveal delay={index * 0.05} key={category.id || category.title}>
              <div
                className="group relative block overflow-hidden rounded-lg border border-white/20 shadow-[0_26px_90px_rgba(45,34,56,0.18)]"
              >
                <div className="h-80 w-full overflow-hidden bg-[#2D2238]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={category.imageAlt || category.title}
                    className="size-full object-cover transition duration-700 group-hover:scale-110"
                    src={category.imageSrc}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/gallery/wedding-stage.jpg";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/88 via-[#2D2238]/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/16 backdrop-blur text-[#D4AF37]">
                    <Sparkles aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="text-2xl font-semibold font-display">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/76 line-clamp-2">
                    {category.description}
                  </p>
                  <Link
                    href="#contact"
                    className="mt-5 inline-flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Plan Event
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
