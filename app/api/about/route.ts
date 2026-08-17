import { NextResponse, type NextRequest } from "next/server";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { getCloudData, saveCloudData } from "@/lib/cloud-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/about - Fetch synced about cards across all browsers */
export async function GET(): Promise<NextResponse> {
  const cloud = await getCloudData();
  return NextResponse.json({ ok: true, data: cloud.aboutCards || [] });
}

/** POST /api/about - Update an about card image and sync across all browsers */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, imageSrc } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "Card ID required" }, { status: 400 });
    }

    const cloud = await getCloudData();
    const currentCards = cloud.aboutCards || [
      { id: "bespoke-design", title: "Bespoke Design", description: "Tailored themes, atmospheric lighting, and luxury stage installations.", imageSrc: "" },
      { id: "flawless-execution", title: "Flawless Execution", description: "Seamless vendor management and attentive on-day coordination.", imageSrc: "" },
      { id: "curated-network", title: "Curated Network", description: "Exclusive access to top-tier venues, artists, and production masters.", imageSrc: "" },
      { id: "transparent-pricing", title: "Transparent Pricing", description: "Clear line-item quotes and real-time budget management.", imageSrc: "" }
    ];

    const directSrc = imageSrc ? convertDriveUrlToDirectLink(imageSrc) : "";
    const updatedCards = currentCards.map((card) =>
      card.id === id ? { ...card, imageSrc: directSrc } : card
    );

    await saveCloudData({ aboutCards: updatedCards });

    return NextResponse.json({ ok: true, message: "About card updated and synced live", data: updatedCards });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update about card";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
