import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { CategoryTabs } from "@/components/showcase/category-tabs";
import { EmptyState } from "@/components/showcase/empty-state";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { PortfolioCard } from "@/components/showcase/portfolio-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { blogPosts } from "@/features/blogs/data/blog-posts";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import { readSearchParam, searchItems } from "@/utils/showcase";

type SearchParams = Record<string, string | string[] | undefined>;

interface BlogPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const description =
  "Read luxury event planning articles about weddings, corporate events, birthdays, decoration, planning, budget, themes, and premium celebration tips.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/blog` },
  description,
  openGraph: {
    description,
    title: "Event Planning Blog | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/blog`
  },
  title: "Event Planning Blog | Shree Velora Event's"
};

/** Renders the SEO-ready blog index. */
export default async function BlogPage({
  searchParams
}: BlogPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const category = readSearchParam(params.category, "All");
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  const filtered = searchItems(blogPosts, query, (post) =>
    [post.title, post.description, post.category, post.author].join(" ")
  ).filter((post) => category === "All" || post.category === category);
  const featured = blogPosts.filter((post) => post.featured);
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/blog", label: "Blog" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Event Planning Blog",
          description,
          "/blog",
          blogPosts.map((post) => post.title)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Blog" }]}
          description={description}
          eyebrow="Planning Journal"
          title="Luxury Event Ideas, Guides, And Planning Tips"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <CategoryTabs
              activeCategory={category}
              basePath="/blog"
              categories={categories}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/blog"
                groups={[]}
                query={query}
                searchPlaceholder="Search articles"
              />
              <div>
                <div className="mb-10">
                  <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                    Featured Articles
                  </h2>
                  <div className="mt-5 grid gap-6 md:grid-cols-2">
                    {featured.map((post) => (
                      <PortfolioCard
                        badge={post.category}
                        description={post.description}
                        fallbackClassName={post.fallbackClassName}
                        href={`/blog/${post.slug}`}
                        imageAlt={post.imageAlt}
                        imageSrc={post.imageSrc}
                        key={post.slug}
                        meta={[post.readingTime, post.author, post.date]}
                        title={post.title}
                      />
                    ))}
                  </div>
                </div>
                {filtered.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((post) => (
                      <PortfolioCard
                        badge={post.category}
                        description={post.description}
                        fallbackClassName={post.fallbackClassName}
                        href={`/blog/${post.slug}`}
                        imageAlt={post.imageAlt}
                        imageSrc={post.imageSrc}
                        key={post.slug}
                        meta={[post.readingTime, post.author, post.date]}
                        title={post.title}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description="Try another category or keyword."
                    title="No articles match your search"
                  />
                )}
                <div className="mt-14 rounded-lg border border-white/70 bg-white/82 p-6">
                  <h2 className="text-xl font-semibold text-[#2D2238]">Newsletter</h2>
                  <p className="mt-2 text-sm leading-7 text-[#5c4b6e]">
                    Subscribe backend will be connected in a later phase. For now,
                    contact the team for seasonal planning ideas.
                  </p>
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
