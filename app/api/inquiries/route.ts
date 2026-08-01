import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { InquiryModel } from "@/models/Inquiry";
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

/** GET /api/inquiries - Fetch all client inquiries from MongoDB for Admin Panel */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    const inquiries = await InquiryModel.find({}).sort({ createdAt: -1 }).lean();
    const formatted = inquiries.map((inq) => ({
      id: String(inq._id),
      fullName: inq.fullName,
      email: inq.email,
      phone: inq.phone,
      eventType: inq.eventType,
      eventDate: inq.eventDate || "",
      budget: inq.budget || 500000,
      specialRequirements: inq.specialRequirements || "",
      createdAt: inq.createdAt ? inq.createdAt.toISOString() : new Date().toISOString(),
      status: inq.status || "New"
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch inquiries";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/inquiries - Accepts validated public inquiries & saves to MongoDB */
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

    // Connect & save to MongoDB
    const db = await connectToDatabase();
    if (db) {
      await InquiryModel.create({
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        eventType: inquiry.eventType,
        eventDate: inquiry.eventDate,
        budget: inquiry.budget,
        specialRequirements: inquiry.specialRequirements,
        status: "New"
      });
    }

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

/** PUT /api/inquiries - Update inquiry status in MongoDB */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, message: "ID and status required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await InquiryModel.findByIdAndUpdate(id, { status });
    }

    return NextResponse.json({ ok: true, message: "Inquiry status updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update inquiry";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/inquiries?id=xyz - Delete inquiry from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Inquiry ID required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await InquiryModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete inquiry";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
