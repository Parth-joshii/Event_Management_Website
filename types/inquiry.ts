export type InquirySource = "customizer" | "budget-calculator" | "contact";

export interface InquirySubmission {
  readonly budget: number;
  readonly city: string;
  readonly email: string;
  readonly eventDate?: string;
  readonly eventType: string;
  readonly functions: readonly string[];
  readonly fullName: string;
  readonly guests: number;
  readonly phone: string;
  readonly selectedServices: readonly string[];
  readonly source: InquirySource;
  readonly specialRequirements?: string;
  readonly theme: string;
  readonly venuePreference: string;
}

export interface InquiryResponse {
  readonly emailStatus: "not-configured" | "sent" | "skipped";
  readonly googleSheetsStatus: "not-configured" | "saved" | "skipped";
  readonly message: string;
  readonly ok: boolean;
  readonly referenceNumber: string;
}

export interface BudgetEstimate {
  readonly budgetRange: string;
  readonly estimatedBudget: number;
  readonly suggestedPackage: string;
  readonly suggestedTheme: string;
  readonly suggestedVenue: string;
}
