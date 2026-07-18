import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { LegalPageContent } from "@/components/content/legal-page";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { legalPages } from "@/features/legal/data/legal-pages";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd } from "@/utils/structured-data";

const page = legalPages["terms-and-conditions"];

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/terms-and-conditions` },
  description:
    "Terms and conditions for public event inquiries, quotations, scope, and planning with Shree Velora Event's.",
  title: "Terms & Conditions | Shree Velora Event's"
};

/** Renders the terms and conditions page. */
export default function TermsPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/terms-and-conditions", label: page.title }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: page.title }]}
          description="Public website terms and event planning agreement guidance."
          eyebrow="Legal"
          title={page.title}
        />
        <LegalPageContent {...page} />
      </main>
      <Footer />
    </>
  );
}
