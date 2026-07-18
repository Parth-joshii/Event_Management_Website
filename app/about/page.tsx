import type { Metadata } from "next";
import { Award, Compass, Gem, HeartHandshake, Sparkles, Target } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { StoryTimeline } from "@/components/showcase/story-timeline";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd } from "@/utils/structured-data";

const description =
  "Learn about Shree Velora Event's: company story, mission, vision, core values, founder message, achievements, process, and future vision for luxury event planning.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/about` },
  description,
  openGraph: {
    description,
    title: "About | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/about`
  },
  title: "About | Shree Velora Event's"
};

const values = [
  [
    "Luxury Detail",
    "Premium finish across decor, planning, and guest experience.",
    Gem
  ],
  [
    "Calm Execution",
    "Disciplined timelines, vendor control, and on-ground leadership.",
    Target
  ],
  [
    "Client Trust",
    "Transparent planning and thoughtful communication at every step.",
    HeartHandshake
  ],
  [
    "Creative Vision",
    "Concepts designed around emotion, venue, culture, and brand.",
    Sparkles
  ]
] as const;

/** Renders the complete company about page. */
export default function AboutPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/about", label: "About" }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "About" }]}
          description={description}
          eyebrow="About The Brand"
          title="A Luxury Event Company Built For Signature Celebrations"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow="Company Story"
                  title="From Planning Details To Celebration Memories"
                  description="Shree Velora Event's blends premium decor, structured planning, vendor coordination, and cinematic execution for weddings, corporate events, birthdays, religious ceremonies, school functions, and private celebrations."
                />
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2">
                {values.map(([title, text, Icon]) => (
                  <LuxuryCard key={title}>
                    <Icon aria-hidden="true" className="size-7 text-[#D4AF37]" />
                    <h2 className="mt-5 text-xl font-semibold text-[#2D2238]">
                      {title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">{text}</p>
                  </LuxuryCard>
                ))}
              </div>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <LuxuryCard>
                <Compass aria-hidden="true" className="size-7 text-[#D4AF37]" />
                <h2 className="mt-5 text-xl font-semibold text-[#2D2238]">Mission</h2>
                <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                  To make every occasion feel premium, organized, emotional, and
                  effortless for the host.
                </p>
              </LuxuryCard>
              <LuxuryCard>
                <Award aria-hidden="true" className="size-7 text-[#D4AF37]" />
                <h2 className="mt-5 text-xl font-semibold text-[#2D2238]">Vision</h2>
                <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                  To become a trusted luxury event partner for families, brands,
                  institutions, and destination celebrations.
                </p>
              </LuxuryCard>
              <LuxuryCard>
                <HeartHandshake aria-hidden="true" className="size-7 text-[#D4AF37]" />
                <h2 className="mt-5 text-xl font-semibold text-[#2D2238]">
                  Founder Message
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                  Great events are remembered because they feel personal. Our work is to
                  protect that feeling through planning and detail.
                </p>
              </LuxuryCard>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <SectionHeading
                align="left"
                eyebrow="Our Process"
                title="Structured Enough To Be Reliable, Creative Enough To Feel Rare"
                description="Every project follows a calm rhythm from discovery to final memories."
              />
              <StoryTimeline
                steps={[
                  {
                    description:
                      "Discovery, event type, city, budget, and guest experience.",
                    label: "Consult"
                  },
                  {
                    description:
                      "Theme, mood board, vendor map, and quotation direction.",
                    label: "Design"
                  },
                  {
                    description:
                      "Production, logistics, schedule, and vendor confirmation.",
                    label: "Prepare"
                  },
                  {
                    description:
                      "Event-day coordination, hospitality, and memory capture.",
                    label: "Execute"
                  }
                ]}
              />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
