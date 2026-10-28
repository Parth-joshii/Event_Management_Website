"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";
import { useContentStore } from "@/stores/content-store";
import type { LucideIcon } from "lucide-react";

interface ContactCardItem {
  readonly href?: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}

/** Renders the unified luxury CTA and Private Consultation section. */
export function CtaSection(): React.ReactElement {
  const { siteContent } = useContentStore();

  const cta = siteContent?.ctaSection || {
    eyebrow: "Your Celebration, Beautifully Imagined",
    title: "Let Us Create Something Truly Unforgettable",
    description:
      "Share your vision and allow our team to compose a tailored celebration proposal, considered budget, and distinctive design direction.",
    ctaPrimaryText: "Begin Your Journey",
    ctaSecondaryText: "WhatsApp Us"
  };

  const contact = siteContent?.contact || siteConfig.contact;

  const whatsappMessage = "Hi Shree Velora Event's, I want to plan an event.";
  const whatsappHref = `https://wa.me/${contact.whatsappNumber || siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const contactCards: readonly ContactCardItem[] = [
    {
      href: `tel:${(contact.phone || siteConfig.contact.phone).replace(/\s/g, "")}`,
      icon: Phone,
      label: "Direct Phone",
      value: contact.phone || siteConfig.contact.phone
    },
    {
      href: `mailto:${contact.email || siteConfig.contact.email}`,
      icon: Mail,
      label: "Email Inquiry",
      value: contact.email || siteConfig.contact.email
    },
    {
      icon: MapPin,
      label: "Service Location",
      value: contact.location || siteConfig.contact.location
    },
    {
      icon: Clock3,
      label: "Business Hours",
      value: contact.businessHours || siteConfig.contact.businessHours
    }
  ];
  return (
    <section
      id="customize"
      className="relative isolate overflow-hidden bg-[#2D2238] py-24 text-white sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(191,162,219,0.32),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(212,175,55,0.22),transparent_30%)]" />
      <Container className="relative z-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">
              {cta.eyebrow}
            </p>
            <h2 className="font-display mt-5 text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
              {cta.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton>
                <GradientButton asChild tone="light">
                  <Link href="#contact">
                    <WandSparkles aria-hidden="true" className="size-4" />
                    {cta.ctaPrimaryText || "Begin Your Journey"}
                  </Link>
                </GradientButton>
              </MagneticButton>
              <MagneticButton>
                <GradientButton asChild>
                  <a href={whatsappHref} rel="noreferrer" target="_blank">
                    <MessageCircle aria-hidden="true" className="size-4" />
                    {cta.ctaSecondaryText || "WhatsApp Us"}
                  </a>
                </GradientButton>
              </MagneticButton>
            </div>
          </div>
        </Reveal>

        {/* Integrated Private Consultation Details */}
        <Reveal delay={0.12}>
          <div className="mt-20 border-t border-white/15 pt-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                Private Consultation
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
                Begin The Personal Conversation
              </h3>
              <p className="mt-3 text-sm text-white/70">
                Personal consultations and destination planning are available by appointment.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactCards.map((item) => {
                const Icon = item.icon;
                const cardContent = (
                  <div className="h-full rounded-xl border border-white/15 bg-white/8 p-6 text-left transition hover:border-[#D4AF37] hover:bg-white/12 backdrop-blur">
                    <Icon aria-hidden="true" className="size-5 text-[#D4AF37]" />
                    <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                );

                return item.href ? (
                  <a
                    className="block focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                    href={item.href}
                    key={item.label}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <div key={item.label}>{cardContent}</div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
