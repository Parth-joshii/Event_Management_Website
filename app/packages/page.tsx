import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { ComparisonTable } from "@/components/showcase/comparison-table";
import { EmptyState } from "@/components/showcase/empty-state";
import { FilterSidebar } from "@/components/showcase/filter-sidebar";
import { PackageCard } from "@/components/showcase/package-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { GradientButton } from "@/components/ui/gradient-button";
import { eventPackages } from "@/features/packages/data/packages";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import {
  createBreadcrumbJsonLd,
  createCollectionJsonLd
} from "@/utils/structured-data";
import { readSearchParam, searchItems } from "@/utils/showcase";

type SearchParams = Record<string, string | string[] | undefined>;

interface PackagesPageProps {
  readonly searchParams?: Promise<SearchParams>;
}

const packagesDescription =
  "Compare Silver, Gold, Diamond, Royal, and Platinum event packages for decor, photography, lighting, food, anchors, DJ, LED, fireworks, band, vintage car, and Ghodi services.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: `${siteConfig.url}/packages` },
    description: packagesDescription,
    keywords: [...siteConfig.keywords, "event packages", "wedding packages"],
    openGraph: {
      description: packagesDescription,
      title: "Event Packages | Shree Velora Event's",
      type: "website",
      url: `${siteConfig.url}/packages`
    },
    title: "Event Packages | Shree Velora Event's"
  };
}

/** Renders event packages and the comparison table. */
export default async function PackagesPage({
  searchParams
}: PackagesPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const query = readSearchParam(params.q);
  const service = readSearchParam(params.service);
  const searched = searchItems(eventPackages, query, (eventPackage) =>
    [
      eventPackage.name,
      eventPackage.price,
      eventPackage.description,
      eventPackage.includedServices.join(" "),
      eventPackage.recommendedFor
    ].join(" ")
  );
  const filtered = searched.filter((eventPackage) => {
    if (!service) {
      return true;
    }
    const serviceKey = service as keyof typeof eventPackage.services;
    return Boolean(eventPackage.services[serviceKey]);
  });
  const serviceOptions = Object.keys(eventPackages[0]?.services ?? {});
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/packages", label: "Packages" }
        ])}
      />
      <JsonLd
        data={createCollectionJsonLd(
          "Event Packages",
          packagesDescription,
          "/packages",
          eventPackages.map((eventPackage) => eventPackage.name)
        )}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Packages" }]}
          description={packagesDescription}
          eyebrow="Event Packages"
          title="Premium Packages For Every Scale Of Celebration"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
              <FilterSidebar
                action="/packages"
                groups={[
                  {
                    label: "Included Service",
                    name: "service",
                    options: serviceOptions,
                    value: service
                  }
                ]}
                query={query}
                searchPlaceholder="Search packages"
              />
              <div>
                {filtered.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((eventPackage) => (
                      <PackageCard
                        eventPackage={eventPackage}
                        key={eventPackage.name}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description="Try another service, tier, or package search term."
                    title="No packages match these filters"
                  />
                )}
                <div className="mt-14">
                  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                      <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                        Package Comparison
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c4b6e]">
                        Compare inclusions across event tiers. The PDF generation action
                        is prepared for backend integration.
                      </p>
                    </div>
                    <GradientButton asChild tone="light">
                      <a href="#contact">
                        <FileText aria-hidden="true" className="size-4" />
                        Generate PDF
                      </a>
                    </GradientButton>
                  </div>
                  <ComparisonTable packages={eventPackages} />
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
