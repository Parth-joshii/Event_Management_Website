"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  Briefcase,
  Cake,
  Camera,
  Castle,
  Check,
  CheckCircle2,
  ChevronUp,
  Crown,
  Edit3,
  Flame,
  Flower,
  Flower2,
  GraduationCap,
  HelpCircle,
  Home,
  Hotel,
  Info,
  Loader2,
  Music,
  Palmtree,
  Plane,
  Sparkles,
  Trees,
  UserCheck,
  Users,
  Wand2,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { eventTypesData, type EventTypeOption } from "@/features/customizer/data/event-types";
import { functionsByEventType } from "@/features/customizer/data/functions";
import { categorizedServices } from "@/features/customizer/data/services";
import { colorPreferenceOptions, themesData, type ThemeOption } from "@/features/customizer/data/themes";
import { venueOptionsData } from "@/features/customizer/data/venues";
import { calculateIndicativeEstimate } from "@/features/customizer/data/pricing";
import { inquirySchema, type InquiryFormValues } from "@/features/customizer/validation/inquiry-schema";

import type { InquiryResponse } from "@/types/inquiry";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

const STEP_NAMES = [
  "01 Event",
  "02 Functions",
  "03 Details",
  "04 Guests",
  "05 Venue",
  "06 Style",
  "07 Services",
  "08 Budget",
  "09 Requirements",
  "10 Contact",
  "11 Review"
] as const;

const LOCAL_STORAGE_KEY = "velora_customizer_draft_v1";

const defaultValues: InquiryFormValues = {
  additionalRequirements: [],
  bestTime: "Anytime",
  budget: 500000,
  city: "",
  colors: ["Gold", "Lavender"],
  customColor: "",
  email: "",
  eventDate: "",
  eventDateFlexibility: "Specific Date",
  eventType: "Luxury Weddings",
  functions: ["Haldi", "Mehndi", "Sangeet", "Phere", "Reception"],
  fullName: "",
  guests: 350,
  phone: "",
  preferredContact: "WhatsApp",
  selectedServices: [
    "Stage Decoration",
    "Floral Decoration",
    "Ambient Lighting",
    "Sound System",
    "Cinematic Videography"
  ],
  source: "customizer",
  specialRequirements: "",
  theme: "Royal Palace",
  venueName: "",
  venuePreference: "Palace",
  venueStatus: "Need Venue Assistance"
};

const iconMap: Record<string, React.ReactElement> = {
  Briefcase: <Briefcase className="size-5" />,
  Building: <Building className="size-5" />,
  Building2: <Building2 className="size-5" />,
  Cake: <Cake className="size-5" />,
  Camera: <Camera className="size-5" />,
  Castle: <Castle className="size-5" />,
  Crown: <Crown className="size-5" />,
  Flame: <Flame className="size-5" />,
  Flower: <Flower className="size-5" />,
  Flower2: <Flower2 className="size-5" />,
  GraduationCap: <GraduationCap className="size-5" />,
  HelpCircle: <HelpCircle className="size-5" />,
  Home: <Home className="size-5" />,
  Hotel: <Hotel className="size-5" />,
  Music: <Music className="size-5" />,
  Palmtree: <Palmtree className="size-5" />,
  Plane: <Plane className="size-5" />,
  Sparkles: <Sparkles className="size-5" />,
  Trees: <Trees className="size-5" />,
  Users: <Users className="size-5" />,
  Wand2: <Wand2 className="size-5" />
};

const suggestionChips = [
  "Royal Entrance",
  "Luxury Stage",
  "Floral Decoration",
  "Drone Photography",
  "Destination Event",
  "Venue Assistance",
  "Live Band",
  "Customized Theme"
] as const;

const additionalRequirementCheckboxes = [
  "Venue Recommendation",
  "Accommodation",
  "Catering",
  "Transportation",
  "Makeup Artist",
  "Invitation Design",
  "Guest Management",
  "Entertainment"
] as const;

const guestPresets = [
  { label: "Under 50", val: 40 },
  { label: "50–100", val: 85 },
  { label: "100–200", val: 150 },
  { label: "200–300", val: 250 },
  { label: "300–500", val: 350 },
  { label: "500–1000", val: 750 },
  { label: "1000+", val: 1200 }
] as const;

