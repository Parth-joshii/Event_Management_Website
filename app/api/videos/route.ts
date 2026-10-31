import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VideoModel } from "@/models/Video";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DEFAULT_CDN_HERO_VIDEO =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.mp4";
const DEFAULT_CDN_HERO_POSTER =
  "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.jpg";

const defaultVideos = [
  {
    id: "vid-1",
    title: "Luxury Event Celebration Hero",
    category: "Hero",
    videoSrc: DEFAULT_CDN_HERO_VIDEO,
    posterSrc: DEFAULT_CDN_HERO_POSTER,
    description: "Main background video for landing page hero section served via Cloudinary Video CDN"
  }
];

function serializeVideo(v: any) {
  return {
    id: v._id?.toString?.() || v.id || `vid-${Date.now()}`,
    title: v.title,
    category: v.category || "Hero",
    videoSrc: v.videoSrc,
    posterSrc: v.posterSrc || "",
    description: v.description || ""
  };
}

/** GET /api/videos - Fetch all videos */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const dbVideos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();
    if (dbVideos && dbVideos.length > 0) {
      return NextResponse.json({ ok: true, data: dbVideos.map(serializeVideo) });
    }
  } catch (err) {
    console.warn("MongoDB videos fetch warning, falling back to CDN default:", err);
  }

  return NextResponse.json({ ok: true, data: defaultVideos });
}

/** POST /api/videos - Add new video and auto-upload to Cloudinary Video CDN */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};

    if (!body.title || !body.videoSrc) {
      return NextResponse.json({ ok: false, message: "Title and videoSrc are required" }, { status: 400 });
    }

    const rawSrc = convertDriveUrlToDirectLink(body.videoSrc);
    let finalVideoSrc = rawSrc;
    let finalPosterSrc = body.posterSrc ? convertDriveUrlToDirectLink(body.posterSrc) : "";

    // If video is not yet on Cloudinary CDN, auto-import to Cloudinary Video CDN
    if (rawSrc && !rawSrc.includes("res.cloudinary.com") && isCloudinaryConfigured()) {
      try {
        const uploadRes = await cloudinary.uploader.upload(rawSrc, {
          resource_type: "video",
          folder: "shree_velora/videos"
        });
        if (uploadRes?.secure_url) {
          finalVideoSrc = uploadRes.secure_url;
          if (!finalPosterSrc) {
            finalPosterSrc = uploadRes.secure_url.replace(/\.[^/.]+$/, ".jpg");
          }
        }
      } catch (cloudErr) {
        console.warn("Could not auto-import video to Cloudinary Video CDN:", cloudErr);
      }
    }

    const newVideo = {
      id: body.id || `video-${Date.now()}`,
      title: body.title,
      category: body.category || "Hero",
      videoSrc: finalVideoSrc,
      posterSrc: finalPosterSrc,
      description: body.description || ""
    };

    try {
      await connectToDatabase();
      const doc = await VideoModel.create(newVideo);
      if (doc) {
        return NextResponse.json({ ok: true, data: serializeVideo(doc) });
      }
    } catch (mongoErr) {
      console.warn("MongoDB video create warning:", mongoErr);
    }

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
      try {
        await connectToDatabase();
        await VideoModel.findByIdAndDelete(id).catch(() => null);
      } catch (err) {
        console.warn("MongoDB video delete error:", err);
      }
    }

    return NextResponse.json({ ok: true, message: "Video deleted successfully" });
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to delete video" }, { status: 500 });
  }
}
