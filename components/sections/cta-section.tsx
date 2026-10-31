"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone, WandSparkles } from "lucide-react";
import { GoldenParticles } from "@/components/animations/golden-particles";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";
import { useContentStore } from "@/stores/content-store";
import { resolveRenderableImageSrc } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ContactCardItem {
  readonly href?: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}

const BALLROOM_BG_IMAGE =
  "https://res.cloudinary.com/rwmkoctu/image/upload/f_auto,q_auto,w_1600,c_limit/v1793126363/shree_velora/gallery/zcxilfdmfoz84szbqmwj.jpg";

/** Renders the unified luxury CTA and Private Consultation section with Royal Palace banquet backdrop. */
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
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.location || siteConfig.contact.location)}`,
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
      className="relative isolate overflow-hidden bg-[#241B2D] py-28 text-white sm:py-32"
    >
      {/* Royal Palace Ballroom Background Image (Dynamic Admin CMS & Cloudinary) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveRenderableImageSrc(cta.backgroundImageUrl || BALLROOM_BG_IMAGE)}
        alt="Royal Banquet Celebration"
        className="pointer-events-none absolute inset-0 size-full object-cover object-center scale-105 brightness-50 contrast-110"
        loading="lazy"
      />

      {/* Atmospheric royal purple & obsidian overlay gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#241B2D]/94 via-[#2D2238]/85 to-[#181020]/96" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,162,219,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.22),transparent_38%)]" />

      {/* Golden dust floating particles */}
      <GoldenParticles count={20} className="opacity-75" />

      <Container className="relative z-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">
              {cta.eyebrow}
            </p>
            <h2 className="font-display mt-5 text-4xl font-semibold tracking-normal text-balance sm:text-6xl text-white drop-shadow-md">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
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
          <div className="mt-20 border-t border-[#D4AF37]/20 pt-16">
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
                  <TiltCard
                    key={item.label}
                    maxTilt={6}
                    scale={1.03}
                    glareOpacity={0.2}
                    className="h-full"
                  >
                    <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-6 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37] hover:bg-white/15">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                        <Icon aria-hidden="true" className="size-5 text-[#D4AF37]" />
                      </div>
                      <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  </TiltCard>
                );

                return item.href ? (
                  <a
                    className="block focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                    href={item.href}
                    key={item.label}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
