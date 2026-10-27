"use client";

import * as React from "react";
import { MessageCircle, Phone, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Renders a luxury floating quick-contact widget for direct WhatsApp & Phone inquiries. */
export function FloatingContactWidget(): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);

  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hi Shree Velora Event's, I am interested in planning an upcoming luxury event and would like to discuss decor and services."
  )}`;
  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Quick Action Popup Panel */}
      {isOpen ? (
        <div className="animate-in fade-in-0 zoom-in-95 duration-200 mb-1 w-72 overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-[#1E1428]/95 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Sparkles className="size-3.5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Direct Concierge</p>
                <p className="text-[10px] text-white/60">Connect in real-time</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-white/50 hover:text-white transition cursor-pointer p-1"
              aria-label="Close contact widget"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {/* WhatsApp Link */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-400"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <MessageCircle className="size-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">WhatsApp Chat</p>
                <p className="text-[10px] text-white/70">Instant response & photo shares</p>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href={phoneHref}
              className="group flex items-center gap-3 rounded-xl border border-[#D4AF37]/30 bg-white/5 p-3 text-xs font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#1E1428] hover:border-[#D4AF37]"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37] text-[#1E1428] group-hover:bg-[#1E1428] group-hover:text-[#D4AF37] transition">
                <Phone className="size-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Call Concierge</p>
                <p className="text-[10px] text-white/70 group-hover:text-[#1E1428]/80">{siteConfig.contact.phone}</p>
              </div>
            </a>
          </div>
        </div>
      ) : null}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Open instant contact concierge"
        className="group relative flex items-center gap-2.5 rounded-full border border-[#D4AF37]/60 bg-[#1E1428] py-2.5 pr-4 pl-3 text-white shadow-[0_12px_40px_rgba(45,34,56,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37] hover:shadow-[0_16px_50px_rgba(212,175,55,0.4)] cursor-pointer"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
        </span>
        <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
          <MessageCircle className="size-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold tracking-wide uppercase text-[#D4AF37]">Plan With Us</p>
          <p className="text-[9px] text-white/70">WhatsApp / Call</p>
        </div>
      </button>
    </div>
  );
}
