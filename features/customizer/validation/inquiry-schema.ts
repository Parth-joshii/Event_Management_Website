import { z } from "zod";

export const inquirySchema = z.object({
  additionalRequirements: z.array(z.string()).default([]),
  bestTime: z.enum(["Morning", "Afternoon", "Evening", "Anytime"]).default("Anytime"),
  budget: z.number().min(50_000).max(50_000_000),
  city: z.string().min(2, "City is required."),
  colors: z.array(z.string()).default([]),
  customColor: z.string().default(""),
  email: z.string().email("Enter a valid email address."),
  eventDate: z.string().default(""),
  eventDateFlexibility: z.enum(["Specific Date", "Flexible Date"]).default("Specific Date"),
  eventType: z.string().min(1, "Choose an event type."),
  functions: z.array(z.string()),
  fullName: z.string().min(2, "Full name is required."),
  guests: z.number().min(10).max(10000),
  phone: z
    .string()
    .min(8, "Phone number is required.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  preferredContact: z.enum(["WhatsApp", "Phone", "Email"]).default("WhatsApp"),
  selectedServices: z.array(z.string()).min(1, "Choose at least one service."),
  source: z.enum(["customizer", "budget-calculator", "contact"]).default("customizer"),
  specialRequirements: z.string().max(1200).default(""),
  theme: z.string().min(1, "Choose a theme."),
  venueName: z.string().default(""),
  venuePreference: z.string().min(1, "Choose a venue preference."),
  venueStatus: z.enum(["Already Booked", "Need Venue Assistance", "Not Decided"]).default("Not Decided")
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
