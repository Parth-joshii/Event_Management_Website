import { google } from "googleapis";
import { env } from "@/config/env";
import type { InquirySubmission } from "@/types/inquiry";

export interface InquirySheetRowContext {
  readonly ipAddress: string;
  readonly referenceNumber: string;
  readonly userAgent: string;
}

export type GoogleSheetsSaveStatus = "not-configured" | "saved" | "skipped";

function createInquiryRow(
  inquiry: InquirySubmission,
  context: InquirySheetRowContext
): readonly string[] {
  return [
    new Date().toISOString(),
    context.referenceNumber,
    inquiry.fullName,
    inquiry.phone,
    inquiry.email,
    inquiry.city,
    inquiry.eventType,
    inquiry.functions.join(", "),
    inquiry.theme,
    inquiry.venuePreference,
    inquiry.guests.toString(),
    inquiry.budget.toString(),
    inquiry.selectedServices.join(", "),
    inquiry.specialRequirements ?? "",
    "New",
    inquiry.source,
    context.userAgent,
    context.ipAddress
  ];
}

function hasGoogleSheetsCredentials(): boolean {
  return Boolean(
    env.GOOGLE_CLIENT_EMAIL &&
    env.GOOGLE_PRIVATE_KEY &&
    env.GOOGLE_SHEETS_SPREADSHEET_ID
  );
}

/** Saves inquiry data to Google Sheets using either service account or webhook. */
export async function saveInquiryToGoogleSheets(
  inquiry: InquirySubmission,
  context: InquirySheetRowContext
): Promise<GoogleSheetsSaveStatus> {
  const row = createInquiryRow(inquiry, context);

  if (hasGoogleSheetsCredentials()) {
    const auth = new google.auth.JWT({
      email: env.GOOGLE_CLIENT_EMAIL,
      key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file"
      ]
    });
    const sheets = google.sheets({ auth, version: "v4" });

    try {
      await sheets.spreadsheets.values.append({
        range: "Inquiries!A:R",
        requestBody: {
          values: [[...row]]
        },
        spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
        valueInputOption: "USER_ENTERED"
      });
    } catch {
      await sheets.spreadsheets.values.append({
        range: "A:R",
        requestBody: {
          values: [[...row]]
        },
        spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
        valueInputOption: "USER_ENTERED"
      });
    }

    return "saved";
  }

  const webhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        body: JSON.stringify({
          referenceNumber: context.referenceNumber,
          fullName: inquiry.fullName,
          phone: inquiry.phone,
          email: inquiry.email,
          city: inquiry.city,
          eventType: inquiry.eventType,
          functions: inquiry.functions,
          theme: inquiry.theme,
          venuePreference: inquiry.venuePreference,
          guests: inquiry.guests,
          budget: inquiry.budget,
          selectedServices: inquiry.selectedServices,
          specialRequirements: inquiry.specialRequirements,
          row,
          source: inquiry.source
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      return "saved";
    } catch (e) {
      console.error("Failed to post inquiry to Google Sheet Webhook:", e);
    }
  }

  return "not-configured";
}
