import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/content/faq-accordion";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { faqs } from "@/features/faq/data/faqs";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd, createFaqJsonLd } from "@/utils/structured-data";

const description =
  "Answers about budget, booking, decoration, photography, venues, advance payment, cancellation, travel, custom themes, and weather backup.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/faq` },
  description,
  openGraph: {
    description,
    title: "FAQ | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/faq`
  },
  title: "FAQ | Shree Velora Event's"
};

/** Renders the public FAQ page. */
export default function FaqPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/faq", label: "FAQ" }
        ])}
      />
      <JsonLd data={createFaqJsonLd(faqs)} />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "FAQ" }]}
          description={description}
          eyebrow="Questions"
          title="Event Planning Questions, Answered Clearly"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container className="max-w-4xl">
            <FaqAccordion items={faqs} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