const budgetPresets = [
  { label: "Under ₹1 Lakh", val: 80000 },
  { label: "₹1–3 Lakh", val: 200000 },
  { label: "₹3–5 Lakh", val: 400000 },
  { label: "₹5–10 Lakh", val: 750000 },
  { label: "₹10–25 Lakh", val: 1800000 },
  { label: "₹25–50 Lakh", val: 3500000 },
  { label: "₹50 Lakh+", val: 7500000 }
] as const;

function toggleArrayValue(arr: readonly string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

/** World-Class 11-Step Interactive Event Customizer Wizard. */
export function EventCustomizerWizard(): React.ReactElement {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [showDraftBanner, setShowDraftBanner] = React.useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const form = useForm<InquiryFormValues>({
    defaultValues,
    resolver: zodResolver(inquirySchema) as never
  });

  const values = form.watch();

  // Calculate live estimate dynamically from pricing data
  const estimate = React.useMemo(() => {
    return calculateIndicativeEstimate(
      values.selectedServices,
      values.guests,
      values.theme
    );
  }, [values.selectedServices, values.guests, values.theme]);

  // Auto-save draft in localStorage
  React.useEffect(() => {
    if (hasStarted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [values, hasStarted]);

  // Detect previous saved plan draft on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setShowDraftBanner(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
        setHasStarted(true);
        setShowDraftBanner(false);
      }
    } catch {
      setShowDraftBanner(false);
    }
  };

  const clearDraftAndStart = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    form.reset(defaultValues);
    setShowDraftBanner(false);
    setHasStarted(true);
  };

  const nextStep = async () => {
    const valid = await form.trigger();
    if (valid) {
      setStepIndex((cur) => Math.min(cur + 1, STEP_NAMES.length - 1));
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStepIndex((cur) => Math.max(cur - 1, 0));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const goToStep = (idx: number) => {
    setStepIndex(idx);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(undefined);
    try {
      const response = await fetch("/api/inquiries", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      const result = (await response.json().catch(() => null)) as InquiryResponse | null;

      if (!response.ok || !result || !result.ok) {
        setSubmitError(result?.message ?? "We couldn't complete your request right now. Please try again or contact us directly on WhatsApp.");
        return;
      }

      // Clear draft on success
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }

      window.location.href = `/customize/success?ref=${encodeURIComponent(
        result.referenceNumber
      )}&name=${encodeURIComponent(data.fullName)}&event=${encodeURIComponent(data.eventType)}&date=${encodeURIComponent(data.eventDate)}&city=${encodeURIComponent(data.city)}&guests=${encodeURIComponent(data.guests)}`;
    } catch {
      setSubmitError("We couldn't complete your request right now. Please try again or contact us directly on WhatsApp.");
    }
  });

  const activeFunctionsOptions = functionsByEventType[values.eventType] || functionsByEventType["Others"];

  // --------------------------------------------------------------------------
  // INTRO SCREEN
  // --------------------------------------------------------------------------
  if (!hasStarted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[#EBDCFB] bg-gradient-to-b from-white via-[#FAF7FF] to-[#2D2238] p-6 shadow-2xl sm:p-12 text-center">
        {showDraftBanner ? (
          <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-[#D4AF37]/50 bg-[#2D2238] p-4 text-white shadow-lg animate-fade-in">
            <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Unfinished Celebration Plan Found
            </p>
            <p className="mt-1 text-sm text-[#EBDCFB]">
              We found your saved celebration draft. Would you like to continue where you left off?
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <GradientButton type="button" onClick={restoreDraft}>
                Continue Draft
              </GradientButton>
              <Button type="button" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={clearDraftAndStart}>
                Start Fresh
              </Button>
            </div>
          </div>
        ) : null}

        <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#2D2238] backdrop-blur shadow-sm">
          <Sparkles className="size-3.5 text-[#D4AF37]" /> Interactive Customizer
        </span>

        <h1 className="font-display text-4xl font-black text-[#2D2238] sm:text-6xl lg:text-7xl tracking-tight leading-tight">
          Design Your Celebration
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-[#7d5ea1] sm:text-xl">
          Your vision. Our creativity. One unforgettable celebration.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5c4b6e] sm:text-base">
          Tell us what you&apos;re imagining and we&apos;ll help turn it into a beautifully planned experience tailored to your style, guests, location and budget.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <GradientButton type="button" onClick={() => setHasStarted(true)} className="px-8 py-3 text-base shadow-xl hover:scale-105 transition">
            Let&apos;s Begin
            <ArrowRight className="size-5 ml-1" />
          </GradientButton>
          <Link href="/gallery">
            <Button type="button" variant="outline" className="rounded-full border-[#D4AF37]/50 px-7 py-3 text-sm font-semibold text-[#2D2238] hover:bg-[#EBDCFB]/30">
              Explore Our Work
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-[#EBDCFB] bg-white/80 p-5 shadow-sm">
            <Crown className="size-6 text-[#D4AF37] mb-2" />
            <h4 className="font-bold text-[#2D2238]">100% Bespoke Themes</h4>
            <p className="mt-1 text-xs text-[#5c4b6e]">Select from royal palaces, modern luxury, or custom color palettes.</p>
          </div>
          <div className="rounded-2xl border border-[#EBDCFB] bg-white/80 p-5 shadow-sm">
            <Sparkles className="size-6 text-[#D4AF37] mb-2" />
            <h4 className="font-bold text-[#2D2238]">Live Indicative Pricing</h4>
            <p className="mt-1 text-xs text-[#5c4b6e]">Get instant budget estimates as you choose decoration, sound & lighting.</p>
          </div>
          <div className="rounded-2xl border border-[#EBDCFB] bg-white/80 p-5 shadow-sm">
            <UserCheck className="size-6 text-[#D4AF37] mb-2" />
            <h4 className="font-bold text-[#2D2238]">Direct Planner Concierge</h4>
            <p className="mt-1 text-xs text-[#5c4b6e]">Receive reference ID & direct WhatsApp consultation within minutes.</p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN WIZARD INTERFACE
  // --------------------------------------------------------------------------
  return (
    <div className="relative">
      {/* 3. PROGRESS HEADER */}
      <div className="mb-8 rounded-2xl border border-[#EBDCFB] bg-white p-4 shadow-sm">
        {/* Desktop Step Stepper */}
        <div className="hidden lg:flex items-center justify-between gap-1 overflow-x-auto py-1">
          {STEP_NAMES.map((name, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <button
                key={name}
                type="button"
                onClick={() => isCompleted && goToStep(idx)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap",
                  isCurrent
                    ? "bg-[#2D2238] text-white shadow-md ring-2 ring-[#D4AF37]"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "text-[#7d5ea1] hover:bg-[#FAF7FF]"
                )}
              >
                {isCompleted ? <Check className="size-3.5 text-emerald-600" /> : null}
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-[#2D2238]">
            <span>Step {stepIndex + 1} of 11: <span className="text-[#D4AF37]">{STEP_NAMES[stepIndex]}</span></span>
            <span>{Math.round(((stepIndex + 1) / STEP_NAMES.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#EBDCFB]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2D2238] via-[#BFA2DB] to-[#D4AF37] transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / STEP_NAMES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Form Steps + Desktop Live Summary Panel */}
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Left Column: Interactive Steps Form */}
        <form onSubmit={onSubmit} className="rounded-3xl border border-[#EBDCFB] bg-white p-6 shadow-xl sm:p-8">
          
          {/* STEP 1: CHOOSE YOUR EVENT */}
          {stepIndex === 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">What are we celebrating?</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Select your main occasion to customize appropriate functions, themes & services.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {eventTypesData.map((type: EventTypeOption) => {
                  const isSelected = values.eventType === type.title;
                  return (
                    <div
                      key={type.id}
                      onClick={() => form.setValue("eventType", type.title)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer shadow-sm hover:shadow-md",
                        isSelected
                          ? "border-[#D4AF37] bg-[#2D2238] text-white ring-2 ring-[#D4AF37]"
                          : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]/60"
                      )}
                    >
                      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={type.imageSrc} alt={type.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                        <span className="absolute top-2 left-2 flex size-8 items-center justify-center rounded-full bg-[#2D2238]/80 text-[#D4AF37] backdrop-blur">
                          {iconMap[type.iconName] || <Sparkles className="size-4" />}
                        </span>
                        {isSelected ? (
                          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-md">
                            <Check className="size-4" />
                          </span>
                        ) : null}
                      </div>

                      <h3 className={cn("font-display text-lg font-bold", isSelected ? "text-white" : "text-[#2D2238]")}>
                        {type.title}
                      </h3>
                      <p className={cn("mt-1 text-xs leading-relaxed", isSelected ? "text-[#EBDCFB]/80" : "text-[#5c4b6e]")}>
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* STEP 2: CHOOSE YOUR FUNCTIONS */}
          {stepIndex === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Choose Your Functions</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Select all ceremony rituals, parties & events planned for your {values.eventType}.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(activeFunctionsOptions || []).map((fnName) => {
                  const isSelected = values.functions.includes(fnName);
                  return (
                    <button
                      key={fnName}
                      type="button"
                      onClick={() => form.setValue("functions", toggleArrayValue(values.functions, fnName))}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition cursor-pointer",
                        isSelected
                          ? "border-[#D4AF37] bg-[#2D2238] text-white shadow-md"
                          : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]/60"
                      )}
                    >
                      <span>{fnName}</span>
                      <span className={cn("flex size-5 items-center justify-center rounded-full border text-xs", isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-300 bg-gray-50")}>
                        {isSelected ? <Check className="size-3" /> : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {values.eventType === "Others" ? (
                <div className="mt-4">
                  <Label>Tell us what you are planning</Label>
                  <Input
                    {...form.register("specialRequirements")}
                    placeholder="e.g. 25th Anniversary Silver Jubilee Pool Party & Sufi Night"
                    className="mt-2"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* STEP 3: EVENT DETAILS */}
          {stepIndex === 2 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Tell us about your celebration</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Specify target date, city location, and current venue booking status.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label>Date Flexibility</Label>
                  <div className="mt-2 flex gap-3">
                    {(["Specific Date", "Flexible Date"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => form.setValue("eventDateFlexibility", opt)}
                        className={cn(
                          "flex-1 rounded-xl border py-2.5 text-xs font-bold transition cursor-pointer",
                          values.eventDateFlexibility === opt
                            ? "border-[#D4AF37] bg-[#2D2238] text-white"
                            : "border-[#EBDCFB] bg-white text-[#2D2238]"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Target Event Date</Label>
                  <Input {...form.register("eventDate")} type="date" className="mt-2" />
                </div>

                <div>
                  <Label>City / Location</Label>
                  <Input {...form.register("city")} placeholder="e.g. Udaipur, Indore, Mumbai, Jaipur, Goa" className="mt-2" />
                  {form.formState.errors.city ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.city.message}</p> : null}
                </div>

                <div>
                  <Label>Venue Status</Label>
                  <select
                    value={values.venueStatus}
                    onChange={(e) => form.setValue("venueStatus", e.target.value as "Already Booked" | "Need Venue Assistance" | "Not Decided")}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="Already Booked">Already Booked</option>
                    <option value="Need Venue Assistance">Need Venue Assistance</option>
                    <option value="Not Decided">Not Decided</option>
                  </select>
                </div>
              </div>

              {values.venueStatus === "Already Booked" ? (
                <div>
                  <Label>Venue Name & Address</Label>
                  <Input {...form.register("venueName")} placeholder="e.g. The Leela Palace, Udaipur" className="mt-2" />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* STEP 4: GUEST COUNT */}
          {stepIndex === 3 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Guest Count</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Select or adjust expected number of guests attending your event.</p>
              </div>

              <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-6 text-center shadow-inner">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7d5ea1]">Approximately</span>
                <p className="font-display mt-1 text-5xl font-black text-[#2D2238]">
                  {values.guests.toLocaleString("en-IN")} <span className="text-xl font-semibold text-[#D4AF37]">Guests</span>
                </p>
              </div>

              {/* Slider Counter */}
              <div>
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={values.guests}
                  onChange={(e) => form.setValue("guests", Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs font-semibold text-[#7d5ea1]">
                  <span>10 Guests</span>
                  <span>500 Guests</span>
                  <span>2,000+ Guests</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2.5">
                {guestPresets.map((gp) => (
                  <button
                    key={gp.label}
                    type="button"
                    onClick={() => form.setValue("guests", gp.val)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer",
                      Math.abs(values.guests - gp.val) < 40
                        ? "border-[#D4AF37] bg-[#2D2238] text-white shadow-sm"
                        : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]"
                    )}
                  >
                    {gp.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* STEP 5: VENUE PREFERENCE */}
          {stepIndex === 4 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Venue Preference</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Select your preferred environment or venue style.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {venueOptionsData.map((v) => {
                  const isSelected = values.venuePreference === v.title;
                  return (
                    <div
                      key={v.id}
                      onClick={() => form.setValue("venuePreference", v.title)}
                      className={cn(
                        "flex items-start gap-3.5 rounded-2xl border p-4 transition cursor-pointer shadow-sm hover:shadow-md",
                        isSelected
                          ? "border-[#D4AF37] bg-[#2D2238] text-white ring-2 ring-[#D4AF37]"
                          : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]/60"
                      )}
                    >
                      <span className={cn("flex size-10 items-center justify-center rounded-xl border shrink-0", isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-200 bg-gray-50 text-[#7d5ea1]")}>
                        {iconMap[v.iconName] || <Building className="size-5" />}
                      </span>
                      <div>
                        <h4 className={cn("font-bold text-sm", isSelected ? "text-white" : "text-[#2D2238]")}>{v.title}</h4>
                        <p className={cn("mt-0.5 text-xs leading-normal", isSelected ? "text-[#EBDCFB]/80" : "text-[#5c4b6e]")}>{v.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* STEP 6: CHOOSE YOUR STYLE & COLORS */}
          {stepIndex === 5 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">What should your celebration feel like?</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Choose a signature theme & color palette for your event decor.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {themesData.map((thm: ThemeOption) => {
                  const isSelected = values.theme === thm.name;
                  return (
                    <div
                      key={thm.id}
                      onClick={() => form.setValue("theme", thm.name)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-4 transition cursor-pointer shadow-sm hover:shadow-md",
                        isSelected
                          ? "border-[#D4AF37] bg-[#2D2238] text-white ring-2 ring-[#D4AF37] shadow-lg"
                          : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]/60"
                      )}
                    >
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thm.imageSrc} alt={thm.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                        {isSelected ? (
                          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-md">
                            <Check className="size-4" />
                          </span>
                        ) : null}
                      </div>

                      <h4 className={cn("font-bold text-base", isSelected ? "text-white" : "text-[#2D2238]")}>{thm.name}</h4>
                      <p className={cn("mt-1 text-xs leading-normal line-clamp-2", isSelected ? "text-[#EBDCFB]/80" : "text-[#5c4b6e]")}>{thm.description}</p>

                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Colors:</span>
                        {thm.colors.map((c, i) => (
                          <span key={i} className="size-3.5 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color Preferences */}
              <div className="border-t border-[#EBDCFB] pt-6">
                <Label>Color Palette Preference (Optional)</Label>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {colorPreferenceOptions.map((cp) => {
                    const isSelected = (values.colors || []).includes(cp.label);
                    return (
                      <button
                        key={cp.label}
                        type="button"
                        onClick={() => form.setValue("colors", toggleArrayValue(values.colors || [], cp.label))}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer",
                          isSelected
                            ? "border-[#D4AF37] bg-[#2D2238] text-white shadow-md"
                            : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]"
                        )}
                      >
                        <span className="size-3 rounded-full border border-gray-300" style={{ backgroundColor: cp.hex === "rainbow" ? "#D4AF37" : cp.hex }} />
                        <span>{cp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 7: SELECT SERVICES */}
          {stepIndex === 6 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">What would you like us to take care of?</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Select all decoration, lighting, sound & management services required.</p>
              </div>

              <div className="space-y-6">
                {categorizedServices.map((cat) => (
                  <div key={cat.category} className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-[#2D2238] text-[#D4AF37]">
                        {iconMap[cat.iconName] || <Sparkles className="size-4" />}
                      </span>
                      <h3 className="font-bold text-[#2D2238] text-base">{cat.category}</h3>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {cat.options.map((srv) => {
                        const isSelected = values.selectedServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => form.setValue("selectedServices", toggleArrayValue(values.selectedServices, srv))}
                            className={cn(
                              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition cursor-pointer",
                              isSelected
                                ? "border-[#D4AF37] bg-[#2D2238] text-white shadow-sm"
                                : "border-white bg-white text-[#2D2238] hover:border-[#D4AF37]/50"
                            )}
                          >
                            <span>{srv}</span>
                            <span className={cn("flex size-4.5 items-center justify-center rounded-full border text-[10px]", isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-300 bg-gray-50")}>
                              {isSelected ? <Check className="size-2.5" /> : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* STEP 8: BUDGET RANGE & INDICATIVE ESTIMATE */}
          {stepIndex === 7 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">What investment range are you comfortable with?</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Adjust your budget investment range to receive recommendations.</p>
              </div>

              <div className="rounded-2xl border border-[#EBDCFB] bg-[#2D2238] p-6 text-white text-center shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Selected Budget Range</span>
                <p className="font-display mt-2 text-4xl font-black text-white sm:text-5xl">
                  {formatCurrency(values.budget)}
                </p>

                <input
                  type="range"
                  min={50000}
                  max={50000000}
                  step={50000}
                  value={values.budget}
                  onChange={(e) => form.setValue("budget", Number(e.target.value))}
                  className="mt-6 w-full accent-[#D4AF37] cursor-pointer"
                />

                <div className="mt-2 flex justify-between text-xs text-[#EBDCFB]/70">
                  <span>₹50,000</span>
                  <span>₹25,000,000</span>
                  <span>₹50,000,000+</span>
                </div>
              </div>

              {/* Budget Presets */}
              <div className="flex flex-wrap gap-2">
                {budgetPresets.map((bp) => (
                  <button
                    key={bp.label}
                    type="button"
                    onClick={() => form.setValue("budget", bp.val)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer",
                      Math.abs(values.budget - bp.val) < 100000
                        ? "border-[#D4AF37] bg-[#2D2238] text-white"
                        : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]"
                    )}
                  >
                    {bp.label}
                  </button>
                ))}
              </div>

              {/* Indicative Estimate Card */}
              <div className="rounded-2xl border border-[#D4AF37]/50 bg-amber-50/40 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                  <h3 className="font-bold text-[#2D2238] text-lg">Indicative Event Investment Estimate</h3>
                  <span className="text-sm font-black text-[#D4AF37]">
                    {formatCurrency(estimate.estimatedMin)} – {formatCurrency(estimate.estimatedMax)}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 text-xs">
                  {Object.entries(estimate.breakdown).map(([cat, cost]) => (
                    <div key={cat} className="flex justify-between border-b border-gray-200/60 py-1.5 text-[#5c4b6e]">
                      <span>{cat}</span>
                      <span className="font-semibold text-[#2D2238]">{formatCurrency(cost)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-white p-3.5 border border-amber-200/60 flex items-start gap-2 text-xs text-[#5c4b6e]">
                  <Info className="size-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p>
                    <strong>Indicative estimate only.</strong> Final pricing depends on venue, date, availability, guest count, design and selected services.
                  </p>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="rounded-2xl border border-[#EBDCFB] bg-[#2D2238] p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">We Recommend</span>
                  <h4 className="font-display text-xl font-bold text-white mt-0.5">{estimate.recommendedPackage}</h4>
                  <p className="text-xs text-[#EBDCFB]/80 mt-1">
                    Theme: <strong>{values.theme}</strong> • Services: {values.selectedServices.length} Selected
                  </p>
                </div>
                <Link href="/packages">
                  <Button type="button" variant="outline" className="border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-[#2D2238] whitespace-nowrap">
                    Explore Recommended Package
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          {/* STEP 9: SPECIAL REQUIREMENTS */}
          {stepIndex === 8 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Tell us about your vision</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Share any special requests, favorite themes, artist requirements, or surprise ideas.</p>
              </div>

              <div>
                <Label>Dream Vision & Special Notes</Label>
                <Textarea
                  {...form.register("specialRequirements")}
                  rows={5}
                  placeholder="Tell us about your dream event, special requirements, favorite themes, artists, surprise ideas or anything else you'd like us to know."
                  className="mt-2"
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div>
                <span className="text-xs font-semibold text-[#7d5ea1]">Quick Suggestions (Click to append):</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const cur = form.getValues("specialRequirements") || "";
                        form.setValue("specialRequirements", cur ? `${cur}, ${chip}` : chip);
                      }}
                      className="rounded-full border border-[#EBDCFB] bg-[#FAF7FF] px-3 py-1 text-xs font-semibold text-[#2D2238] hover:border-[#D4AF37] hover:bg-[#2D2238] hover:text-white transition cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Requirements Checkboxes */}
              <div className="border-t border-[#EBDCFB] pt-6">
                <Label>Additional Assistance Options</Label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {additionalRequirementCheckboxes.map((req) => {
                    const isChecked = (values.additionalRequirements || []).includes(req);
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => form.setValue("additionalRequirements", toggleArrayValue(values.additionalRequirements || [], req))}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left text-xs font-semibold transition cursor-pointer",
                          isChecked ? "border-[#D4AF37] bg-[#2D2238] text-white" : "border-[#EBDCFB] bg-white text-[#2D2238] hover:border-[#D4AF37]"
                        )}
                      >
                        <span className={cn("flex size-4.5 items-center justify-center rounded border", isChecked ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-300 bg-gray-50")}>
                          {isChecked ? <Check className="size-3" /> : null}
                        </span>
                        <span>{req}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 10: CONTACT INFORMATION */}
          {stepIndex === 9 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Where can we reach you?</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Our senior event manager will contact you with a customized event proposal.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Full Name *</Label>
                  <Input {...form.register("fullName")} placeholder="Your full name" className="mt-2" />
                  {form.formState.errors.fullName ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.fullName.message}</p> : null}
                </div>

                <div>
                  <Label>Phone / WhatsApp Number *</Label>
                  <Input {...form.register("phone")} placeholder="+91 98765 43210" className="mt-2" />
                  {form.formState.errors.phone ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p> : null}
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input {...form.register("email")} placeholder="name@example.com" className="mt-2" />
                  {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
                </div>

                <div>
                  <Label>Preferred Contact Method</Label>
                  <select
                    value={values.preferredContact}
                    onChange={(e) => form.setValue("preferredContact", e.target.value as "WhatsApp" | "Phone" | "Email")}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone Call</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                <div>
                  <Label>Best Time To Contact</Label>
                  <select
                    value={values.bestTime}
                    onChange={(e) => form.setValue("bestTime", e.target.value as "Morning" | "Afternoon" | "Evening" | "Anytime")}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="Morning">Morning (9 AM – 12 PM)</option>
                    <option value="Afternoon">Afternoon (12 PM – 5 PM)</option>
                    <option value="Evening">Evening (5 PM – 9 PM)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 11: REVIEW & CONFIRM */}
          {stepIndex === 10 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238] sm:text-3xl">Review Your Celebration</h2>
                <p className="mt-1 text-sm text-[#5c4b6e]">Review your event plan before submitting to Shree Velora Event&apos;s.</p>
              </div>

              <div className="space-y-4">
                {/* Section Cards with Edit Hop Buttons */}
                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">01 Event & Functions</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{values.eventType}</h4>
                    <p className="text-xs text-[#5c4b6e]">{values.functions.join(", ")}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(0)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">02 Details & Guests</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{values.city || "Indore"} • {values.guests} Guests</h4>
                    <p className="text-xs text-[#5c4b6e]">Date: {values.eventDate || "Flexible"} ({values.venueStatus})</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(2)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">03 Style & Palette</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{values.theme}</h4>
                    <p className="text-xs text-[#5c4b6e]">Venue: {values.venuePreference} • Colors: {(values.colors || []).join(", ")}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(5)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">04 Services Selected</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{values.selectedServices.length} Services</h4>
                    <p className="text-xs text-[#5c4b6e]">{values.selectedServices.join(", ")}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(6)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">05 Investment Budget</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{formatCurrency(values.budget)}</h4>
                    <p className="text-xs text-[#5c4b6e]">Est: {formatCurrency(estimate.estimatedMin)} – {formatCurrency(estimate.estimatedMax)}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(7)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5ea1]">06 Contact Details</span>
                    <h4 className="font-bold text-[#2D2238] text-base">{values.fullName} ({values.phone})</h4>
                    <p className="text-xs text-[#5c4b6e]">{values.email} • Contact via {values.preferredContact}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => goToStep(9)}>
                    <Edit3 className="size-3.5 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Submit Error Message */}
          {submitError ? (
            <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
              <p className="font-bold">Submission Notice:</p>
              <p className="mt-1">{submitError}</p>
            </div>
          ) : null}

          {/* Navigation Control Buttons */}
          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[#EBDCFB] pt-6 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={stepIndex === 0}
              onClick={prevStep}
              className="border-gray-300 text-[#2D2238] hover:bg-gray-100"
            >
              <ArrowLeft className="size-4 mr-1" /> Back
            </Button>

            {stepIndex < STEP_NAMES.length - 1 ? (
              <GradientButton type="button" onClick={nextStep} className="px-8 shadow-md">
                Continue <ArrowRight className="size-4 ml-1" />
              </GradientButton>
            ) : (
              <GradientButton type="submit" disabled={form.formState.isSubmitting} className="px-8 shadow-xl">
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1" /> Creating Plan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 mr-1" /> Create My Celebration Plan
                  </>
                )}
              </GradientButton>
            )}
          </div>
        </form>

        {/* Right Column: Desktop Sticky Live Summary Panel */}
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-[#EBDCFB] bg-[#2D2238] p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Live Summary</span>
                <h3 className="font-display text-xl font-bold text-white">YOUR CELEBRATION</h3>
              </div>
              <Sparkles className="size-5 text-[#D4AF37]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Event</span>
                <span className="font-bold text-white">{values.eventType}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">City</span>
                <span className="font-bold text-white">{values.city || "Indore"}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Guests</span>
                <span className="font-bold text-white">{values.guests} Guests</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Venue</span>
                <span className="font-bold text-white">{values.venuePreference}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Theme</span>
                <span className="font-bold text-white">{values.theme}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Services</span>
                <span className="font-bold text-white">{values.selectedServices.length} Selected</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#EBDCFB]/70">Budget</span>
                <span className="font-bold text-[#D4AF37]">{formatCurrency(values.budget)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#EBDCFB]/70">Indicative Estimate</span>
              <p className="font-display mt-1 text-lg font-bold text-[#D4AF37]">
                {formatCurrency(estimate.estimatedMin)} – {formatCurrency(estimate.estimatedMax)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Summary Trigger Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <Button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full rounded-2xl bg-[#2D2238] p-4 text-white shadow-2xl border border-[#D4AF37]/50 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-wider">View My Celebration</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D4AF37]">{formatCurrency(values.budget)}</span>
            <ChevronUp className={cn("size-4 transition", mobileSummaryOpen && "rotate-180")} />
          </div>
        </Button>
      </div>

      {/* Mobile Summary Drawer Sheet */}
      {mobileSummaryOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-full rounded-t-3xl border-t border-[#D4AF37] bg-[#2D2238] p-6 text-white shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-white">YOUR CELEBRATION SUMMARY</h3>
              <button type="button" onClick={() => setMobileSummaryOpen(false)} className="rounded-full p-1 text-white hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">Event</span><span className="font-bold">{values.eventType}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">City</span><span className="font-bold">{values.city || "Indore"}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">Guests</span><span className="font-bold">{values.guests} Guests</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">Venue</span><span className="font-bold">{values.venuePreference}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">Theme</span><span className="font-bold">{values.theme}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#EBDCFB]/70">Budget</span><span className="font-bold text-[#D4AF37]">{formatCurrency(values.budget)}</span></div>
            </div>

            <Button type="button" onClick={() => setMobileSummaryOpen(false)} className="w-full rounded-xl bg-[#D4AF37] text-[#2D2238] font-bold">
              Close & Continue
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
