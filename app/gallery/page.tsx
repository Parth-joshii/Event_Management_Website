import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { CategoryTabs } from "@/components/showcase/category-tabs";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { GalleryGrid } from "@/components/showcase/gallery-grid";
import { InfiniteLoader } from "@/components/showcase/infinite-loader";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { galleryCategories, galleryItems } from "@/features/gallery/data/gallery-items";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd,
  createImageGalleryJsonLd
} from "@/utils/structured-data";
import { paginateItems, readSearchParam, searchItems } from "@/utils/showcase";
import type { GalleryImageItem, GallerySortOption } from "@/types/gallery";

type SearchParams = Record<string, string | string[] | undefined>;

interface GalleryPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const galleryDescription =
  "Browse a luxury Pinterest-style gallery of weddings, Haldi, Mehndi, Sangeet, receptions, corporate events, birthdays, religious ceremonies, lighting, flowers, drone moments, and premium decoration.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: `${siteConfig.url}/gallery`
    },
    description: galleryDescription,
    keywords: [...siteConfig.keywords, "luxury event gallery", "wedding gallery"],
    openGraph: {
      description: galleryDescription,
      title: "Luxury Event Gallery | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/gallery`
    },
    title: "Luxury Event Gallery | Shree Velora Event's",
    twitter: {
      card: "summary_large_image",
      description: galleryDescription,
      title: "Luxury Event Gallery | Shree Velora Event's"
    }
  };
}

function sortGalleryItems(
  items: readonly GalleryImageItem[],
  sort: string
): readonly GalleryImageItem[] {
  const normalizedSort = sort as GallerySortOption;

  if (normalizedSort === "newest") {
    return [...items].sort((a, b) => b.year - a.year);
  }

  if (["popular", "trending", "luxury"].includes(normalizedSort)) {
    return [...items].sort((a, b) => b.popularity - a.popularity);
  }

  return [...items].filter((item) => item.tags.includes(normalizedSort));
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
  return `/gallery?${nextParams.toString()}`;
}

/** Renders the Phase 3 luxury gallery page. */
export default async function GalleryPage({
  searchParams
}: GalleryPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const category = readSearchParam(params.category, "All");
  const location = readSearchParam(params.location);
  const budget = readSearchParam(params.budget);
  const theme = readSearchParam(params.theme);
  const season = readSearchParam(params.season);
  const sort = readSearchParam(params.sort, "newest");
  const page = Number(readSearchParam(params.page, "1"));

  const searched = searchItems(galleryItems, query, (item) =>
    [
      item.eventName,
      item.location,
      item.category,
      item.theme,
      item.photographer,
      item.description
    ].join(" ")
  );
  const filtered = searched.filter((item) => {
    return (
      (category === "All" || item.category === category) &&
      (!location || item.location === location) &&
      (!budget || item.budget === budget) &&
      (!theme || item.theme === theme) &&
      (!season || item.season === season)
    );
  });
  const sorted = sortGalleryItems(filtered, sort);
  const pagination = paginateItems(sorted, page, 9);
  const nextHref =
    pagination.page < pagination.pageCount
      ? createNextHref(params, pagination.page + 1)
      : undefined;

  const locations = [...new Set(galleryItems.map((item) => item.location))];
  const budgets = [...new Set(galleryItems.map((item) => item.budget))];
  const themes = [...new Set(galleryItems.map((item) => item.theme))];
  const seasons = [...new Set(galleryItems.map((item) => item.season))];
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/gallery", label: "Gallery" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Luxury Event Gallery",
          galleryDescription,
          "/gallery",
          galleryItems.map((item) => item.caption)
        )}
      />
      <JsonLd data={createImageGalleryJsonLd(galleryItems)} />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Gallery" }]}
          description={galleryDescription}
          eyebrow="Luxury Gallery"
          title="A Portfolio Of Cinematic Celebrations"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <CategoryTabs
              activeCategory={category}
              basePath="/gallery"
              categories={galleryCategories}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/gallery"
                groups={[
                  {
                    label: "Location",
                    name: "location",
                    options: locations,
                    value: location
                  },
                  { label: "Budget", name: "budget", options: budgets, value: budget },
                  { label: "Theme", name: "theme", options: themes, value: theme },
                  { label: "Season", name: "season", options: seasons, value: season }
                ]}
                query={query}
                searchPlaceholder="Search gallery"
                sortOptions={[
                  "Newest",
                  "Popular",
                  "Trending",
                  "Luxury",
                  "Traditional",
                  "Modern"
                ]}
                sortValue={sort}
              />
              <div>
                <p className="mb-5 text-sm font-medium text-[#5c4b6e]">
                  Showing {pagination.items.length} of {pagination.total} curated
                  gallery moments
                </p>
                <GalleryGrid items={pagination.items} />
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
