import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { CategoryTabs } from "@/components/showcase/category-tabs";
import { EmptyState } from "@/components/showcase/empty-state";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { InfiniteLoader } from "@/components/showcase/infinite-loader";
import { PortfolioCard } from "@/components/showcase/portfolio-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { portfolioEvents } from "@/features/events/data/events";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import { paginateItems, readSearchParam, searchItems } from "@/utils/showcase";

type SearchParams = Record<string, string | string[] | undefined>;

interface EventsPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const eventsDescription =
  "Explore previous luxury weddings, corporate events, destination weddings, birthdays, religious ceremonies, and private celebrations planned by Shree Velora Event's.";

const eventCategories = [
  "Luxury Weddings",
  "Corporate",
  "Birthday",
  "Private",
  "College",
  "Religious",
  "Destination Wedding"
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: `${siteConfig.url}/events` },
    description: eventsDescription,
    keywords: [...siteConfig.keywords, "previous events", "event portfolio"],
    openGraph: {
      description: eventsDescription,
      title: "Previous Events | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/events`
    },
    title: "Previous Events | Shree Velora Event's"
  };
}

function createNextHref(params: SearchParams, nextPage: number): string {
  const nextParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const safeValue = Array.isArray(value) ? value[0] : value;
    if (safeValue && key !== "page") {
      nextParams.set(key, safeValue);
    }
  });
  nextParams.set("page", String(nextPage));
  return `/events?${nextParams.toString()}`;
}

/** Renders the previous events portfolio page. */
export default async function EventsPage({
  searchParams
}: EventsPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const category = readSearchParam(params.category, "All");
  const location = readSearchParam(params.location);
  const budget = readSearchParam(params.budget);
  const page = Number(readSearchParam(params.page, "1"));

  const searched = searchItems(portfolioEvents, query, (event) =>
    [
      event.title,
      event.clientName,
      event.location,
      event.category,
      event.theme,
      event.servicesUsed.join(" ")
    ].join(" ")
  );
  const filtered = searched.filter(
    (event) =>
      (category === "All" || event.category === category) &&
      (!location || event.location === location) &&
      (!budget || event.budgetRange === budget)
  );
  const pagination = paginateItems(filtered, page, 6);
  const nextHref =
    pagination.page < pagination.pageCount
      ? createNextHref(params, pagination.page + 1)
      : undefined;
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/events", label: "Previous Events" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Previous Events",
          eventsDescription,
          "/events",
          portfolioEvents.map((event) => event.title)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Previous Events" }]}
          description={eventsDescription}
          eyebrow="Portfolio Stories"
          title="Previous Events With Proven Luxury Execution"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <CategoryTabs
              activeCategory={category}
              basePath="/events"
              categories={eventCategories}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/events"
                groups={[
                  {
                    label: "Location",
                    name: "location",
                    options: [
                      ...new Set(portfolioEvents.map((event) => event.location))
                    ],
                    value: location
                  },
                  {
                    label: "Budget Range",
                    name: "budget",
                    options: [
                      ...new Set(portfolioEvents.map((event) => event.budgetRange))
                    ],
                    value: budget
                  }
                ]}
                query={query}
                searchPlaceholder="Search previous events"
              />
              <div>
                {pagination.items.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {pagination.items.map((event) => (
                      <PortfolioCard
                        badge={event.category}
                        description={`${event.clientName} - ${event.location} - ${event.guestCount} guests - ${event.duration}`}
                        fallbackClassName={event.fallbackClassName}
                        href={`/events/${event.slug}`}
                        imageAlt={event.heroImageAlt}
                        imageSrc={event.heroImage}
                        key={event.slug}
                        meta={[event.budgetRange, event.theme, event.year.toString()]}
                        title={event.title}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description="Try a different location, category, budget range, or search term."
                    title="No previous events match these filters"
                  />
                )}
                <InfiniteLoader href={nextHref} />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
