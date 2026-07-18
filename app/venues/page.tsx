import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/showcase/empty-state";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { InfiniteLoader } from "@/components/showcase/infinite-loader";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { VenueCard } from "@/components/showcase/venue-card";
import { venueShowcase } from "@/features/venues/data/venues";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import { paginateItems, readSearchParam, searchItems } from "@/utils/showcase";

type SearchParams = Record<string, string | string[] | undefined>;

interface VenuesPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const venuesDescription =
  "Explore premium venues for luxury weddings, corporate events, destination celebrations, banquets, gardens, resorts, palaces, and outdoor functions.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: `${siteConfig.url}/venues` },
    description: venuesDescription,
    keywords: [...siteConfig.keywords, "luxury venues", "wedding venue"],
    openGraph: {
      description: venuesDescription,
      title: "Venue Showcase | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/venues`
    },
    title: "Venue Showcase | Shree Velora Event's"
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
  return `/venues?${nextParams.toString()}`;
}

/** Renders the premium venue explorer page. */
export default async function VenuesPage({
  searchParams
}: VenuesPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const location = readSearchParam(params.location);
  const venueType = readSearchParam(params.type);
  const facility = readSearchParam(params.facility);
  const capacity = Number(readSearchParam(params.capacity, "0"));
  const page = Number(readSearchParam(params.page, "1"));

  const searched = searchItems(venueShowcase, query, (venue) =>
    [
      venue.title,
      venue.location,
      venue.venueType,
      venue.facilities.join(" "),
      venue.amenities.join(" "),
      venue.recommendedThemes.join(" ")
    ].join(" ")
  );
  const filtered = searched.filter(
    (venue) =>
      (!location || venue.location === location) &&
      (!venueType || venue.venueType === venueType) &&
      (!facility || (venue.facilities as readonly string[]).includes(facility)) &&
      (!capacity || venue.capacity >= capacity)
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
          { href: "/venues", label: "Venues" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Venue Showcase",
          venuesDescription,
          "/venues",
          venueShowcase.map((venue) => venue.title)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Venues" }]}
          description={venuesDescription}
          eyebrow="Venue Explorer"
          title="Premium Venues Matched To Your Event Vision"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/venues"
                groups={[
                  {
                    label: "Location",
                    name: "location",
                    options: [...new Set(venueShowcase.map((venue) => venue.location))],
                    value: location
                  },
                  {
                    label: "Venue Type",
                    name: "type",
                    options: [
                      ...new Set(venueShowcase.map((venue) => venue.venueType))
                    ],
                    value: venueType
                  },
                  {
                    label: "Facilities",
                    name: "facility",
                    options: [
                      ...new Set(venueShowcase.flatMap((venue) => venue.facilities))
                    ],
                    value: facility
                  },
                  {
                    label: "Minimum Capacity",
                    name: "capacity",
                    options: ["100", "250", "500", "750"],
                    value: capacity ? String(capacity) : ""
                  }
                ]}
                query={query}
                searchPlaceholder="Search venues"
              />
              <div>
                {pagination.items.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {pagination.items.map((venue) => (
                      <VenueCard key={venue.slug} venue={venue} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description="Try a different city, venue type, facility, capacity, or search term."
                    title="No venues match these filters"
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
