"use client";

import { Crown, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { useContentStore } from "@/stores/content-store";

const cardIconsMap: Record<string, typeof Crown> = {
  "bespoke-design": Crown,
  "flawless-execution": Sparkles,
  "curated-network": Handshake,
  "transparent-pricing": ShieldCheck
};

const defaultHighlights = [
  {
    id: "bespoke-design",
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    icon: Crown,
    title: "Bespoke Design"
  },
  {
    id: "flawless-execution",
    description: "Seamless vendor management and attentive on-day coordination.",
    icon: Sparkles,
    title: "Flawless Execution"
  },
  {
    id: "curated-network",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    icon: Handshake,
    title: "Curated Network"
  },
  {
    id: "transparent-pricing",
    description: "Clear line-item quotes and real-time budget management.",
    icon: ShieldCheck,
    title: "Transparent Pricing"
  }
];

/** Renders the concise brand introduction and highlight cards with customizable background images. */
export function AboutPreview(): React.ReactElement {
  const { aboutCards } = useContentStore();

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#FAF7FF] py-12 sm:py-16"
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#2D2238] to-transparent opacity-10" />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="About Shree Velora"
            title="Signature Events, Flawlessly Executed"
            description="Shree Velora Event's brings creative direction, luxury decor, and seamless coordination to royal weddings and grand celebrations."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {defaultHighlights.map((defaultItem, index) => {
            const storeCard = aboutCards?.find((c) => c.id === defaultItem.id);
            const title = storeCard?.title || defaultItem.title;
            const description = storeCard?.description || defaultItem.description;
            const bgImage = storeCard?.imageSrc;
            const Icon = cardIconsMap[defaultItem.id] || Crown;

            return (
              <Reveal delay={index * 0.05} key={defaultItem.id}>
                <LuxuryCard
                  className="group relative flex h-full min-h-[220px] flex-col overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02]"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1424]/90 via-[#1b1424]/70 to-[#1b1424]/40 backdrop-brightness-90 transition-opacity duration-300 group-hover:from-[#1b1424]/95 group-hover:via-[#1b1424]/80" />
                  )}

                  <div className="relative z-10 flex h-full flex-col">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full transition duration-300 ${
                        bgImage
                          ? "bg-[#D4AF37] text-[#2D2238] group-hover:scale-110"
                          : "bg-[#EBDCFB] text-[#7d5ea1] group-hover:bg-[#D4AF37] group-hover:text-[#2D2238]"
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </div>
                    <h3
                      className={`mt-4 text-base font-bold transition duration-300 ${
                        bgImage ? "text-white drop-shadow-sm" : "text-[#2D2238]"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-2 flex-1 text-xs leading-5 transition duration-300 ${
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

