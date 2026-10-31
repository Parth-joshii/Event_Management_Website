import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AboutCardModel } from "@/models/AboutCard";
import { SiteContentModel } from "@/models/SiteContent";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { getCloudData, saveCloudData } from "@/lib/cloud-sync";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const defaultAboutCards = [
  {
    id: "bespoke-design",
    number: "01",
    title: "Bespoke Design",
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385048/shree_velora/about/diklrziwqbjvwhkm99vt.jpg"
  },
  {
    id: "flawless-execution",
    number: "02",
    title: "Flawless Execution",
    description: "Seamless vendor management and attentive on-day coordination.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385061/shree_velora/about/ryd7tzoa7dm5amkx6ne5.jpg"
  },
  {
    id: "curated-network",
    number: "03",
    title: "Curated Network",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385074/shree_velora/about/zzryvnbb59enkedgocky.jpg"
  },
  {
    id: "transparent-pricing",
    number: "04",
    title: "Transparent Pricing",
    description: "Clear line-item quotes and real-time budget management.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385092/shree_velora/about/vx3ensckhdh1xsvit46v.jpg"
  }
];

/** GET /api/about - Fetch synced about cards across all browsers from MongoDB */
export async function GET(): Promise<NextResponse> {
  try {
    let mongoCards: any[] = [];
    try {
      await connectToDatabase();
      mongoCards = await AboutCardModel.find({}).lean();
    } catch (dbErr) {
      console.warn("MongoDB AboutCards fetch warning:", dbErr);
    }

    // Also check if SiteContent has imageSrc on about.cards
    let cmsAboutCards: any[] = [];
    try {
      const cmsDoc = await SiteContentModel.findOne({ key: "global_site_content" }).lean();
      if (cmsDoc?.data?.about?.cards && Array.isArray(cmsDoc.data.about.cards)) {
        cmsAboutCards = cmsDoc.data.about.cards;
      }
    } catch (cmsErr) {
      console.warn("SiteContent read error in /api/about:", cmsErr);
    }

    // Merge default cards with MongoDB AboutCardModel and SiteContent
    const merged = defaultAboutCards.map((def) => {
      const foundInDb = mongoCards.find((c) => (c.cardId || c.id) === def.id);
      const foundInCms = cmsAboutCards.find((c) => c.id === def.id);

      return {
        id: def.id,
        number: foundInCms?.number || def.number,
        title: foundInDb?.title || foundInCms?.title || def.title,
        description: foundInDb?.description || foundInCms?.description || def.description,
        imageSrc: foundInDb?.imageSrc || foundInCms?.imageSrc || def.imageSrc || ""
      };
    });

    return NextResponse.json({ ok: true, data: merged });
  } catch (err) {
    console.error("Failed to load about cards:", err);
    // Cloud fallback
    const cloud = await getCloudData().catch(() => null);
    return NextResponse.json({ ok: true, data: cloud?.aboutCards || defaultAboutCards });
  }
}

/** POST /api/about - Update an about card image and sync across all browsers and MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};
    const { id, imageSrc, title, description } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "Card ID required" }, { status: 400 });
    }

    const rawDirectSrc = imageSrc ? convertDriveUrlToDirectLink(imageSrc) : "";
    let directSrc = rawDirectSrc;

    // Automatically import external or drive image to Cloudinary CDN
    if (rawDirectSrc && !rawDirectSrc.includes("res.cloudinary.com") && isCloudinaryConfigured()) {
      try {
        const uploadRes = await cloudinary.uploader.upload(rawDirectSrc, {
          folder: "shree_velora/about",
          tags: ["shree_velora", "about"],
          fetch_format: "auto",
          quality: "auto"
        });
        if (uploadRes?.secure_url) {
          directSrc = uploadRes.secure_url;
        }
      } catch (cloudErr) {
        console.warn("Could not auto-import external image into Cloudinary CDN:", cloudErr);
      }
    }

    // 1. Persist to MongoDB AboutCard collection
    let savedToMongo = false;
    try {
      await connectToDatabase();
      await AboutCardModel.findOneAndUpdate(
        { cardId: id },
        {
          $set: {
            cardId: id,
            imageSrc: directSrc,
            ...(title ? { title } : {}),
            ...(description ? { description } : {})
          }
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      savedToMongo = true;
    } catch (mongoErr) {
      console.warn("MongoDB AboutCard save warning:", mongoErr);
    }

    // 2. Also keep SiteContentModel.data.about.cards in sync
    try {
      await connectToDatabase();
      const siteDoc = await SiteContentModel.findOne({ key: "global_site_content" });
      if (siteDoc && siteDoc.data?.about?.cards) {
        siteDoc.data.about.cards = siteDoc.data.about.cards.map((c: any) =>
          c.id === id ? { ...c, imageSrc: directSrc } : c
        );
        siteDoc.markModified("data");
        await siteDoc.save();
      }
    } catch (siteDocErr) {
      console.warn("SiteContent sync warning in /api/about:", siteDocErr);
    }

    // 3. Dual-persist to Cloud Sync
    const cloud = await getCloudData().catch(() => null);
    const currentCards = cloud?.aboutCards || defaultAboutCards;
    const updatedCards = currentCards.map((card) =>
      card.id === id ? { ...card, imageSrc: directSrc } : card
    );
    try {
      await saveCloudData({ aboutCards: updatedCards });
    } catch (cloudErr) {
      console.warn("Cloud sync write warning:", cloudErr);
    }

    return NextResponse.json({
      ok: true,
      message: "About card updated and persisted in MongoDB",
      savedToMongo,
      data: updatedCards
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update about card";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
