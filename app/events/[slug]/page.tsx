import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { PortfolioCard } from "@/components/showcase/portfolio-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { StoryTimeline } from "@/components/showcase/story-timeline";
import { VideoPlayer } from "@/components/showcase/video-player";
import { portfolioEvents } from "@/features/events/data/events";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd, createEventJsonLd } from "@/utils/structured-data";

interface EventDetailPageProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export function generateStaticParams(): { slug: string }[] {
  return portfolioEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = portfolioEvents.find((item) => item.slug === slug);

  if (!event) {
    return {
      title: "Event Story Not Found | Shree Velora Event's"
    };
  }

  const description = `${event.title} in ${event.location}: ${event.theme}, ${event.guestCount} guests, ${event.duration}, and services including ${event.servicesUsed.join(", ")}.`;

  return {
    alternates: { canonical: `${siteConfig.url}/events/${event.slug}` },
    description,
    openGraph: {
      description,
      title: `${event.title} | Shree Velora Event's`,
      type: "article",
      url: `${siteConfig.url}/events/${event.slug}`
    },
    title: `${event.title} | Shree Velora Event's`
  };
}

/** Renders a dynamic event portfolio story page. */
export default async function EventDetailPage({
  params
}: EventDetailPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const event =
    portfolioEvents.find((item) => item.slug === slug) ?? portfolioEvents[0];
  const relatedEvents = portfolioEvents
    .filter((item) => item.slug !== event.slug)
    .slice(0, 2);
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    `Hi Shree Velora Event's, I want to plan an event like ${event.title}.`
  )}`;

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/events", label: "Previous Events" },
          { href: `/events/${event.slug}`, label: event.title }
        ])}
      />
      <JsonLd
        data={createEventJsonLd({
          description: event.clientStory,
          image: event.heroImage,
          location: event.location,
          name: event.title,
          url: `/events/${event.slug}`
        })}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[
            { href: "/events", label: "Previous Events" },
            { label: event.title }
          ]}
          description={event.clientStory}
          eyebrow={event.category}
          title={event.title}
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
              <div className="grid gap-10">
                <ResponsiveImage
                  alt={event.heroImageAlt}
                  className="h-[30rem] rounded-lg"
                  fallbackClassName={event.fallbackClassName}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  src={event.heroImage}
                  title={event.title}
                />
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    ["Client", event.clientName],
                    ["Location", event.location],
                    ["Budget", event.budgetRange],
                    ["Guests", `${event.guestCount}`]
                  ].map(([label, value]) => (
                    <div className="rounded-lg bg-white p-5 shadow-sm" key={label}>
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#8b789c] uppercase">
                        {label}
                      </p>
                      <p className="mt-2 font-semibold text-[#2D2238]">{value}</p>
                    </div>
                  ))}
                </div>
                <VideoPlayer
                  description={`Event highlight video for ${event.title}.`}
                  fallbackClassName={event.fallbackClassName}
                  posterSrc={event.heroImage}
                  title={`${event.title} Highlight`}
                  videoSrc={event.videoSrc}
                />
                <StoryTimeline steps={event.timeline} />
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    ["Venue", event.venue],
                    ["Decoration Theme", event.decorationTheme],
                    ["Lighting", event.lighting],
                    ["Photography", event.photography],
                    ["Food", event.food],
                    ["Entertainment", event.entertainment],
                    ["Challenges", event.challenges.join("; ")],
                    ["Solutions", event.solutions.join("; ")],
                    ["Final Result", event.finalResult],
                    ["Client Review", event.clientReview]
                  ].map(([label, value]) => (
                    <article
                      className="rounded-lg border border-white/70 bg-white/80 p-6 shadow-sm"
                      key={label}
                    >
                      <h2 className="text-lg font-semibold text-[#2D2238]">{label}</h2>
                      <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">{value}</p>
                    </article>
                  ))}
                </div>
                <div>
                  <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                    Related Events
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {relatedEvents.map((related) => (
                      <PortfolioCard
                        badge={related.category}
                        description={`${related.location} - ${related.theme}`}
                        fallbackClassName={related.fallbackClassName}
                        href={`/events/${related.slug}`}
                        imageAlt={related.heroImageAlt}
                        imageSrc={related.heroImage}
                        key={related.slug}
                        meta={[related.budgetRange, `${related.guestCount} guests`]}
                        title={related.title}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-lg border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
                  <h2 className="text-xl font-semibold text-[#2D2238]">
                    Book Similar Event
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                    Share your preferred theme, guest count, city, and budget. We will
                    create a comparable plan with custom details.
                  </p>
                  <div className="mt-6 grid gap-3">
                    <GradientButton asChild>
                      <Link href="/#contact">
                        <Phone aria-hidden="true" className="size-4" />
                        Book Consultation
                      </Link>
                    </GradientButton>
                    <GradientButton asChild tone="light">
                      <a href={whatsappHref} rel="noreferrer" target="_blank">
                        <MessageCircle aria-hidden="true" className="size-4" />
                        WhatsApp
                      </a>
                    </GradientButton>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
