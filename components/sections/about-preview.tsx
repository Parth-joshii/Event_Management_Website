import { Crown, Gem, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";

const highlights = [
  {
    description:
      "Personalized concepts, curated timelines, and planning that respects both emotion and precision.",
    icon: Crown,
    title: "Luxury Planning"
  },
  {
    description:
      "Premium floral, fabric, lighting, stage, and ambience details shaped around each occasion.",
    icon: Gem,
    title: "Premium Decor"
  },
  {
    description:
      "A managed execution rhythm across vendors, guests, production, rituals, and last-mile details.",
    icon: Sparkles,
    title: "Flawless Execution"
  }
] as const;

/** Renders the brand introduction and premium highlight cards. */
export function AboutPreview(): React.ReactElement {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#FAF7FF] py-24 sm:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#2D2238] to-transparent opacity-10" />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="About Shree Velora"
            title="Where Every Celebration Becomes A Signature Experience"
            description="Shree Velora Event's is a luxury event planning and decor company specializing in weddings, corporate events, birthdays, private celebrations, religious ceremonies, and institutional functions. We combine creative concepts, premium materials, professional execution, and personalized planning to create unforgettable moments."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal delay={index * 0.08} key={item.title}>
                <LuxuryCard>
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#EBDCFB] text-[#7d5ea1] transition group-hover:bg-[#D4AF37] group-hover:text-[#2D2238]">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-[#2D2238]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                    {item.description}
                  </p>
                </LuxuryCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
