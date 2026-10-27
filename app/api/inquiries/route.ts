import { NextResponse, type NextRequest } from "next/server";
import { inquirySchema } from "@/features/customizer/validation/inquiry-schema";
import { createReferenceNumber } from "@/services/server/reference-number";
import { sendInquiryEmails } from "@/services/server/email.server";
import { saveInquiryToGoogleSheets } from "@/services/server/google-sheets.server";
import type { InquiryResponse } from "@/types/inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

let globalInquiriesStore: Array<{
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: number;
  specialRequirements?: string;
  createdAt: string;
  status: "New" | "Contacted" | "Confirmed";
}> = [];

function getIpAddress(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "Unavailable"
  );
}

/** GET /api/inquiries - Fetch all inquiries */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, data: globalInquiriesStore });
}

/** POST /api/inquiries - Accepts validated public inquiries & saves to Google Sheets & Email */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = (await request.json().catch(() => null)) || {};
    const inquiry = inquirySchema.parse(payload);
    const referenceNumber = createReferenceNumber();
    const context = {
      ipAddress: getIpAddress(request),
      referenceNumber,
      userAgent: request.headers.get("user-agent") ?? "Unavailable"
    };

    const newInquiry = {
      id: `inq-${Date.now()}`,
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      eventType: inquiry.eventType,
      eventDate: inquiry.eventDate,
      budget: inquiry.budget,
      specialRequirements: inquiry.specialRequirements || "",
      createdAt: new Date().toISOString(),
      status: "New" as const
    };

    globalInquiriesStore = [newInquiry, ...globalInquiriesStore];

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

/** PUT /api/inquiries - Update inquiry status */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};
    const { id, status } = body;

    globalInquiriesStore = globalInquiriesStore.map((inq) =>
      inq.id === id ? { ...inq, status } : inq
    );

    return NextResponse.json({ ok: true, message: "Inquiry status updated" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to update inquiry" }, { status: 500 });
  }
}

/** DELETE /api/inquiries?id=xyz - Delete inquiry */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      globalInquiriesStore = globalInquiriesStore.filter((inq) => inq.id !== id);
    }

    return NextResponse.json({ ok: true, message: "Inquiry deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete inquiry" }, { status: 500 });
  }
}
