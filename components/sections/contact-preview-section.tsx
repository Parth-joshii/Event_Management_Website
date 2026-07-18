import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, Quote } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import type { LucideIcon } from "lucide-react";

interface ContactItem {
  readonly href?: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}

const contactItems: readonly ContactItem[] = [
  {
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone
  },
  {
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email
  },
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.contact.location
  },
  {
    icon: Clock3,
    label: "Business Hours",
    value: siteConfig.contact.businessHours
  }
];

/** Renders compact contact details and map placeholder. */
export function ContactPreviewSection(): React.ReactElement {
  return (
    <section
      id="contact"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#EBDCFB_100%)] py-24 sm:py-28"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="Plan A Celebration With Confidence"
              description="Share the occasion, city, guest count, and preferred style. The team will help shape the event concept and planning direction."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="rounded-lg border border-white/70 bg-white/72 p-5 shadow-[0_18px_60px_rgba(45,34,56,0.08)] backdrop-blur">
                    <Icon aria-hidden="true" className="size-5 text-[#7d5ea1]" />
                    <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-[#8b789c] uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#2D2238]">
                      {item.value}
                    </p>
                  </div>
                );

                return item.href ? (
                  <a
                    className="block rounded-lg focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                    href={item.href}
                    key={item.label}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <GradientButton asChild>
                <a href={`mailto:${siteConfig.contact.email}`}>
                  <Mail aria-hidden="true" className="size-4" />
                  Contact Us
                </a>
              </GradientButton>
              <GradientButton asChild tone="light">
                <Link href="#customize">
                  <Quote aria-hidden="true" className="size-4" />
                  Get Free Quote
                </Link>
              </GradientButton>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              aria-label="Google map area for Shree Velora Event's service location"
              className="relative min-h-[26rem] overflow-hidden rounded-lg border border-white/70 bg-[#2D2238] shadow-[0_28px_90px_rgba(45,34,56,0.18)]"
              role="img"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_26%,rgba(212,175,55,0.3),transparent_26%),radial-gradient(circle_at_72%_60%,rgba(191,162,219,0.35),transparent_32%),linear-gradient(135deg,#2D2238_0%,#6b5382_100%)]" />
              <div className="absolute inset-8 rounded-lg border border-white/15" />
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-white">
                <span className="flex size-16 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-white/12 backdrop-blur">
                  <MapPin aria-hidden="true" className="size-7 text-[#D4AF37]" />
                </span>
                <p className="font-display mt-5 text-3xl font-semibold">
                  {siteConfig.contact.location}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/68">
                  Consultations and event planning support are available by appointment.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
