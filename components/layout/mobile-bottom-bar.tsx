"use client";

import * as React from "react";
import { Home, Info, Images, PhoneCall, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { EventCustomizerWizard } from "@/components/lead/event-customizer-wizard";
import { siteConfig } from "@/config/site";

/** Renders a mobile-first floating quick action bar for smartphones and tablets. */
export function MobileBottomBar(): React.ReactElement {
  const [customizerOpen, setCustomizerOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 flex items-center justify-between rounded-full border border-[#D4AF37]/50 bg-[#1f1629]/94 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:hidden">
      <a
        href="#home"
        aria-label="Home"
        className="flex flex-col items-center justify-center py-1.5 px-3 text-white/80 transition hover:text-[#D4AF37] focus:outline-none"
      >
        <Home className="size-4" />
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider">Home</span>
      </a>

      <a
        href="#about"
        aria-label="About"
        className="flex flex-col items-center justify-center py-1.5 px-3 text-white/80 transition hover:text-[#D4AF37] focus:outline-none"
      >
        <Info className="size-4" />
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider">About</span>
      </a>

      <a
        href="#gallery"
        aria-label="Gallery"
        className="flex flex-col items-center justify-center py-1.5 px-3 text-white/80 transition hover:text-[#D4AF37] focus:outline-none"
      >
        <Images className="size-4" />
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider">Gallery</span>
      </a>

      <a
        href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
        aria-label="Call Us"
        className="flex flex-col items-center justify-center py-1.5 px-3 text-white/80 transition hover:text-[#D4AF37] focus:outline-none"
      >
        <PhoneCall className="size-4 text-[#D4AF37]" />
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider">Call</span>
      </a>

      {/* Direct Customize Trigger */}
      <Dialog open={customizerOpen} onOpenChange={setCustomizerOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] px-4 py-2 text-xs font-bold text-[#2D2238] shadow-[0_4px_16px_rgba(212,175,55,0.4)] active:scale-95 transition"
          >
            <Sparkles className="size-3.5 fill-[#2D2238]" />
            <span>Plan Event</span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto border-[#EBDCFB] bg-[#FAF7FF] p-5 text-[#2D2238]">
          <DialogHeader className="mb-3 text-left">
            <DialogTitle className="font-display text-xl font-bold text-[#2D2238]">
              Design Your Celebration
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5c4b6e]">
              Configure your event type, venue, guest capacity, and budget step-by-step.
            </DialogDescription>
          </DialogHeader>
          <EventCustomizerWizard />
        </DialogContent>
      </Dialog>
    </div>
  );
}
