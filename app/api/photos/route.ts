import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PhotoModel } from "@/models/Photo";
import { featuredGallery } from "@/features/gallery/data/featured-gallery";

export const runtime = "nodejs";

/** GET /api/photos - Fetch all photos from MongoDB with auto-seeding if empty */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    let photos = await PhotoModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed initial photos if database collection is empty
    if (photos.length === 0 && featuredGallery.length > 0) {
      const seedData = featuredGallery.map((item) => ({
        title: item.title,
        category: item.category,
        imageSrc: item.imageSrc,
        alt: item.alt
      }));
      await PhotoModel.insertMany(seedData);
      photos = await PhotoModel.find({}).sort({ createdAt: -1 }).lean();
    }

    const formatted = photos.map((p) => ({
      id: String(p._id),
      title: p.title,
      category: p.category,
      imageSrc: p.imageSrc,
      alt: p.alt || p.title
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch photos";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/photos - Add new photo to MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.imageSrc) {
      return NextResponse.json({ ok: false, message: "Title and imageSrc are required" }, { status: 400 });
    }

    let createdId = `photo-${Date.now()}`;
    if (db) {
      const newPhoto = await PhotoModel.create({
        title: body.title,
        category: body.category || "General",
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
        imageSrc: body.imageSrc,
        alt: body.alt || body.title
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/photos?id=xyz - Delete photo from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Photo ID required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await PhotoModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Photo deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
