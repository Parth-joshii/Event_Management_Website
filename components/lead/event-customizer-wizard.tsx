"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  budgetRange,
  eventServices,
  eventThemesForCustomizer,
  eventTypes,
  venuePreferences,
  weddingFunctions
} from "@/features/customizer/data/customizer-options";
import {
  inquirySchema,
  type InquiryFormValues
} from "@/features/customizer/validation/inquiry-schema";
import type { InquiryResponse } from "@/types/inquiry";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

const steps = [
  "Event",
  "Functions",
  "Theme",
  "Services",
  "Guests",
  "Venue",
  "Budget",
  "Contact",
  "Review"
] as const;

const defaultValues: InquiryFormValues = {
  budget: 1_000_000,
  city: "",
  email: "",
  eventDate: "",
  eventType: "Luxury Wedding",
  functions: ["Wedding", "Reception"],
  fullName: "",
  guests: 200,
  phone: "",
  selectedServices: ["Photography", "Lighting Effects", "Floral Decoration"],
  source: "customizer",
  specialRequirements: "",
  theme: "Royal Palace",
  venuePreference: "Banquet"
};

function toggleValue(values: readonly string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/** Renders the luxury multi-step public event customizer wizard. */
export function EventCustomizerWizard(): React.ReactElement {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submission, setSubmission] = React.useState<InquiryResponse>();
  const [submitError, setSubmitError] = React.useState<string>();
  const form = useForm<InquiryFormValues>({
    defaultValues,
    resolver: zodResolver(inquirySchema)
  });
  const values = form.watch();
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isWedding = values.eventType === "Luxury Wedding";

  const submit = form.handleSubmit(async (data) => {
    setSubmitError(undefined);
    const response = await fetch("/api/inquiries", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const result = (await response.json()) as InquiryResponse;

    if (!response.ok || !result.ok) {
      setSubmitError(result.message ?? "Inquiry could not be submitted.");
      return;
    }

    setSubmission(result);
    window.location.href = `/customize/success?ref=${encodeURIComponent(
      result.referenceNumber
    )}`;
  });

  const nextStep = async () => {
    const valid = await form.trigger();
    if (!valid) {
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  return (
    <form
      className="rounded-lg border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(45,34,56,0.1)] backdrop-blur sm:p-8"
      onSubmit={(event) => void submit(event)}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#2D2238]">
            Step {stepIndex + 1} of {steps.length}: {steps[stepIndex]}
          </p>
          <p className="text-sm text-[#7d5ea1]">{Math.round(progress)}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EBDCFB]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#BFA2DB] to-[#D4AF37] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {stepIndex === 0 ? (
        <ChoiceGrid
          items={eventTypes}
          selected={[values.eventType]}
          onToggle={(value) => form.setValue("eventType", value)}
        />
      ) : null}

      {stepIndex === 1 ? (
        <ChoiceGrid
          items={isWedding ? weddingFunctions : [values.eventType]}
          multiple
          selected={values.functions}
          onToggle={(value) =>
            form.setValue("functions", toggleValue(values.functions, value))
          }
        />
      ) : null}

      {stepIndex === 2 ? (
        <ChoiceGrid
          items={eventThemesForCustomizer}
          selected={[values.theme]}
          onToggle={(value) => form.setValue("theme", value)}
        />
      ) : null}

      {stepIndex === 3 ? (
        <ChoiceGrid
          items={eventServices}
          multiple
          selected={values.selectedServices}
          onToggle={(value) =>
            form.setValue(
              "selectedServices",
              toggleValue(values.selectedServices, value)
            )
          }
        />
      ) : null}

      {stepIndex === 4 ? (
        <RangeStep
          label="Expected guests"
          max={1000}
          min={50}
          suffix={values.guests >= 1000 ? "+" : ""}
          value={values.guests}
          onChange={(value) => form.setValue("guests", value)}
        />
      ) : null}

      {stepIndex === 5 ? (
        <ChoiceGrid
          items={venuePreferences}
          selected={[values.venuePreference]}
          onToggle={(value) => form.setValue("venuePreference", value)}
        />
      ) : null}

      {stepIndex === 6 ? (
        <RangeStep
          label="Preferred budget"
          max={budgetRange.max}
          min={budgetRange.min}
          prefix="INR "
          step={budgetRange.step}
          value={values.budget}
          onChange={(value) => form.setValue("budget", value)}
        />
      ) : null}

      {stepIndex === 7 ? (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name" error={form.formState.errors.fullName?.message}>
            <Input {...form.register("fullName")} placeholder="Your name" />
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <Input {...form.register("phone")} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <Input {...form.register("email")} placeholder="name@example.com" />
          </Field>
          <Field label="City" error={form.formState.errors.city?.message}>
            <Input {...form.register("city")} placeholder="Event city" />
          </Field>
          <Field label="Event Date">
            <Input {...form.register("eventDate")} type="date" />
          </Field>
          <Field label="Special Requirements">
            <Textarea
              {...form.register("specialRequirements")}
              placeholder="Tell us about rituals, venue, decor ideas, artist needs, or timing."
            />
          </Field>
        </div>
      ) : null}

      {stepIndex === 8 ? (
        <ReviewSummary values={values} reference={submission?.referenceNumber} />
      ) : null}

      {submitError ? (
        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
        <Button
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
          type="button"
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </Button>
        {stepIndex < steps.length - 1 ? (
          <GradientButton onClick={() => void nextStep()} type="button">
            Next
            <ArrowRight aria-hidden="true" className="size-4" />
          </GradientButton>
        ) : (
          <GradientButton disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 aria-hidden="true" className="size-4" />
            )}
            Submit Inquiry
          </GradientButton>
        )}
      </div>
    </form>
  );
}

