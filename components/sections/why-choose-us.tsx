import {
  BadgeCheck,
  Clock3,
  Handshake,
  Palette,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const reasons = [
  {
    description:
      "Every concept is shaped around the occasion, guest experience, venue, and personal style.",
    icon: Palette,
    title: "Customized Event Concepts"
  },
  {
    description:
      "Lavish themes, floral installations, lighting moods, and stage styling with premium finish.",
    icon: BadgeCheck,
    title: "Premium Decoration Themes"
  },
  {
    description:
      "A curated network for decor, sound, lighting, photography, anchors, artists, and logistics.",
    icon: Handshake,
    title: "Professional Vendor Network"
  },
  {
    description:
      "Planning, production, coordination, guest flow, vendor management, and event-day control.",
    icon: Workflow,
    title: "End-to-End Management"
  },
  {
    description:
      "Clear planning conversations, defined inclusions, and budget-aware recommendations.",
    icon: ShieldCheck,
    title: "Transparent Planning"
  },
  {
    description:
      "Disciplined timelines and on-ground supervision that protect the celebration experience.",
    icon: Clock3,
    title: "On-Time Execution"
  }
] as const;

/** Renders the reasons-to-believe grid. */
export function WhyChooseUs(): React.ReactElement {
  return (
    <section
      id="why-choose-us"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#EBDCFB_100%)] py-24 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="The Velora Standard"
            title="The Art Of Celebrating, Masterfully Managed"
            description="Remarkable occasions are shaped by discernment, discipline, and care. Our team brings creative vision and calm command to every detail, allowing you to remain fully present."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <Reveal delay={index * 0.06} key={reason.title}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#7d5ea1] shadow-sm">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2D2238]">
                        {reason.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
