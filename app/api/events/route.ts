import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EventModel } from "@/models/Event";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { getCloudData, saveCloudData } from "@/lib/cloud-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function serializeEvent(ev: any) {
  return {
    id: ev._id?.toString?.() || ev.id || "",
    title: ev.title,
    category: ev.category || "Luxury Wedding",
    description: ev.description || "",
    date: ev.date || "",
    location: ev.location || "India",
    imageSrc: ev.imageSrc,
    imageAlt: ev.imageAlt || ev.title
  };
}

const defaultCloudinaryEvents = [
  {
    id: "event-cdn-1",
    title: "Grand Palace Royal Wedding",
    category: "Luxury Wedding",
    description: "Multi-day royal palace wedding curation with customized lighting, mandap, and orchestral management.",
    date: "2026-02-14",
    location: "Udaipur / Jaipur",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125961/shree_velora/events/o2mqlwi6fcttlsborqme.jpg",
    imageAlt: "Grand Palace Royal Wedding"
  },
  {
    id: "event-cdn-2",
    title: "Celebration Sangeet & Musical Night",
    category: "Sangeet",
    description: "High-octane sound, moving beams, LED staging, and celebrity performance coordination.",
    date: "2026-03-20",
    location: "Mumbai",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125293/shree_velora/events/fjj93bilnqooccvcudo0.jpg",
    imageAlt: "Celebration Sangeet & Musical Night"
  },
  {
    id: "event-cdn-3",
    title: "Golden Reception Banquet",
    category: "Reception",
    description: "Mirrored tables, candlelight pathways, and customized floral chandeliers for 1,200 esteemed guests.",
    date: "2026-04-10",
    location: "Delhi NCR",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125082/shree_velora/events/mapbmbkq6ekzrnmycbbg.jpg",
    imageAlt: "Golden Reception Banquet"
  },
  {
    id: "event-cdn-4",
    title: "Intimate Traditional Haldi & Mehndi",
    category: "Haldi & Mehndi",
    description: "Curated marigold canopy, brass detailing, and traditional folk music ensemble.",
    date: "2026-05-02",
    location: "Goa",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125058/shree_velora/events/rpbat0ealtpbpe1iazfu.jpg",
    imageAlt: "Intimate Traditional Haldi & Mehndi"
  }
];

/** GET /api/events - Fetch all events synced across all browsers & MongoDB */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const events = await EventModel.find({}).sort({ createdAt: -1 }).lean();
    if (events && events.length > 0) {
      return NextResponse.json({ ok: true, data: events.map(serializeEvent) });
    }
  } catch (dbErr) {
    console.warn("MongoDB events read fallback:", dbErr);
  }

  const cloud = await getCloudData().catch(() => null);
  if (cloud?.events && cloud.events.length > 0) {
    return NextResponse.json({ ok: true, data: cloud.events });
  }

  return NextResponse.json({ ok: true, data: defaultCloudinaryEvents });
}

/** POST /api/events - Add new event & sync live */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.title || !body.description || !body.imageSrc) {
      return NextResponse.json(
        { ok: false, message: "Title, description, and imageSrc are required" },
        { status: 400 }
      );
    }

    const directSrc = convertDriveUrlToDirectLink(body.imageSrc);

    let createdId = body.id || `event-${Date.now()}`;
    let newEventObj: any = {
      id: createdId,
      title: body.title,
      category: body.category || "Luxury Wedding",
      description: body.description,
      date: body.date || "2026-09-01",
      location: body.location || "India",
      imageSrc: directSrc,
      imageAlt: body.imageAlt || body.title
    };

    try {
      await connectToDatabase();
      const doc = await EventModel.create({
        title: body.title,
        category: body.category || "Luxury Wedding",
        description: body.description,
        date: body.date || "2026-09-01",
        location: body.location || "India",
        imageSrc: directSrc,
        imageAlt: body.imageAlt || body.title
      });
      if (doc) {
        newEventObj = serializeEvent(doc);
      }
    } catch (mongoErr) {
      console.warn("MongoDB event create warning:", mongoErr);
    }

    // Dual-persist to cloud
    try {
      const cloud = await getCloudData().catch(() => null);
      const currentEvents = cloud?.events || [];
      await saveCloudData({ events: [newEventObj, ...currentEvents] });
    } catch (cloudErr) {
      console.warn("Cloud sync write warning:", cloudErr);
    }

    return NextResponse.json({ ok: true, data: newEventObj });
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

    try {
      await connectToDatabase();
      if (deleteAll) {
        await EventModel.deleteMany({});
      } else if (id) {
        await EventModel.findByIdAndDelete(id).catch(() => null);
      }
    } catch (dbErr) {
      console.warn("MongoDB event delete warning:", dbErr);
    }

    const cloud = await getCloudData().catch(() => null);
    if (deleteAll) {
      await saveCloudData({ events: [] });
      return NextResponse.json({ ok: true, message: "All events deleted" });
    }

    if (id && cloud?.events) {
      const updatedEvents = cloud.events.filter((ev) => ev.id !== id);
      await saveCloudData({ events: updatedEvents });
    }

    return NextResponse.json({ ok: true, message: "Event deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete event" }, { status: 500 });
  }
}
