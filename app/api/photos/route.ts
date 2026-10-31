import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { dedupePhotosByImageSrc } from "@/lib/photo-utils";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { deleteFromCloudinary, extractCloudinaryPublicId, cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { PhotoModel } from "@/models/Photo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const defaultCloudinaryPhotos = [
  {
    id: "photo-cdn-1",
    title: "Luxury Mandap Ceremony",
    category: "Wedding",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126449/shree_velora/gallery/xaliutr0efuaabmv6svt.jpg",
    alt: "Luxury Mandap Ceremony",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-2",
    title: "Royal Grand Stage Decor",
    category: "Wedding",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126367/shree_velora/gallery/cmputxcgdjsl7cxzg5zt.jpg",
    alt: "Royal Grand Stage Decor",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-3",
    title: "Atmospheric Candlelight Banquet",
    category: "Reception",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126363/shree_velora/gallery/zcxilfdmfoz84szbqmwj.jpg",
    alt: "Atmospheric Candlelight Banquet",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-4",
    title: "Floral Ceiling Installation",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126360/shree_velora/gallery/oqn3j3ufct2ct7paes3p.jpg",
    alt: "Floral Ceiling Installation",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-5",
    title: "Golden Sangeet Celebration",
    category: "Sangeet",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125774/shree_velora/gallery/ncqdipt7pfj1iyy5frar.jpg",
    alt: "Golden Sangeet Celebration",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-6",
    title: "Signature Floral Archway",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125772/shree_velora/gallery/fhhdpkbgbsdifycy1ffc.jpg",
    alt: "Signature Floral Archway",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-7",
    title: "Opulent Crystal Reception Setup",
    category: "Reception",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125767/shree_velora/gallery/s3atwoby6zs9sqswzwsj.jpg",
    alt: "Opulent Crystal Reception Setup",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-8",
    title: "Ambient Evening Lighting",
    category: "Lighting",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125764/shree_velora/gallery/fiwymz8hhvmkkqutbf2l.jpg",
    alt: "Ambient Evening Lighting",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-9",
    title: "Sunlit Haldi Traditional Courtyard",
    category: "Haldi",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125762/shree_velora/gallery/gc5rcprgzvuerpjryexr.jpg",
    alt: "Sunlit Haldi Traditional Courtyard",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-10",
    title: "Mehndi Lounge Seating",
    category: "Mehndi",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125759/shree_velora/gallery/b9wr20tbethfq6eesijr.jpg",
    alt: "Mehndi Lounge Seating",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-11",
    title: "Grand Entrance Walkway",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125758/shree_velora/gallery/c9mnofumdoz6m5plamvi.jpg",
    alt: "Grand Entrance Walkway",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-12",
    title: "Devotional Spiritual Stage",
    category: "Religious",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125756/shree_velora/gallery/dvyhcjddvshljrxm8hdt.jpg",
    alt: "Devotional Spiritual Stage",
    isFeatured: false,
    storage: "cloudinary"
  }
];

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

/** GET /api/photos - Fetch photos from MongoDB with Cloudinary CDN fallback */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const photos = await PhotoModel.find({}).sort({ isFeatured: -1, createdAt: -1 }).lean();

    if (photos && photos.length > 0) {
      return NextResponse.json({
        ok: true,
        data: dedupePhotosByImageSrc(photos.map((photo) => serializePhoto(photo)))
      });
    }
  } catch (error) {
    console.warn("MongoDB photos fetch fallback to Cloudinary CDN defaults:", error);
  }

  return NextResponse.json({
    ok: true,
    data: defaultCloudinaryPhotos
  });
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
    const src = searchParams.get("src");
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

    if (id || src) {
      let existing = null;
      if (id && mongoose.isValidObjectId(id)) {
        existing = await PhotoModel.findById(id).lean();
      }
      if (!existing && (src || id)) {
        existing = await PhotoModel.findOne({
          $or: [
            ...(src ? [{ imageSrc: src }] : []),
            ...(id ? [{ publicId: id }, { imageSrc: id }] : [])
          ]
        }).lean();
      }

      if (existing) {
        const pubId = existing.publicId || extractCloudinaryPublicId(existing.imageSrc);
        if (pubId) {
          await deleteFromCloudinary(pubId).catch(() => null);
        }
        await PhotoModel.deleteOne({ _id: existing._id });
      }
    }

    return NextResponse.json({ ok: true, message: "Photo deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
