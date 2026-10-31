"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

interface VenuePartner {
  readonly name: string;
  readonly location: string;
}

const DESTINATION_PARTNERS: readonly VenuePartner[] = [
  { name: "The Oberoi Udaivilas", location: "Udaipur" },
  { name: "Umaid Bhawan Palace", location: "Jodhpur" },
  { name: "Rambagh Palace", location: "Jaipur" },
  { name: "Taj Falaknuma Palace", location: "Hyderabad" },
  { name: "JW Marriott Resort", location: "Goa" },
  { name: "Fairmont Palace", location: "Jaipur" },
  { name: "The Leela Palace", location: "New Delhi" },
  { name: "Raffles Grand Estate", location: "Udaipur" },
  { name: "ITC Grand Bharat", location: "Gurugram" }
];

/**
 * Renders an infinite smooth luxury marquee ticker displaying royal palace destinations & venue partners.
 */
export function VenueMarquee(): React.ReactElement {
  // Duplicate array to achieve a seamless infinite loop without gaps
  const doubledList = React.useMemo(
    () => [...DESTINATION_PARTNERS, ...DESTINATION_PARTNERS],
    []
  );

  return (
    <div
      aria-label="Royal destination partners ticker"
      className="relative w-full overflow-hidden border-y border-[#D4AF37]/20 bg-[#231A2D] py-4 text-white shadow-inner"
    >
      {/* Edge gradient masks for seamless fade out on left and right */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#231A2D] to-transparent sm:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#231A2D] to-transparent sm:w-36" />

      {/* Infinite scrolling marquee track */}
      <div className="animate-marquee flex items-center">
        {doubledList.map((partner, index) => (
          <div
            // Unique key for duplicated elements
            key={`${partner.name}-${index}`}
            className="flex items-center gap-4 px-6 sm:px-8 whitespace-nowrap"
          >
            <span className="font-display text-sm tracking-wider text-white/90 sm:text-base font-medium">
              {partner.name}
            </span>
            <span className="rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#D4AF37] uppercase border border-[#D4AF37]/30">
              {partner.location}
            </span>
            <Sparkles aria-hidden="true" className="size-3 text-[#D4AF37]/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

