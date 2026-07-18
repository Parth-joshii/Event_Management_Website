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

const page = legalPages["refund-policy"];

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/refund-policy` },
  description:
    "Refund, cancellation, postponement, and advance blocking policy for Shree Velora Event's.",
  title: "Refund & Cancellation Policy | Shree Velora Event's"
};

/** Renders the refund and cancellation policy page. */
export default function RefundPolicyPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/refund-policy", label: page.title }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: page.title }]}
          description="Refund, cancellation, postponement, and advance blocking policy for event inquiries and confirmed work."
          eyebrow="Legal"
          title={page.title}
        />
        <LegalPageContent {...page} />
      </main>
      <Footer />
    </>
  );
}
