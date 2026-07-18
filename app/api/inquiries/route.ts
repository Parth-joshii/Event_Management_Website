import { NextResponse, type NextRequest } from "next/server";
import { inquirySchema } from "@/features/customizer/validation/inquiry-schema";
import { createReferenceNumber } from "@/services/server/reference-number";
import { sendInquiryEmails } from "@/services/server/email.server";
import { saveInquiryToGoogleSheets } from "@/services/server/google-sheets.server";
import type { InquiryResponse } from "@/types/inquiry";

export const runtime = "nodejs";

function getIpAddress(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "Unavailable"
  );
}

/** Accepts validated public inquiries and forwards them to configured integrations. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await request.json();
    const inquiry = inquirySchema.parse(payload);
    const referenceNumber = createReferenceNumber();
    const context = {
      ipAddress: getIpAddress(request),
      referenceNumber,
      userAgent: request.headers.get("user-agent") ?? "Unavailable"
    };

    const [googleSheetsStatus, emailStatus] = await Promise.all([
      saveInquiryToGoogleSheets(inquiry, context),
      sendInquiryEmails(inquiry, { referenceNumber })
    ]);

    const response: InquiryResponse = {
      emailStatus,
      googleSheetsStatus,
      message: "Inquiry submitted successfully.",
      ok: true,
      referenceNumber
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The inquiry could not be submitted.";

    return NextResponse.json(
      {
        message,
        ok: false
      },
      { status: 400 }
    );
  }
}
