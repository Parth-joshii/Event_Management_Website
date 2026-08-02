import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PhotoModel } from "@/models/Photo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/photos - Fetch all photos from MongoDB */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    const photos = await PhotoModel.find({}).sort({ createdAt: -1 }).lean();

    const formatted = photos.map((p) => ({
      id: String(p._id),
      title: p.title,
      category: p.category,
      eventId: p.eventId || "",
      eventTitle: p.eventTitle || "",
      imageSrc: p.imageSrc,
      alt: p.alt || p.title
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch photos";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/photos - Add new single photo or multiple photos array to MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    const body = await request.json();

    // Handle array of photos
    if (Array.isArray(body)) {
      if (db) {
        const docs = body.map((item) => ({
          title: item.title || "Gallery Photo",
          category: item.category || "General",
          eventId: item.eventId || "",
          eventTitle: item.eventTitle || "",
          imageSrc: item.imageSrc,
          alt: item.alt || item.title || "Gallery Photo"
        }));
        await PhotoModel.insertMany(docs);
      }
      return NextResponse.json({ ok: true, message: "Multiple photos uploaded successfully" });
    }

    // Handle single photo
    if (!body.title || !body.imageSrc) {
      return NextResponse.json({ ok: false, message: "Title and imageSrc are required" }, { status: 400 });
    }

    let createdId = `photo-${Date.now()}`;
    if (db) {
      const newPhoto = await PhotoModel.create({
        title: body.title,
        category: body.category || "General",
        eventId: body.eventId || "",
        eventTitle: body.eventTitle || "",
        imageSrc: body.imageSrc,
        alt: body.alt || body.title
      });
      createdId = String(newPhoto._id);
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: createdId,
        title: body.title,
        category: body.category || "General",
        eventId: body.eventId || "",
        eventTitle: body.eventTitle || "",
        imageSrc: body.imageSrc,
        alt: body.alt || body.title
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/photos?id=xyz OR DELETE /api/photos?all=true - Delete photo(s) from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    const db = await connectToDatabase();

    if (deleteAll && db) {
      await PhotoModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All photos deleted successfully" });
    }

    if (!id) {
      return NextResponse.json({ ok: false, message: "Photo ID required" }, { status: 400 });
    }

    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await PhotoModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Photo deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
