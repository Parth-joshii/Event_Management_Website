import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

let globalPhotosStore: Array<{
  id: string;
  title: string;
  category: string;
  eventId?: string;
  eventTitle?: string;
  isFeatured?: boolean;
  imageSrc: string;
  alt: string;
}> = [];

/** GET /api/photos - Fetch all photos */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, data: globalPhotosStore });
}

/** POST /api/photos - Add new photo or array of Google Drive photos */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Handle array of photos
    if (Array.isArray(body)) {
      const formatted = body.map((item, idx) => ({
        id: item.id || `ph-${Date.now()}-${idx}`,
        title: item.title || "Gallery Photo",
        category: item.category || "General",
        eventId: item.eventId || "",
        eventTitle: item.eventTitle || "",
        isFeatured: Boolean(item.isFeatured),
        imageSrc: convertDriveUrlToDirectLink(item.imageSrc || ""),
        alt: item.alt || item.title || "Gallery Photo"
      }));

      globalPhotosStore = [...formatted, ...globalPhotosStore];
      return NextResponse.json({ ok: true, message: "Photos saved to Google Drive store", data: formatted });
    }

    // Handle single photo
    if (!body.imageSrc) {
      return NextResponse.json({ ok: false, message: "imageSrc is required" }, { status: 400 });
    }

    const newPhoto = {
      id: body.id || `ph-${Date.now()}`,
      title: body.title || "Gallery Photo",
      category: body.category || "General",
      eventId: body.eventId || "",
      eventTitle: body.eventTitle || "",
      isFeatured: Boolean(body.isFeatured),
      imageSrc: convertDriveUrlToDirectLink(body.imageSrc),
      alt: body.alt || body.title || "Gallery Photo"
    };

    globalPhotosStore = [newPhoto, ...globalPhotosStore];
    return NextResponse.json({ ok: true, data: newPhoto });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save photo";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** PUT /api/photos - Toggle featured photo status */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, isFeatured } = body;

    globalPhotosStore = globalPhotosStore.map((ph) =>
      ph.id === id ? { ...ph, isFeatured: Boolean(isFeatured) } : ph
    );

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

    if (deleteAll) {
      globalPhotosStore = [];
      return NextResponse.json({ ok: true, message: "All photos cleared" });
    }

    if (id) {
      globalPhotosStore = globalPhotosStore.filter((ph) => ph.id !== id);
    }

    return NextResponse.json({ ok: true, message: "Photo deleted" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete photo" }, { status: 500 });
  }
}
