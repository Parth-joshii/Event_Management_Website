import { NextResponse, type NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  getCloudinaryCloudName
} from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Vercel serverless functions strictly enforce a 4.5 MB (4,718,592 bytes) request body limit.
const VERCEL_MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024;

/**
 * GET /api/upload
 * Returns whether Cloudinary is configured, active cloud name, and payload limits.
 */
export async function GET(): Promise<NextResponse> {
  const configured = isCloudinaryConfigured();
  return NextResponse.json({
    ok: true,
    cloudinary: {
      configured,
      cloudName: getCloudinaryCloudName()
    },
    limits: {
      vercelMaxPayloadBytes: VERCEL_MAX_PAYLOAD_BYTES,
      recommendedClientLimitBytes: 3.8 * 1024 * 1024
    }
  });
}

/**
 * POST /api/upload
 * Handles image and video uploads directly to Cloudinary CDN.
 * Validates payload against Vercel's limit and delivers assets to Cloudinary.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ ok: false, message: "Invalid or empty upload payload" }, { status: 400 });
    }
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) || "shree_velora/gallery";
    const category = (formData.get("category") as string | null) || undefined;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
    }

    // Safety guard against Vercel payload ceiling
    if (file.size > VERCEL_MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          message: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds Vercel's 4.5 MB limit. Please compress on client before upload.`
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo =
      file.type.startsWith("video/") ||
      file.name.endsWith(".mp4") ||
      file.name.endsWith(".webm");

    // 1. Primary path: Upload directly to Cloudinary CDN
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadBufferToCloudinary(buffer, {
          folder,
          resourceType: isVideo ? "video" : "image",
          tags: ["shree_velora", ...(category ? [category] : [])]
        });

        return NextResponse.json({
          ok: true,
          url: result.secureUrl,
          publicId: result.publicId,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          storage: "cloudinary",
          isVideo,
          message: "Uploaded to Cloudinary successfully"
        });
      } catch (cloudErr) {
        console.error("Cloudinary upload failed:", cloudErr);
        const errMsg = cloudErr instanceof Error ? cloudErr.message : "Cloudinary upload failed";
        return NextResponse.json(
          {
            ok: false,
            message: `Cloudinary upload error: ${errMsg}. Check your CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_CLOUD_NAME.`
          },
          { status: 500 }
        );
      }
    }

    // 2. Development offline fallback only (never on Vercel production)
    const isVercel = Boolean(process.env.VERCEL);
    const isProduction = process.env.NODE_ENV === "production";

    if (!isVercel && !isProduction) {
      try {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const subDir = isVideo ? ["public", "videos", "portfolio"] : ["public", "images", "gallery"];
        const uploadDir = join(process.cwd(), ...subDir);
        await mkdir(uploadDir, { recursive: true });
        const filePath = join(uploadDir, safeName);
        await writeFile(filePath, buffer);

        return NextResponse.json({
          ok: true,
          url: isVideo ? `/videos/portfolio/${safeName}` : `/images/gallery/${safeName}`,
          isVideo,
          storage: "local",
          message: "Saved locally (dev mode fallback). Configure Cloudinary secrets in .env.local for Cloud CDN."
        });
      } catch (localErr) {
        console.error("Local file save error:", localErr);
      }
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables (.env.local or Vercel dashboard)."
      },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
