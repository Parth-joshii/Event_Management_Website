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

    await sheets.spreadsheets.values.append({
      range: "Inquiries!A:R",
      requestBody: {
        values: [[...row]]
      },
      spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
      valueInputOption: "USER_ENTERED"
    });

    return "saved";
  }

  if (env.GOOGLE_SHEETS_WEBHOOK_URL) {
    await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
      body: JSON.stringify({
        referenceNumber: context.referenceNumber,
        row,
        source: inquiry.source
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    return "saved";
  }

  return "not-configured";
}
