"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { CalendarCheck } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { GradientButton } from "@/components/ui/gradient-button";
import { primaryNavigation } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface HeaderProps {
  readonly logoSrc?: string;
  readonly navigationHrefPrefix?: "/" | "";
}

/** Renders the sticky premium navigation header. */
export function Header({
  logoSrc,
  navigationHrefPrefix = ""
}: HeaderProps): React.ReactElement {
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const updateHeader = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      setHasScrolled(scrollTop > 24);
      setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  React.useEffect(() => {
    const sections = primaryNavigation
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0.01
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        hasScrolled
          ? "border-b border-white/45 bg-[#2D2238]/72 shadow-[0_18px_60px_rgba(45,34,56,0.18)] backdrop-blur-2xl"
          : "bg-transparent"
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-[#BFA2DB] via-[#D4AF37] to-white"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="Shree Velora Event's home"
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
          href="#home"
        >
          <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37] bg-white p-1 shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
            {logoSrc ? (
              <Image
                alt="Shree Velora Event's logo"
                className="size-full rounded-full object-cover"
                fill
                sizes="48px"
                src={logoSrc}
              />
            ) : (
              "SV"
            )}
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-display text-xl font-semibold tracking-normal text-white">
              {siteConfig.name}
            </span>
            <span className="truncate text-xs font-medium text-white/72">
              Luxury Event Management
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-sm font-medium text-white shadow-sm backdrop-blur-xl lg:flex"
        >
          {primaryNavigation.map((item) => {
            const section = item.href.replace("#", "");
            const href = `${navigationHrefPrefix}${item.href}`;
            const isActive = activeSection === section;

            return (
              <a
                className={cn(
                  "group relative rounded-full px-4 py-2 transition focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none",
                  isActive ? "bg-white/18 text-white" : "text-white/76 hover:text-white"
                )}
                href={href}
                key={item.label}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-4 bottom-1 left-4 h-px origin-left scale-x-0 bg-[#D4AF37] transition-transform duration-300",
                    isActive ? "scale-x-100" : "group-hover:scale-x-100"
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <GradientButton asChild className="hidden lg:inline-flex">
            <a href={`${navigationHrefPrefix}#contact`}>
              <CalendarCheck aria-hidden="true" className="size-4" />
              Book Consultation
            </a>
          </GradientButton>
          <MobileNav
            activeSection={activeSection}
            navigationHrefPrefix={navigationHrefPrefix}
          />
        </div>
      </div>
    </header>
  );
}
