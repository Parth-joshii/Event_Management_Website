"use client";

import * as React from "react";
import { Calculator, Send } from "lucide-react";
import { DownloadSummaryButton } from "@/components/lead/download-summary-button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Label } from "@/components/ui/label";
import {
  calculateBudgetEstimate,
  calculatorAddOns,
  calculatorEvents
} from "@/features/calculator/data/budget-options";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

/** Renders a live public event budget calculator. */
export function BudgetCalculator(): React.ReactElement {
  const [eventType, setEventType] =
    React.useState<(typeof calculatorEvents)[number]>("Luxury Wedding");
  const [guests, setGuests] = React.useState(250);
  const [addOns, setAddOns] = React.useState<readonly string[]>([
    "Decoration",
    "Photography",
    "Lighting"
  ]);
  const estimate = calculateBudgetEstimate(eventType, guests, addOns);

  const toggleAddOn = (addOn: string) => {
    setAddOns((current) =>
      current.includes(addOn)
        ? current.filter((item) => item !== addOn)
        : [...current, addOn]
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <section className="rounded-lg border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
        <div className="grid gap-6">
          <div>
            <Label>Event</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {calculatorEvents.map((event) => (
                <button
                  aria-pressed={eventType === event}
                  className={cn(
                    "rounded-lg border p-4 text-left text-sm font-semibold transition",
                    eventType === event
                      ? "border-[#D4AF37] bg-[#2D2238] text-white"
                      : "border-[#EBDCFB] bg-white text-[#2D2238]"
                  )}
                  key={event}
                  onClick={() => setEventType(event)}
                  type="button"
                >
                  {event}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Guests</Label>
            <p className="font-display mt-3 text-4xl font-semibold text-[#2D2238]">
              {guests.toLocaleString("en-IN")}
            </p>
            <input
              className="mt-6 w-full accent-[#D4AF37]"
              max={1200}
              min={50}
              onChange={(event) => setGuests(Number(event.target.value))}
              step={25}
              type="range"
              value={guests}
            />
          </div>
          <div>
            <Label>Services</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {calculatorAddOns.map((addOn) => {
                const active = addOns.includes(addOn);
                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      "rounded-lg border p-4 text-left text-sm font-semibold transition",
                      active
                        ? "border-[#D4AF37] bg-[#2D2238] text-white"
                        : "border-[#EBDCFB] bg-white text-[#2D2238]"
                    )}
                    key={addOn}
                    onClick={() => toggleAddOn(addOn)}
                    type="button"
                  >
                    {addOn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <aside className="rounded-lg border border-white/70 bg-[#2D2238] p-6 text-white shadow-[0_24px_80px_rgba(45,34,56,0.18)] lg:sticky lg:top-28 lg:self-start">
        <Calculator aria-hidden="true" className="size-8 text-[#D4AF37]" />
        <h2 className="font-display mt-5 text-3xl font-semibold">Estimated Budget</h2>
        <p className="mt-5 text-4xl font-semibold text-[#D4AF37]">
          {formatCurrency(estimate.estimatedBudget)}
        </p>
        <dl className="mt-6 grid gap-4 text-sm">
          <div>
            <dt className="text-white/50">Budget Range</dt>
            <dd className="mt-1 font-semibold">{estimate.budgetRange}</dd>
          </div>
          <div>
            <dt className="text-white/50">Suggested Package</dt>
            <dd className="mt-1 font-semibold">{estimate.suggestedPackage}</dd>
          </div>
          <div>
            <dt className="text-white/50">Suggested Theme</dt>
            <dd className="mt-1 font-semibold">{estimate.suggestedTheme}</dd>
          </div>
          <div>
            <dt className="text-white/50">Suggested Venue</dt>
            <dd className="mt-1 font-semibold">{estimate.suggestedVenue}</dd>
          </div>
        </dl>
        <div className="mt-7 grid gap-3">
          <GradientButton asChild tone="light">
            <a href="/customize">
              <Send aria-hidden="true" className="size-4" />
              Submit Inquiry
            </a>
          </GradientButton>
          <DownloadSummaryButton
            summary={{
              Event: eventType,
              Guests: guests,
              Services: addOns,
              "Estimated Budget": formatCurrency(estimate.estimatedBudget),
              "Suggested Package": estimate.suggestedPackage,
              "Suggested Theme": estimate.suggestedTheme,
              "Suggested Venue": estimate.suggestedVenue
            }}
          />
        </div>
      </aside>
    </div>
  );
}
