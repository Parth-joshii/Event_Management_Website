import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { getCloudData, saveCloudData } from "@/lib/cloud-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/events - Fetch all events synced across all browsers */
export async function GET(): Promise<NextResponse> {
  const cloud = await getCloudData();
  return NextResponse.json({ ok: true, data: cloud.events });
}

/** POST /api/events - Add new event & sync live */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const cloud = await getCloudData();

    if (!body || !body.title || !body.description || !body.imageSrc) {
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

    const updatedEvents = [newEvent, ...cloud.events];
    await saveCloudData({ events: updatedEvents });

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
    const cloud = await getCloudData();

    if (deleteAll) {
      await saveCloudData({ events: [] });
      return NextResponse.json({ ok: true, message: "All events deleted" });
    }

    if (id) {
      const updatedEvents = cloud.events.filter((ev) => ev.id !== id);
      await saveCloudData({ events: updatedEvents });
    }

    return NextResponse.json({ ok: true, message: "Event deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete event" }, { status: 500 });
  }
}
