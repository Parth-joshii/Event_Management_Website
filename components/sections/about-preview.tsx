"use client";

import * as React from "react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { useContentStore } from "@/stores/content-store";

const defaultHighlights = [
  {
    id: "bespoke-design",
    number: "01",
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    title: "Bespoke Design"
  },
  {
    id: "flawless-execution",
    number: "02",
    description: "Seamless vendor management and attentive on-day coordination.",
    title: "Flawless Execution"
  },
  {
    id: "curated-network",
    number: "03",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    title: "Curated Network"
  },
  {
    id: "transparent-pricing",
    number: "04",
    description: "Clear line-item quotes and real-time budget management.",
    title: "Transparent Pricing"
  }
];

/** Renders the concise brand introduction and highlight cards with customizable background images & ultra-premium layout. */
export function AboutPreview(): React.ReactElement {
  const { aboutCards, fetchFromDatabase } = useContentStore();

  // Sync latest cloud data on client mount
  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FAF7FF_0%,#F5EDFF_100%)] py-16 sm:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#2D2238] to-transparent opacity-10" />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="About Shree Velora"
            title="Signature Events, Flawlessly Executed"
            description="Shree Velora Event's brings creative direction, luxury decor, and seamless coordination to royal weddings and grand celebrations."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {defaultHighlights.map((defaultItem, index) => {
            const storeCard = aboutCards?.find((c) => c.id === defaultItem.id);
            const title = storeCard?.title || defaultItem.title;
            const description = storeCard?.description || defaultItem.description;
            const bgImage = storeCard?.imageSrc;

            return (
              <Reveal delay={index * 0.05} key={defaultItem.id}>
                <LuxuryCard
                  className="group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-xl border-t-2 border-t-[#D4AF37]/80 border-x border-b border-purple-900/10 bg-white/90 p-7 shadow-[0_16px_50px_rgba(45,34,56,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-t-[#D4AF37] hover:shadow-[0_24px_70px_rgba(212,175,55,0.2)]"
                  style={
                    bgImage
                      ? {
                          backgroundImage: `url(${bgImage})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover"
                        }
                      : undefined
                  }
                >
                  {/* Overlay if background image exists */}
                  {bgImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1424]/95 via-[#1b1424]/75 to-[#1b1424]/45 backdrop-brightness-90 transition-opacity duration-300 group-hover:from-[#1b1424]/98 group-hover:via-[#1b1424]/85" />
                  )}

                  {/* Header / Number Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`font-display text-2xl font-bold tracking-widest transition-colors duration-300 ${
                        bgImage
                          ? "text-[#D4AF37]"
                          : "text-[#D4AF37]/60 group-hover:text-[#D4AF37]"
                      }`}
                    >
                      {defaultItem.number}
                    </span>
                    <span
                      className={`h-0.5 w-6 rounded-full transition-all duration-300 group-hover:w-12 ${
                        bgImage ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50 group-hover:bg-[#D4AF37]"
                      }`}
                    />
                  </div>

                  {/* Content (Title & Description) */}
                  <div className="relative z-10 mt-6 flex flex-1 flex-col justify-end">
                    <h3
                      className={`font-display text-xl font-bold tracking-wide transition-colors duration-300 ${
                        bgImage
                          ? "text-white drop-shadow-md"
                          : "text-[#2D2238] group-hover:text-[#2D2238]"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-3 text-xs leading-6 tracking-wide transition-colors duration-300 ${
                        bgImage ? "text-zinc-200" : "text-[#5c4b6e]"
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </LuxuryCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
