import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { CategoryTabs } from "@/components/showcase/category-tabs";
import { EmptyState } from "@/components/showcase/empty-state";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { InfiniteLoader } from "@/components/showcase/infinite-loader";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { ThemeCard } from "@/components/showcase/theme-card";
import { eventThemes } from "@/features/themes/data/themes";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import { recommendThemes } from "@/utils/theme-recommendations";
import { paginateItems, readSearchParam, searchItems } from "@/utils/showcase";

type SearchParams = Record<string, string | string[] | undefined>;

interface ThemesPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const themesDescription =
  "Explore luxury event themes including Royal Palace, Traditional, Modern Luxury, White Floral, Haldi, Mehndi, Garden Wedding, Pastel, Vintage, and destination concepts.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: `${siteConfig.url}/themes` },
    description: themesDescription,
    keywords: [...siteConfig.keywords, "wedding themes", "luxury decor themes"],
    openGraph: {
      description: themesDescription,
      title: "Luxury Event Themes | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/themes`
    },
    title: "Luxury Event Themes | Shree Velora Event's"
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
  return `/themes?${nextParams.toString()}`;
}

/** Renders the luxury theme collections page. */
export default async function ThemesPage({
  searchParams
}: ThemesPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const category = readSearchParam(params.category, "All");
  const budget = readSearchParam(params.budget);
  const likedTheme = readSearchParam(params.liked, "royal-palace");
  const page = Number(readSearchParam(params.page, "1"));

  const searched = searchItems(eventThemes, query, (theme) =>
    [
      theme.title,
      theme.category,
      theme.description,
      theme.flowersUsed.join(" "),
      theme.lightingUsed.join(" ")
    ].join(" ")
  );
  const filtered = searched.filter(
    (theme) =>
      (category === "All" || theme.category === category) &&
      (!budget || theme.recommendedBudget === budget)
  );
  const pagination = paginateItems(filtered, page, 6);
  const nextHref =
    pagination.page < pagination.pageCount
      ? createNextHref(params, pagination.page + 1)
      : undefined;
  const categories = [...new Set(eventThemes.map((theme) => theme.category))];
  const budgets = [...new Set(eventThemes.map((theme) => theme.recommendedBudget))];
  const recommendations = recommendThemes(likedTheme);
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/themes", label: "Themes" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Luxury Event Themes",
          themesDescription,
          "/themes",
          eventThemes.map((theme) => theme.title)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Themes" }]}
          description={themesDescription}
          eyebrow="Theme Collections"
          title="Luxury Decor Concepts For Signature Celebrations"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <CategoryTabs
              activeCategory={category}
              basePath="/themes"
              categories={categories}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/themes"
                groups={[
                  {
                    label: "Recommended Budget",
                    name: "budget",
                    options: budgets,
                    value: budget
                  }
                ]}
                query={query}
                searchPlaceholder="Search themes"
              />
              <div>
                {pagination.items.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pagination.items.map((theme) => (
                      <ThemeCard key={theme.slug} theme={theme} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description="Try another theme category, budget, or search term."
                    title="No themes match these filters"
                  />
                )}
                <InfiniteLoader href={nextHref} />
                <div className="mt-14 rounded-lg border border-white/70 bg-white/78 p-6 shadow-sm">
                  <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                    AI Theme Recommendation Ready
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
                    Static recommendation logic is prepared now. Future AI will replace
                    the curated relationship map without changing the UI.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {recommendations.map((theme) => (
                      <a
                        className="rounded-lg bg-[#FAF7FF] p-4 text-sm font-semibold text-[#2D2238] transition hover:bg-[#EBDCFB]"
                        href={`/themes?liked=${theme.slug}`}
                        key={theme.slug}
                      >
                        {theme.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
