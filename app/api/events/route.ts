import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EventModel } from "@/models/Event";
import { eventCategories } from "@/features/events/data/event-categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/events - Fetch all events from MongoDB with auto-seeding if empty */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    let events = await EventModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed initial events if database collection is empty
    if (events.length === 0 && eventCategories.length > 0) {
      const seedData = eventCategories.map((item) => ({
        title: item.title,
        category: item.title,
        description: item.description,
        date: "2026-08-15",
        location: "India",
        imageSrc: item.imageSrc,
        imageAlt: item.imageAlt
      }));
      await EventModel.insertMany(seedData);
      events = await EventModel.find({}).sort({ createdAt: -1 }).lean();
    }

    const formatted = events.map((ev) => ({
      id: String(ev._id),
      title: ev.title,
      category: ev.category,
      description: ev.description,
      date: ev.date || "2026-08-15",
      location: ev.location || "India",
      imageSrc: ev.imageSrc,
      imageAlt: ev.imageAlt || ev.title
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch events";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/events - Add new event to MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.description || !body.imageSrc) {
      return NextResponse.json(
        { ok: false, message: "Title, description, and imageSrc are required" },
        { status: 400 }
      );
    }

    let createdId = `event-${Date.now()}`;
    if (db) {
      const newEvent = await EventModel.create({
        title: body.title,
        category: body.category || "Luxury Wedding",
        description: body.description,
        date: body.date || "2026-09-01",
        location: body.location || "India",
        imageSrc: body.imageSrc,
        imageAlt: body.imageAlt || body.title
      });
      createdId = String(newEvent._id);
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: createdId,
        title: body.title,
        category: body.category || "Luxury Wedding",
        description: body.description,
        date: body.date || "2026-09-01",
        location: body.location || "India",
        imageSrc: body.imageSrc,
        imageAlt: body.imageAlt || body.title
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/events?id=xyz - Delete event from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Event ID required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await EventModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Event deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
