"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { GradientButton } from "@/components/ui/gradient-button";
import { primaryNavigation } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  readonly activeSection: string;
  readonly navigationHrefPrefix?: "/" | "";
}

/** Renders the accessible mobile navigation drawer. */
export function MobileNav({
  activeSection,
  navigationHrefPrefix = ""
}: MobileNavProps): React.ReactElement {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="inline-flex size-10 items-center justify-center rounded-md border border-white/35 bg-white/18 text-white shadow-sm backdrop-blur transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none lg:hidden"
          type="button"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/60 bg-[#FAF7FF]/95 text-[#2D2238] backdrop-blur-xl sm:max-w-sm">
        <DialogTitle className="font-display text-2xl">
          Shree Velora Event's
        </DialogTitle>
        <nav aria-label="Mobile navigation" className="mt-4 grid gap-2">
          {primaryNavigation.map((item) => {
            const section = item.href.replace("#", "");
            const href = `${navigationHrefPrefix}${item.href}`;
            const isActive = activeSection === section;

            return (
              <DialogClose asChild key={item.label}>
                <a
                  className={cn(
                    "rounded-md px-3 py-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none",
                    isActive
                      ? "bg-[#EBDCFB] text-[#2D2238]"
                      : "text-[#5c4b6e] hover:bg-white hover:text-[#2D2238]"
                  )}
                  href={href}
                >
                  {item.label}
                </a>
              </DialogClose>
            );
          })}
        </nav>
        <DialogClose asChild>
          <GradientButton asChild className="mt-5 w-full">
            <a href={`${navigationHrefPrefix}#contact`}>Book Consultation</a>
          </GradientButton>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
