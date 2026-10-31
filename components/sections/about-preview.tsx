"use client";

import * as React from "react";
import { Reveal } from "@/components/animations/reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { useContentStore } from "@/stores/content-store";
import { resolveRenderableImageSrc } from "@/lib/utils";

const defaultHighlights = [
  {
    id: "bespoke-design",
    number: "01",
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    title: "Bespoke Design",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385048/shree_velora/about/diklrziwqbjvwhkm99vt.jpg"
  },
  {
    id: "flawless-execution",
    number: "02",
    description: "Seamless vendor management and attentive on-day coordination.",
    title: "Flawless Execution",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385061/shree_velora/about/ryd7tzoa7dm5amkx6ne5.jpg"
  },
  {
    id: "curated-network",
    number: "03",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    title: "Curated Network",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385074/shree_velora/about/zzryvnbb59enkedgocky.jpg"
  },
  {
    id: "transparent-pricing",
    number: "04",
    description: "Clear line-item quotes and real-time budget management.",
    title: "Transparent Pricing",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385092/shree_velora/about/vx3ensckhdh1xsvit46v.jpg"
  }
];

/** Renders the concise brand introduction and highlight cards with customizable background images, 3D tilt & royal ornamental layout. */
export function AboutPreview(): React.ReactElement {
  const { aboutCards, siteContent, fetchFromDatabase } = useContentStore();

  const about = siteContent?.about || {
    eyebrow: "About Shree Velora",
    title: "Signature Events, Flawlessly Executed",
    description:
      "Shree Velora Event's brings creative direction, luxury decor, and seamless coordination to royal weddings and grand celebrations.",
    cards: defaultHighlights
  };

  // Sync latest cloud and database records on client mount
  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  const cardsToRender = about.cards && about.cards.length > 0 ? about.cards : defaultHighlights;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FAF7FF_0%,#F5EDFF_50%,#FAF7FF_100%)] py-20 sm:py-28"
    >
      {/* Decorative ambient background glows & subtle royal palace motif */}
      {about.backgroundImageUrl ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          <img
            src={resolveRenderableImageSrc(about.backgroundImageUrl)}
            alt="About Background Ambient"
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#2D2238]/10 to-transparent" />
      <div className="pointer-events-none absolute -left-48 top-1/4 size-96 rounded-full bg-[#EBDCFB]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 bottom-1/4 size-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />

      {/* Subtle royal geometric pattern overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2D2238_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <Container className="relative z-10">
        <Reveal>
          <SectionHeading
            eyebrow={about.eyebrow}
            title={about.title}
            description={about.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardsToRender.map((item, index) => {
            const storeCard = aboutCards?.find((c) => c.id === item.id);
            const title = item.title || storeCard?.title;
            const description = item.description || storeCard?.description;
            const rawBg = item.imageSrc || storeCard?.imageSrc || "";
            const renderableBg = rawBg ? resolveRenderableImageSrc(rawBg) : "";

            return (
              <Reveal delay={index * 0.08} key={item.id}>
                <TiltCard maxTilt={8} scale={1.03} glareOpacity={0.25} className="h-full">
                  <LuxuryCard
                    className={`group relative flex h-full min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border-t-2 border-t-[#D4AF37]/80 border-x border-b border-purple-900/10 p-7 shadow-[0_16px_50px_rgba(45,34,56,0.06)] backdrop-blur-md transition-all duration-300 hover:border-t-[#D4AF37] hover:shadow-[0_24px_70px_rgba(212,175,55,0.22)] ${
                      renderableBg ? "bg-[#181020]" : "bg-white/90"
                    }`}
                  >
                    {/* Background Photo & Luxury Dark Gradient Overlay */}
                    {renderableBg && (
                      <>
                        <img
                          src={renderableBg}
                          alt={title || "About Shree Velora Card"}
                          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181020]/95 via-[#181020]/75 to-[#181020]/45 backdrop-brightness-90 transition-opacity duration-300 group-hover:from-[#181020]/98 group-hover:via-[#181020]/85" />
                      </>
                    )}

                    {/* Header / Number Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className={`font-display text-2xl font-bold tracking-widest transition-colors duration-300 ${
                          renderableBg
                            ? "text-[#D4AF37]"
                            : "text-[#D4AF37]/60 group-hover:text-[#D4AF37]"
                        }`}
                      >
                        {item.number}
                      </span>
                      <span
                        className={`h-0.5 w-6 rounded-full transition-all duration-300 group-hover:w-12 ${
                          renderableBg ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50 group-hover:bg-[#D4AF37]"
                        }`}
                      />
                    </div>

                    {/* Content (Title & Description) */}
                    <div className="relative z-10 mt-6 flex flex-1 flex-col justify-end">
                      <h3
                        className={`font-display text-xl font-bold tracking-wide transition-colors duration-300 ${
                          renderableBg
                            ? "text-white drop-shadow-md"
                            : "text-[#2D2238] group-hover:text-[#2D2238]"
                        }`}
                      >
                        {title}
                      </h3>
                      <p
                        className={`mt-3 text-xs leading-6 tracking-wide transition-colors duration-300 ${
                          renderableBg ? "text-zinc-200" : "text-[#5c4b6e]"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </LuxuryCard>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
