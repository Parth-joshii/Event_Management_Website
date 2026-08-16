import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink, isDriveImageUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** Proxies Google Drive image URLs so browser previews work consistently. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const resolvedUrl = convertDriveUrlToDirectLink(rawUrl);

  if (!resolvedUrl || !isDriveImageUrl(resolvedUrl)) {
    return NextResponse.json({ ok: false, message: "Invalid image URL" }, { status: 400 });
  }

  try {
    const upstream = await fetch(resolvedUrl, {
      redirect: "follow",
      cache: "no-store"
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, message: `Upstream image request failed (${upstream.status})` },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "Resolved URL did not return an image" },
        { status: 502 }
      );
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image proxy failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
