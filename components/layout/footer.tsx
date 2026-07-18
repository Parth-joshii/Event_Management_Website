import Link from "next/link";
import { Mail, MessageCircle, PlayCircle, RadioTower, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { primaryNavigation } from "@/constants/routes";
import { siteConfig } from "@/config/site";

const footerServices = [
  "Luxury Weddings",
  "Corporate Events",
  "Birthday Parties",
  "Religious Events",
  "School Functions",
  "Private Parties"
] as const;

const socialLinks = [
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
    href: siteConfig.social.whatsapp,
    icon: MessageCircle,
    label: "WhatsApp"
  }
] as const;

/** Renders the premium site footer and newsletter capture shell. */
export function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#2D2238] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#EBDCFB] text-sm font-bold text-[#2D2238]">
              SV
            </span>
            <div>
              <p className="font-display text-2xl font-semibold">{siteConfig.name}</p>
              <p className="mt-1 text-sm text-white/70">{siteConfig.tagline}</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/68">
            Premium event planning, decor, production, and celebration management for
            families, brands, institutions, and communities.
          </p>
          <div className="mt-6 flex gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              if (!social.href) {
                return (
                  <span
                    aria-disabled="true"
                    aria-label={`${social.label} profile not configured`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white/35"
                    key={social.label}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                );
              }

              return (
                <Link
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                  href={social.href}
                  key={social.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Links</p>
          <ul className="mt-5 grid gap-3 text-sm text-white/68">
            {primaryNavigation.map((item) => (
              <li key={item.label}>
                <a
                  className="transition hover:text-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                  href={item.href}
                >
                  {item.label === "Customize" ? "Customize Event" : item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Services</p>
          <ul className="mt-5 grid gap-3 text-sm text-white/68">
            {footerServices.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Newsletter</p>
          <p className="mt-5 text-sm leading-7 text-white/68">
            Receive seasonal ideas for premium weddings, brand events, and signature
            celebrations.
          </p>
          <form className="mt-5 flex gap-2" aria-label="Newsletter form">
            <Input
              aria-label="Email address"
              className="border-white/15 bg-white/10 text-white placeholder:text-white/40"
              placeholder="Email address"
              type="email"
            />
            <Button
              className="border-[#D4AF37]/70 text-white hover:bg-[#D4AF37] hover:text-[#2D2238]"
              disabled
              type="button"
              variant="outline"
            >
              Join
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">
            <Link className="hover:text-[#D4AF37]" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-[#D4AF37]" href="/terms-and-conditions">
              Terms & Conditions
            </Link>
            <Link className="hover:text-[#D4AF37]" href="/refund-policy">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
      <Separator className="bg-white/10" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/45 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          Copyright {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="inline-flex items-center gap-2">
          <Mail aria-hidden="true" className="size-3.5" />
          {siteConfig.contact.email}
        </p>
      </div>
    </footer>
  );
}
