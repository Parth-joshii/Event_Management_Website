"use client";

import * as React from "react";
import { Menu, Phone, Mail, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { GradientButton } from "@/components/ui/gradient-button";
import { primaryNavigation } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  readonly activeSection: string;
  readonly navigationHrefPrefix?: "/" | "";
}

/** Renders the accessible VIP luxury mobile navigation drawer. */
export function MobileNav({
  activeSection,
  navigationHrefPrefix = ""
}: MobileNavProps): React.ReactElement {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="inline-flex size-11 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-white/15 text-[#D4AF37] shadow-md backdrop-blur transition hover:bg-white/25 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none lg:hidden"
          type="button"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="border-[#D4AF37]/40 bg-[#1f1629]/96 text-white backdrop-blur-2xl sm:max-w-sm rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="flex size-10 items-center justify-center rounded-full border border-[#D4AF37] bg-white/10 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Sparkles className="size-4" />
          </span>
          <div>
            <DialogTitle className="font-display text-xl font-bold tracking-wide text-white">
              {siteConfig.name}
            </DialogTitle>
            <p className="text-[11px] font-medium text-[#EBDCFB]/70 uppercase tracking-widest">
              Luxury Event Concierge
            </p>
          </div>
        </div>

        <nav aria-label="Mobile navigation" className="mt-4 grid gap-1.5">
          {primaryNavigation.map((item) => {
            const section = item.href.replace("#", "");
            const href = `${navigationHrefPrefix}${item.href}`;
            const isActive = activeSection === section;

            return (
              <DialogClose asChild key={item.label}>
                <a
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none",
                    isActive
                      ? "bg-white/15 text-[#D4AF37] border border-[#D4AF37]/40"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  href={href}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="size-2 rounded-full bg-[#D4AF37]" />}
                </a>
              </DialogClose>
            );
          })}
        </nav>

        {/* Quick Contact Chips */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2 px-3 text-xs font-semibold text-white/90 hover:bg-white/15 transition"
          >
            <Phone className="size-3.5 text-[#D4AF37]" />
            <span>Call Us</span>
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2 px-3 text-xs font-semibold text-white/90 hover:bg-white/15 transition"
          >
            <Mail className="size-3.5 text-[#D4AF37]" />
            <span>Email Us</span>
          </a>
        </div>

        <DialogClose asChild>
          <GradientButton asChild className="mt-5 w-full justify-center text-sm py-3 font-bold">
            <a href={`${navigationHrefPrefix}#contact`}>Book Consultation</a>
          </GradientButton>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

