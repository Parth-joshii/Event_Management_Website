import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { EventCustomizerWizard } from "@/components/lead/event-customizer-wizard";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd } from "@/utils/structured-data";

const description =
  "Customize your luxury wedding, corporate event, birthday, private party, school function, or religious celebration with themes, services, guests, venue, budget, and contact details.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/customize` },
  description,
  openGraph: {
    description,
    title: "Customize Your Event | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/customize`
  },
  title: "Customize Your Event | Shree Velora Event's"
};

/** Renders the public event customization wizard page. */
export default function CustomizePage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/customize", label: "Customize" }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Customize" }]}
          description={description}
          eyebrow="Event Customizer"
          title="Design Your Celebration Step By Step"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <EventCustomizerWizard />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
