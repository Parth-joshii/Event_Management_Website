import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

let globalEventsStore: Array<{
  id: string;
  title: string;
  category: string;
  description: string;
  date?: string;
  location?: string;
  imageSrc: string;
  imageAlt?: string;
}> = [];

/** GET /api/events - Fetch all events */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, data: globalEventsStore });
}

/** POST /api/events - Add new event */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.imageSrc) {
      return NextResponse.json(
        { ok: false, message: "Title, description, and imageSrc are required" },
        { status: 400 }
      );
    }

    const newEvent = {
      id: body.id || `event-${Date.now()}`,
      title: body.title,
      category: body.category || "Luxury Wedding",
      description: body.description,
      date: body.date || "2026-09-01",
      location: body.location || "India",
      imageSrc: convertDriveUrlToDirectLink(body.imageSrc),
      imageAlt: body.imageAlt || body.title
    };

    globalEventsStore = [newEvent, ...globalEventsStore];
    return NextResponse.json({ ok: true, data: newEvent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/events - Delete event(s) */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      globalEventsStore = [];
      return NextResponse.json({ ok: true, message: "All events deleted" });
    }

    if (id) {
      globalEventsStore = globalEventsStore.filter((ev) => ev.id !== id);
    }

    return NextResponse.json({ ok: true, message: "Event deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete event" }, { status: 500 });
  }
}
