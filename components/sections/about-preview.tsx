import { Crown, Gem, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";

const highlights = [
  {
    description:
      "Every detail is thoughtfully composed around your story, personal style, and the experience you wish to create.",
    icon: Crown,
    title: "Bespoke Planning"
  },
  {
    description:
      "Layered florals, refined textures, atmospheric lighting, and statement installations create a world entirely your own.",
    icon: Gem,
    title: "Artful Event Design"
  },
  {
    description:
      "Discreet coordination and exacting attention ensure every transition feels effortless from arrival to farewell.",
    icon: Sparkles,
    title: "Impeccable Execution"
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
            title="Where Your Vision Becomes A Signature Experience"
            description="Shree Velora Event's curates distinguished weddings, corporate occasions, private celebrations, and cultural ceremonies. Creative direction, refined materials, trusted partners, and attentive planning come together to create moments of lasting beauty."
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