interface ChoiceGridProps {
  readonly items: readonly string[];
  readonly multiple?: boolean;
  readonly onToggle: (value: string) => void;
  readonly selected: readonly string[];
}

function ChoiceGrid({
  items,
  multiple = false,
  onToggle,
  selected
}: ChoiceGridProps): React.ReactElement {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isSelected = selected.includes(item);
        return (
          <button
            aria-pressed={isSelected}
            className={cn(
              "rounded-lg border p-4 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none",
              isSelected
                ? "border-[#D4AF37] bg-[#2D2238] text-white"
                : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]/70"
            )}
            key={item}
            onClick={() => onToggle(item)}
            type="button"
          >
            {item}
            {multiple ? (
              <span className="mt-2 block text-xs opacity-70">Multiple selection</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface RangeStepProps {
  readonly label: string;
  readonly max: number;
  readonly min: number;
  readonly onChange: (value: number) => void;
  readonly prefix?: string;
  readonly step?: number;
  readonly suffix?: string;
  readonly value: number;
}

function RangeStep({
  label,
  max,
  min,
  onChange,
  prefix = "",
  step = 50,
  suffix = "",
  value
}: RangeStepProps): React.ReactElement {
  return (
    <div>
      <Label>{label}</Label>
      <p className="font-display mt-4 text-4xl font-semibold text-[#2D2238]">
        {prefix}
        {prefix ? value.toLocaleString("en-IN") : value}
        {suffix}
      </p>
      <input
        className="mt-8 w-full accent-[#D4AF37]"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div className="mt-3 flex justify-between text-xs text-[#7d5ea1]">
        <span>{prefix ? formatCurrency(min) : min}</span>
        <span>{prefix ? formatCurrency(max) : `${max}+`}</span>
      </div>
    </div>
  );
}

function Field({
  children,
  error,
  label
}: {
  readonly children: React.ReactNode;
  readonly error?: string;
  readonly label: string;
}): React.ReactElement {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function ReviewSummary({
  reference,
  values
}: {
  readonly reference?: string;
  readonly values: InquiryFormValues;
}): React.ReactElement {
  const rows = {
    Budget: formatCurrency(values.budget),
    City: values.city || "Not provided",
    Contact: `${values.fullName || "Name pending"} - ${values.phone || "Phone pending"}`,
    Email: values.email || "Not provided",
    "Event Type": values.eventType,
    Functions: values.functions,
    Guests: values.guests,
    Services: values.selectedServices,
    Theme: values.theme,
    Venue: values.venuePreference
  };

  return (
    <div className="grid gap-3">
      {Object.entries(rows).map(([label, value]) => (
        <div
          className="rounded-lg border border-[#EBDCFB] bg-[#FAF7FF] p-4"
          key={label}
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-[#8b789c] uppercase">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#2D2238]">
            {Array.isArray(value) ? value.join(", ") : value}
          </p>
        </div>
      ))}
      {reference ? (
        <p className="text-sm font-semibold text-[#D4AF37]">Reference: {reference}</p>
      ) : null}
    </div>
  );
}
