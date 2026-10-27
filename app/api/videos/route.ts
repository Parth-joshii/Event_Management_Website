import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

let globalVideosStore = [
  {
    id: "vid-1",
    title: "Luxury Event Celebration Hero",
    category: "Hero",
    videoSrc: "/videos/landing-page.mp4",
    posterSrc: "",
    description: "Main background video for landing page hero section"
  }
];

/** GET /api/videos - Fetch all videos */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, data: globalVideosStore });
}

/** POST /api/videos - Add new video */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};

    if (!body.title || !body.videoSrc) {
      return NextResponse.json({ ok: false, message: "Title and videoSrc are required" }, { status: 400 });
    }

    const newVideo = {
      id: body.id || `video-${Date.now()}`,
      title: body.title,
      category: body.category || "Hero",
      videoSrc: convertDriveUrlToDirectLink(body.videoSrc),
      posterSrc: body.posterSrc ? convertDriveUrlToDirectLink(body.posterSrc) : "",
      description: body.description || ""
    };

    globalVideosStore = [newVideo, ...globalVideosStore];
    return NextResponse.json({ ok: true, data: newVideo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create video";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/videos?id=xyz - Delete video */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      globalVideosStore = globalVideosStore.filter((v) => v.id !== id);
    }

    return NextResponse.json({ ok: true, message: "Video deleted successfully" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete video" }, { status: 500 });
  }
}
