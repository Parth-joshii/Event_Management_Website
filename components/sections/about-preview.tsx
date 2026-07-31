import { Crown, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxuryCard } from "@/components/ui/luxury-card";

const highlights = [
  {
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    icon: Crown,
    title: "Bespoke Design"
  },
  {
    description: "Seamless vendor management and attentive on-day coordination.",
    icon: Sparkles,
    title: "Flawless Execution"
  },
  {
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    icon: Handshake,
    title: "Curated Network"
  },
  {
    description: "Clear line-item quotes and real-time budget management.",
    icon: ShieldCheck,
    title: "Transparent Pricing"
  }
] as const;

/** Renders the concise brand introduction and highlight cards. */
export function AboutPreview(): React.ReactElement {
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
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal delay={index * 0.05} key={item.title}>
                <LuxuryCard className="flex h-full flex-col p-5">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#EBDCFB] text-[#7d5ea1] transition group-hover:bg-[#D4AF37] group-hover:text-[#2D2238]">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#2D2238]">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-[#5c4b6e]">
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
