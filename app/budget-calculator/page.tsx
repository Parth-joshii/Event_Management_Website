import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { BudgetCalculator } from "@/components/lead/budget-calculator";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd } from "@/utils/structured-data";

const description =
  "Estimate your event budget live by selecting event type, guest count, decoration, photography, food, entertainment, lighting, SFX, and luxury entry options.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/budget-calculator` },
  description,
  openGraph: {
    description,
    title: "Budget Calculator | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/budget-calculator`
  },
  title: "Budget Calculator | Shree Velora Event's"
};

/** Renders the public live budget calculator page. */
export default function BudgetCalculatorPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/budget-calculator", label: "Budget Calculator" }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Budget Calculator" }]}
          description={description}
          eyebrow="Budget Estimator"
          title="Plan A Realistic Luxury Event Budget"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <BudgetCalculator />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
