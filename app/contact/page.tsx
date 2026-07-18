import type { Metadata } from "next";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  RadioTower,
  Users
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/lead/contact-form";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBreadcrumbJsonLd } from "@/utils/structured-data";
import type { LucideIcon } from "lucide-react";

const description =
  "Contact Shree Velora Event's for luxury weddings, corporate events, birthdays, private celebrations, religious events, venues, decor, photography, lighting, sound, and event planning.";

export const metadata: Metadata = {
  alternates: { canonical: `${siteConfig.url}/contact` },
  description,
  openGraph: {
    description,
    title: "Contact | Shree Velora Event's",
    type: "website",
    url: `${siteConfig.url}/contact`
  },
  title: "Contact | Shree Velora Event's"
};

/** Renders the public luxury contact page. */
export default function ContactPage(): React.ReactElement {
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const socials: readonly {
    readonly href?: string;
    readonly icon: LucideIcon;
    readonly label: string;
  }[] = [
    {
      href: siteConfig.social.instagram,
      icon: RadioTower,
      label: "Instagram"
    },
    {
      href: siteConfig.social.facebook,
      icon: Users,
      label: "Facebook"
    },
    {
      href: siteConfig.social.youtube,
      icon: PlayCircle,
      label: "YouTube"
    },
    {
      href: "",
      icon: Users,
      label: "LinkedIn"
    },
    {
      href: siteConfig.social.whatsapp,
      icon: MessageCircle,
      label: "WhatsApp"
    }
  ];
  const contactCards: readonly {
    readonly icon: LucideIcon;
    readonly label: string;
    readonly value: string;
  }[] = [
    { icon: Phone, label: "Phone", value: siteConfig.contact.phone },
    { icon: Mail, label: "Email", value: siteConfig.contact.email },
    { icon: MapPin, label: "Location", value: siteConfig.contact.location },
    {
      icon: Clock3,
      label: "Business Hours",
      value: siteConfig.contact.businessHours
    }
  ];

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" }
        ])}
      />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ label: "Contact" }]}
          description={description}
          eyebrow="Contact"
          title="Start Your Event Conversation"
        />
        <section className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
              <ContactForm />
              <aside className="grid gap-4 lg:sticky lg:top-28 lg:self-start">
                {contactCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      className="rounded-lg border border-white/70 bg-white/82 p-5 shadow-sm"
                      key={item.label}
                    >
                      <Icon aria-hidden="true" className="size-5 text-[#D4AF37]" />
                      <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#8b789c] uppercase">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#2D2238]">
                        {item.value}
                      </p>
                    </article>
                  );
                })}
                <div className="rounded-lg border border-white/70 bg-[#2D2238] p-5 text-white">
                  <p className="font-semibold">Social</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return social.href ? (
                        <a
                          aria-label={social.label}
                          className="flex size-10 items-center justify-center rounded-full border border-white/15 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                          href={social.href}
                          key={social.label}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Icon aria-hidden="true" className="size-4" />
                        </a>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/35"
                          key={social.label}
                        >
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
            <section
              aria-labelledby="service-areas-heading"
              className="mt-10 rounded-lg border border-white/70 bg-white/82 p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
                Areas We Serve
              </p>
              <h2
                className="font-display mt-2 text-3xl font-semibold text-[#2D2238]"
                id="service-areas-heading"
              >
                Event planning across leading cities
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5c4b6e]">
                We plan weddings, corporate events, private celebrations, and
                destination experiences across these locations and nearby areas.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Service locations">
                {siteConfig.serviceAreas.map((city) => (
                  <li
                    className="rounded-full border border-[#D4AF37]/30 bg-[#FAF7FF] px-4 py-2 text-sm font-medium text-[#2D2238]"
                    key={city}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </section>
            <div className="mt-10 min-h-[22rem] rounded-lg border border-white/70 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.28),transparent_26%),linear-gradient(135deg,#2D2238,#7d5ea1)] p-8 text-white shadow-[0_24px_80px_rgba(45,34,56,0.16)]">
              <p className="font-display text-3xl font-semibold">Google Maps</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/72">
                Shree Velora offers private consultations and event planning across our
                service destinations. Share your preferred city and venue to begin.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
