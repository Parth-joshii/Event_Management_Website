import { z } from "zod";

export const inquirySchema = z.object({
  budget: z.number().min(50_000).max(50_000_000),
  city: z.string().min(2, "City is required."),
  email: z.string().email("Enter a valid email address."),
  eventDate: z.string().optional(),
  eventType: z.string().min(1, "Choose an event type."),
  functions: z.array(z.string()),
  fullName: z.string().min(2, "Full name is required."),
  guests: z.number().min(50).max(5000),
  phone: z
    .string()
    .min(8, "Phone number is required.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  selectedServices: z.array(z.string()).min(1, "Choose at least one service."),
  source: z.enum(["customizer", "budget-calculator", "contact"]),
  specialRequirements: z.string().max(1200).optional(),
  theme: z.string().min(1, "Choose a theme."),
  venuePreference: z.string().min(1, "Choose a venue preference.")
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
