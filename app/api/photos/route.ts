import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { dedupePhotosByImageSrc } from "@/lib/photo-utils";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { PhotoModel } from "@/models/Photo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type PhotoPayload = {
  id?: string;
  title?: string;
  category?: string;
  eventId?: string;
  eventTitle?: string;
  isFeatured?: boolean;
  imageSrc?: string;
  alt?: string;
};

function serializePhoto(photo: {
  _id?: { toString: () => string };
  id?: string;
  title: string;
  category: string;
  eventId?: string;
  eventTitle?: string;
  isFeatured?: boolean;
  imageSrc: string;
  alt: string;
  createdAt?: Date;
}) {
  return {
    id: photo._id?.toString?.() || photo.id || "",
    title: photo.title,
    category: photo.category,
    eventId: photo.eventId || "",
    eventTitle: photo.eventTitle || "",
    isFeatured: Boolean(photo.isFeatured),
    imageSrc: photo.imageSrc,
    alt: photo.alt || photo.title
  };
}

/** GET /api/photos - Fetch photos from MongoDB so every browser sees the same gallery */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const photos = await PhotoModel.find({}).sort({ isFeatured: -1, createdAt: -1 }).lean();

    return NextResponse.json({
      ok: true,
      data: dedupePhotosByImageSrc(photos.map((photo) => serializePhoto(photo)))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch photos";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

async function saveSinglePhoto(body: PhotoPayload): Promise<NextResponse> {
  if (!body.imageSrc) {
    return NextResponse.json({ ok: false, message: "imageSrc is required" }, { status: 400 });
  }

  await connectToDatabase();
  const photo = await PhotoModel.create({
    title: body.title || "Gallery Photo",
    category: body.category || "General",
    eventId: body.eventId || "",
    eventTitle: body.eventTitle || "",
    isFeatured: Boolean(body.isFeatured),
    imageSrc: convertDriveUrlToDirectLink(body.imageSrc),
    alt: body.alt || body.title || "Gallery Photo"
  });

  return NextResponse.json({ ok: true, data: serializePhoto(photo) });
}

async function saveBulkPhotos(body: PhotoPayload[]): Promise<NextResponse> {
  const formatted = dedupePhotosByImageSrc(body.map((item, idx) => ({
    title: item.title || `Gallery Photo ${idx + 1}`,
    category: item.category || "General",
    eventId: item.eventId || "",
    eventTitle: item.eventTitle || "",
    isFeatured: Boolean(item.isFeatured),
    imageSrc: convertDriveUrlToDirectLink(item.imageSrc || ""),
    alt: item.alt || item.title || "Gallery Photo"
  })));

  const validPhotos = formatted.filter((item) => item.imageSrc);
  if (validPhotos.length === 0) {
    return NextResponse.json({ ok: false, message: "At least one imageSrc is required" }, { status: 400 });
  }

  await connectToDatabase();
  const inserted = await PhotoModel.insertMany(validPhotos);

  return NextResponse.json({
    ok: true,
    message: "Photos saved successfully",
    data: dedupePhotosByImageSrc(inserted.map((photo) => serializePhoto(photo)))
  });
}

/** POST /api/photos - Add single or multiple photos and persist them for all browsers */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as PhotoPayload | PhotoPayload[];

    if (Array.isArray(body)) {
      return saveBulkPhotos(body);
    }

    return saveSinglePhoto(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** PUT /api/photos - Toggle featured photo status */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, isFeatured } = body as { id?: string; isFeatured?: boolean };

    if (!id) {
      return NextResponse.json({ ok: false, message: "id is required" }, { status: 400 });
    }

    await connectToDatabase();
    await PhotoModel.findByIdAndUpdate(id, { isFeatured: Boolean(isFeatured) });

    return NextResponse.json({ ok: true, message: "Photo updated" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to update photo" }, { status: 500 });
  }
}

/** DELETE /api/photos - Delete photo(s) */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    await connectToDatabase();

    if (deleteAll) {
      await PhotoModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All photos cleared" });
    }

    if (id) {
      await PhotoModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Photo deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete photo" }, { status: 500 });
  }
}
