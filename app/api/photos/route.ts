import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PhotoModel } from "@/models/Photo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/photos - Fetch all photos from MongoDB, sorted by featured status first */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { ok: false, message: "MongoDB connection failed. Check MONGODB_URI environment variable.", data: [] },
        { status: 500 }
      );
    }

    const photos = await PhotoModel.find({}).sort({ isFeatured: -1, createdAt: -1 }).lean();

    const formatted = photos.map((p) => ({
      id: String(p._id),
      title: p.title,
      category: p.category,
      eventId: p.eventId || "",
      eventTitle: p.eventTitle || "",
      isFeatured: Boolean(p.isFeatured),
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
    if (!db) {
      return NextResponse.json(
        { ok: false, message: "MongoDB connection failed. Check MONGODB_URI environment variable." },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Handle array of photos
    if (Array.isArray(body)) {
      const docs = body.map((item) => ({
        title: item.title || "Gallery Photo",
        category: item.category || "General",
        eventId: item.eventId || "",
        eventTitle: item.eventTitle || "",
        isFeatured: Boolean(item.isFeatured),
        imageSrc: item.imageSrc,
        alt: item.alt || item.title || "Gallery Photo"
      }));
      const inserted = await PhotoModel.insertMany(docs);
      const insertedFormatted = inserted.map((p) => ({
        id: String(p._id),
        title: p.title,
        category: p.category,
        eventId: p.eventId || "",
        eventTitle: p.eventTitle || "",
        isFeatured: Boolean(p.isFeatured),
        imageSrc: p.imageSrc,
        alt: p.alt || p.title
      }));
      return NextResponse.json({ ok: true, message: "Multiple photos uploaded successfully", data: insertedFormatted });
    }

    // Handle single photo
    if (!body.title || !body.imageSrc) {
      return NextResponse.json({ ok: false, message: "Title and imageSrc are required" }, { status: 400 });
    }

    const newPhoto = await PhotoModel.create({
      title: body.title,
      category: body.category || "General",
      eventId: body.eventId || "",
      eventTitle: body.eventTitle || "",
      isFeatured: Boolean(body.isFeatured),
      imageSrc: body.imageSrc,
      alt: body.alt || body.title
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: String(newPhoto._id),
        title: newPhoto.title,
        category: newPhoto.category,
        eventId: newPhoto.eventId || "",
        eventTitle: newPhoto.eventTitle || "",
        isFeatured: Boolean(newPhoto.isFeatured),
        imageSrc: newPhoto.imageSrc,
        alt: newPhoto.alt || newPhoto.title
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** PUT /api/photos - Update photo featured/cover status in MongoDB */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, isFeatured } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "Photo ID required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, message: "MongoDB connection failed" }, { status: 500 });
    }

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await PhotoModel.findByIdAndUpdate(id, { isFeatured: Boolean(isFeatured) });
    }

    return NextResponse.json({ ok: true, message: "Photo featured status updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update photo";
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
    if (!db) {
      return NextResponse.json({ ok: false, message: "MongoDB connection failed" }, { status: 500 });
    }

    if (deleteAll) {
      await PhotoModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All photos deleted successfully" });
    }

    if (!id) {
      return NextResponse.json({ ok: false, message: "Photo ID required" }, { status: 400 });
    }

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await PhotoModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Photo deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
