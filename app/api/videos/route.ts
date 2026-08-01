import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VideoModel } from "@/models/Video";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const defaultSeedVideos = [
  {
    title: "Luxury Event Celebration Hero",
    category: "Hero",
    videoSrc: "/videos/landing-page.mp4",
    posterSrc: "",
    description: "Main background video for landing page hero section"
  }
];

/** GET /api/videos - Fetch all videos from MongoDB with auto-seeding if empty */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    let videos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed initial videos if database collection is empty
    if (videos.length === 0 && defaultSeedVideos.length > 0) {
      await VideoModel.insertMany(defaultSeedVideos);
      videos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();
    }

    const formatted = videos.map((v) => ({
      id: String(v._id),
      title: v.title,
      category: v.category,
      videoSrc: v.videoSrc,
      posterSrc: v.posterSrc || "",
      description: v.description || ""
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch videos";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/videos - Add new video to MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.videoSrc) {
      return NextResponse.json({ ok: false, message: "Title and videoSrc are required" }, { status: 400 });
    }

    let createdId = `video-${Date.now()}`;
    if (db) {
      const newVideo = await VideoModel.create({
        title: body.title,
        category: body.category || "Hero",
        videoSrc: body.videoSrc,
        posterSrc: body.posterSrc || "",
        description: body.description || ""
      });
      createdId = String(newVideo._id);
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: createdId,
        title: body.title,
        category: body.category || "Hero",
        videoSrc: body.videoSrc,
        posterSrc: body.posterSrc || "",
        description: body.description || ""
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create video";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/videos?id=xyz - Delete video from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Video ID required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db && id.match(/^[0-9a-fA-F]{24}$/)) {
      await VideoModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Video deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete video";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
