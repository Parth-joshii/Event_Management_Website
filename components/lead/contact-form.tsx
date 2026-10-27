"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  inquirySchema,
  type InquiryFormValues
} from "@/features/customizer/validation/inquiry-schema";
import type { InquiryResponse } from "@/types/inquiry";

const contactDefaults: InquiryFormValues = {
  additionalRequirements: [],
  bestTime: "Anytime",
  budget: 500_000,
  city: "",
  colors: [],
  customColor: "",
  email: "",
  eventDate: "",
  eventDateFlexibility: "Flexible Date",
  eventType: "Luxury Wedding",
  functions: [],
  fullName: "",
  guests: 100,
  phone: "",
  preferredContact: "WhatsApp",
  selectedServices: ["Event Planning"],
  source: "contact",
  specialRequirements: "",
  theme: "Modern Luxury",
  venueName: "",
  venuePreference: "No Preference",
  venueStatus: "Not Decided"
};

/** Renders a large public contact inquiry form. */
export function ContactForm(): React.ReactElement {
  const [result, setResult] = React.useState<InquiryResponse>();
  const [error, setError] = React.useState<string>();
  const form = useForm<InquiryFormValues>({
    defaultValues: contactDefaults,
    resolver: zodResolver(inquirySchema) as never
  });

  const submit = form.handleSubmit(async (data) => {
    setError(undefined);
    const response = await fetch("/api/inquiries", {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const payload = (await response.json().catch(() => null)) as InquiryResponse | null;

    if (!response.ok || !payload || !payload.ok) {
      setError(payload?.message ?? "Unable to submit inquiry.");
      return;
    }

    setResult(payload);
    form.reset(contactDefaults);
  });

  return (
    <form
      className="rounded-lg border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(45,34,56,0.1)]"
      onSubmit={(event) => void submit(event)}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" error={form.formState.errors.fullName?.message}>
          <Input {...form.register("fullName")} placeholder="Your name" />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} placeholder="+91 99770 24666" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} placeholder="name@example.com" />
        </Field>
        <Field label="City" error={form.formState.errors.city?.message}>
          <Input {...form.register("city")} placeholder="Event city" />
        </Field>
        <Field label="Event Type">
          <select
            className="h-10 rounded-md border border-[#e4d6f2] bg-white px-3 text-sm"
            {...form.register("eventType")}
          >
            {[
              "Luxury Wedding",
              "Corporate Event",
              "Birthday Party",
              "Private Party",
              "School & College Function",
              "Religious Event",
              "Others"
            ].map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Event Date">
          <Input {...form.register("eventDate")} type="date" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Message">
            <Textarea
              {...form.register("specialRequirements")}
              placeholder="Tell us about your event, expected guests, venue, and decor vision."
            />
          </Field>
        </div>
      </div>
      {result ? (
        <p className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Thank you. Reference number: {result.referenceNumber}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <GradientButton
        className="mt-7"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="size-4" />
        )}
        Submit Inquiry
      </GradientButton>
    </form>
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
