import type { Metadata } from "next";
import { BadgeCheck, Building2, Trophy } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { PortfolioCard } from "@/components/showcase/portfolio-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { StoryTimeline } from "@/components/showcase/story-timeline";
import { VideoPlayer } from "@/components/showcase/video-player";
import {
  clientSuccessStories,
  portfolioHighlights,
  portfolioMetrics,
  portfolioVideos
} from "@/features/portfolio/data/portfolio";
import { testimonials } from "@/features/testimonials/data/testimonials";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import type { LucideIcon } from "lucide-react";

const portfolioProofPoints: readonly {
  readonly description: string;
  readonly icon: LucideIcon;
  readonly title: string;
}[] = [
  {
    description: "Premium decor excellence and production discipline.",
    icon: Trophy,
    title: "Awards"
  },
  {
    description: "Luxury weddings, corporate projects, and destination weddings.",
    icon: Building2,
    title: "Projects"
  },
  {
    description:
      "Google-style reviews, Instagram-style praise, and client video stories.",
    icon: BadgeCheck,
    title: "Verified Trust"
  }
];

const portfolioDescription =
  "Discover the Shree Velora Event's company portfolio: journey, awards, projects, happy clients, luxury weddings, corporate productions, destination weddings, client videos, behind the scenes, and drone stories.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: `${siteConfig.url}/portfolio` },
    description: portfolioDescription,
    keywords: [
      ...siteConfig.keywords,
      "event company portfolio",
      "luxury wedding portfolio"
    ],
    openGraph: {
      description: portfolioDescription,
      title: "Company Portfolio | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/portfolio`
    },
    title: "Company Portfolio | Shree Velora Event's"
  };
}

/** Renders the premium company portfolio page. */
export default function PortfolioPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const story = clientSuccessStories[0];

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/portfolio", label: "Portfolio" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Company Portfolio",
          portfolioDescription,
          "/portfolio",
          portfolioHighlights.map((item) => item.title)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Portfolio" }]}
          description={portfolioDescription}
          eyebrow="Company Portfolio"
          title="A Luxury Brand Portfolio Built On Trust"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {portfolioMetrics.map((metric) => (
                <Reveal key={metric.label}>
                  <article className="rounded-lg border border-white/70 bg-white p-6 text-center shadow-sm">
                    <p className="font-display text-4xl font-semibold text-[#D4AF37]">
                      <AnimatedCounter suffix={metric.suffix} value={metric.value} />
                    </p>
                    <p className="mt-3 text-sm font-medium text-[#5c4b6e]">
                      {metric.label}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {portfolioHighlights.map((item) => (
                <PortfolioCard
                  description={item.description}
                  fallbackClassName={item.fallbackClassName}
                  imageAlt={item.title}
                  imageSrc={item.imageSrc}
                  key={item.title}
                  title={item.title}
                />
              ))}
            </div>
          </Container>
        </section>
        <section className="bg-[#EBDCFB] py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Awards & Coverage"
              title="Recognition, Media, And Client Confidence"
              description="A portfolio section prepared for awards, media coverage, company logos, client videos, and public proof points."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {portfolioProofPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <LuxuryCard key={item.title}>
                    <Icon aria-hidden="true" className="size-7 text-[#D4AF37]" />
                    <h3 className="mt-5 text-xl font-semibold text-[#2D2238]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                      {item.description}
                    </p>
                  </LuxuryCard>
                );
              })}
            </div>
          </Container>
        </section>
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Video Showcase"
              title="Highlights, Reels, Drone Films, And BTS"
              description="Video gallery architecture is ready for CDN thumbnails, fullscreen, picture-in-picture, mute, share, and quality selection."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {portfolioVideos.map((video) => (
                <VideoPlayer
                  description={video.description}
                  fallbackClassName={video.fallbackClassName}
                  key={video.title}
                  posterSrc={video.posterSrc}
                  title={video.title}
                  videoSrc={video.videoSrc}
                />
              ))}
            </div>
          </Container>
        </section>
        <section className="bg-[#2D2238] py-16 text-white sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Testimonial Wall"
              title="Verified Celebration Reviews"
              description="Photo reviews, video reviews, Google-style cards, Instagram-style cards, ratings, and company logos can all plug into this wall."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  className="rounded-lg border border-white/12 bg-white/10 p-6 backdrop-blur"
                  key={testimonial.name}
                >
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Verified 5 Star Review
                  </p>
                  <p className="mt-5 text-sm leading-7 text-white/74">
                    "{testimonial.review}"
                  </p>
                  <p className="mt-6 font-semibold">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-white/50">{testimonial.event}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
        {story ? (
          <section className="bg-[#FAF7FF] py-16 sm:py-20">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                    Client Success Story
                  </p>
                  <h2 className="font-display mt-4 text-4xl font-semibold text-[#2D2238]">
                    {story.title}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-[#5c4b6e]">
                    Budget: {story.budget}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                    {story.guestExperience}
                  </p>
                </div>
                <StoryTimeline steps={story.steps} />
              </div>
            </Container>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
