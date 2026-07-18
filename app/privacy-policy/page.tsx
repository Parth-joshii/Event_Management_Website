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

const page = legalPages["privacy-policy"];

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
  description:
    "Privacy policy for Shree Velora Event's website inquiries and public lead-generation forms.",
  title: "Privacy Policy | Shree Velora Event's"
};

/** Renders the privacy policy page. */
export default function PrivacyPolicyPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/privacy-policy", label: page.title }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: page.title }]}
          description="How we collect, use, and protect inquiry information submitted through the website."
          eyebrow="Legal"
          title={page.title}
        />
        <LegalPageContent {...page} />
      </main>
      <Footer />
    </>
  );
}
