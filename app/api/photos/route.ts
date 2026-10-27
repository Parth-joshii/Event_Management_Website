import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { dedupePhotosByImageSrc } from "@/lib/photo-utils";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { deleteFromCloudinary, extractCloudinaryPublicId } from "@/lib/cloudinary";
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
  publicId?: string;
  storage?: string;
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
  publicId?: string;
  storage?: string;
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
    alt: photo.alt || photo.title,
    publicId: photo.publicId || extractCloudinaryPublicId(photo.imageSrc) || "",
    storage: photo.storage || (photo.imageSrc.includes("cloudinary") ? "cloudinary" : "external")
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

  const directLink = convertDriveUrlToDirectLink(body.imageSrc);
  const detectedPublicId = body.publicId || extractCloudinaryPublicId(directLink) || "";
  const detectedStorage = body.storage || (directLink.includes("cloudinary") ? "cloudinary" : "external");

  await connectToDatabase();
  const photo = await PhotoModel.create({
    title: body.title || "Gallery Photo",
    category: body.category || "General",
    eventId: body.eventId || "",
    eventTitle: body.eventTitle || "",
    isFeatured: Boolean(body.isFeatured),
    imageSrc: directLink,
    alt: body.alt || body.title || "Gallery Photo",
    publicId: detectedPublicId,
    storage: detectedStorage
  });

  return NextResponse.json({ ok: true, data: serializePhoto(photo) });
}

async function saveBulkPhotos(body: PhotoPayload[]): Promise<NextResponse> {
  const formatted = dedupePhotosByImageSrc(body.map((item, idx) => {
    const directLink = convertDriveUrlToDirectLink(item.imageSrc || "");
    const detectedPublicId = item.publicId || extractCloudinaryPublicId(directLink) || "";
    const detectedStorage = item.storage || (directLink.includes("cloudinary") ? "cloudinary" : "external");

    return {
      title: item.title || `Gallery Photo ${idx + 1}`,
      category: item.category || "General",
      eventId: item.eventId || "",
      eventTitle: item.eventTitle || "",
      isFeatured: Boolean(item.isFeatured),
      imageSrc: directLink,
      alt: item.alt || item.title || "Gallery Photo",
      publicId: detectedPublicId,
      storage: detectedStorage
    };
  }));

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
    const body = (await request.json().catch(() => null)) as PhotoPayload | PhotoPayload[] | null;

    if (!body) {
      return NextResponse.json({ ok: false, message: "Invalid or empty JSON body" }, { status: 400 });
    }

    if (Array.isArray(body)) {
      return await saveBulkPhotos(body);
    }

    return await saveSinglePhoto(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** PUT /api/photos - Toggle featured photo status */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const { id, isFeatured } = (body || {}) as { id?: string; isFeatured?: boolean };

    if (!id) {
      return NextResponse.json({ ok: false, message: "id is required" }, { status: 400 });
    }

    await connectToDatabase();
    await PhotoModel.findByIdAndUpdate(id, { isFeatured: Boolean(isFeatured) });

    return NextResponse.json({ ok: true, message: "Photo updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}


/** DELETE /api/photos - Delete photo(s) and cleanup from Cloudinary */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    await connectToDatabase();

    if (deleteAll) {
      // Find all Cloudinary photos to delete assets if possible
      const allPhotos = await PhotoModel.find({}).lean();
      for (const p of allPhotos) {
        const pubId = p.publicId || extractCloudinaryPublicId(p.imageSrc);
        if (pubId) {
          await deleteFromCloudinary(pubId).catch(() => null);
        }
      }
      await PhotoModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All photos cleared" });
    }

    if (id) {
      const existing = await PhotoModel.findById(id).lean();
      if (existing) {
        const pubId = existing.publicId || extractCloudinaryPublicId(existing.imageSrc);
        if (pubId) {
          await deleteFromCloudinary(pubId).catch(() => null);
        }
        await PhotoModel.findByIdAndDelete(id);
      }
    }

    return NextResponse.json({ ok: true, message: "Photo deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete photo" }, { status: 500 });
  }
}
