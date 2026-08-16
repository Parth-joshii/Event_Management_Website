"use client";

import * as React from "react";
import { Sparkles, Crown, Award, Gem, HeartHandshake, ShieldCheck } from "lucide-react";
import { ParallaxWrapper } from "@/components/animations/parallax-wrapper";

const marqueeItems = [
  { icon: Crown, text: "ROYAL WEDDING STAGES" },
  { icon: Gem, text: "BESPOKE DECOR DESIGN" },
  { icon: Sparkles, text: "CELEBRITY EVENT COORDINATION" },
  { icon: HeartHandshake, text: "FULL CONCIERGE SERVICE" },
  { icon: ShieldCheck, text: "FLAWLESS EVENT EXECUTION" },
  { icon: Award, text: "DESTINATION WEDDING MASTERY" }
];

/** Renders a smooth animated horizontal scroll marquee strip. */
export function ScrollMarqueeBanner(): React.ReactElement {
  return (
    <div className="relative isolate overflow-hidden border-y border-[#D4AF37]/30 bg-[#2D2238] py-4 text-white shadow-inner">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#2D2238] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#2D2238] to-transparent" />

      <ParallaxWrapper offset={16}>
        <div className="flex select-none gap-8 whitespace-nowrap">
          {/* Double loop for continuous smooth infinite scrolling */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#EBDCFB] backdrop-blur transition hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
                key={`${item.text}-${idx}`}
              >
                <Icon className="size-4 text-[#D4AF37]" />
                <span>{item.text}</span>
                <span className="ml-2 text-[#D4AF37]/40">•</span>
              </div>
            );
          })}
        </div>
      </ParallaxWrapper>
    </div>
  );
}
