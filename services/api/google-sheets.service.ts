import { env } from "@/config/env";
import { apiRequest } from "@/services/http-client";

export interface GoogleSheetsPayload {
  readonly sheet: string;
  readonly submittedAt?: string;
  readonly values: Record<string, unknown>;
}

export interface GoogleSheetsResponse {
  readonly id?: string;
  readonly ok: boolean;
}

/** Submits normalized row data to a configured Google Sheets webhook. */
export async function submitGoogleSheetsRow(
  payload: GoogleSheetsPayload
): Promise<GoogleSheetsResponse> {
  if (!env.GOOGLE_SHEETS_WEBHOOK_URL) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.");
  }

  return apiRequest<GoogleSheetsResponse, GoogleSheetsPayload>(
    env.GOOGLE_SHEETS_WEBHOOK_URL,
    {
      body: {
        ...payload,
        submittedAt: payload.submittedAt ?? new Date().toISOString()
      },
      method: "POST"
    }
  );
}
