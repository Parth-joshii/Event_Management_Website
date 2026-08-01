import { NextResponse, type NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

/** Handles image and video file uploads. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".webm");

    const subDir = isVideo ? ["public", "videos", "portfolio"] : ["public", "images", "gallery"];
    const uploadDir = join(process.cwd(), ...subDir);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const publicUrl = isVideo ? `/videos/portfolio/${safeName}` : `/images/gallery/${safeName}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      isVideo,
      message: "File uploaded successfully"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
