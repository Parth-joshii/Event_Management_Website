"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  readonly items: readonly {
    readonly answer: string;
    readonly category: string;
    readonly question: string;
  }[];
}

/** Renders an accessible animated FAQ accordion. */
export function FaqAccordion({ items }: FaqAccordionProps): React.ReactElement {
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            className="rounded-lg border border-white/70 bg-white/82 shadow-sm"
            key={item.question}
          >
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              type="button"
            >
              <span>
                <span className="block text-xs font-semibold tracking-[0.16em] text-[#D4AF37] uppercase">
                  {item.category}
                </span>
                <span className="mt-1 block font-semibold text-[#2D2238]">
                  {item.question}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-5 shrink-0 text-[#7d5ea1] transition-transform",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </button>
            <div
              className={cn(
                "grid overflow-hidden px-5 transition-all duration-300",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              )}
            >
              <p className="min-h-0 text-sm leading-7 text-[#5c4b6e]">{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
