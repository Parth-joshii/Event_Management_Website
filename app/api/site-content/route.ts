import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteContentModel } from "@/models/SiteContent";
import { AboutCardModel } from "@/models/AboutCard";
import { getCloudData, saveCloudData } from "@/lib/cloud-sync";
import { defaultSiteContent, type SiteContentData } from "@/types/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CONTENT_KEY = "global_site_content";

/** Merge user-provided or stored content with defaultSiteContent so no keys are ever missing */
function mergeWithDefaults(saved?: Partial<SiteContentData> | null): SiteContentData {
  if (!saved || typeof saved !== "object") return defaultSiteContent;

  return {
    hero: {
      ...defaultSiteContent.hero,
      ...(saved.hero || {})
    },
    about: {
      ...defaultSiteContent.about,
      ...(saved.about || {}),
      cards:
        Array.isArray(saved.about?.cards) && saved.about.cards.length > 0
          ? saved.about.cards.map((c, idx) => ({
              ...(defaultSiteContent.about.cards[idx] || {}),
              ...c,
              imageSrc: c.imageSrc || ""
            }))
          : defaultSiteContent.about.cards
    },
    eventsSection: {
      ...defaultSiteContent.eventsSection,
      ...(saved.eventsSection || {})
    },
    testimonialsSection: {
      ...defaultSiteContent.testimonialsSection,
      ...(saved.testimonialsSection || {})
    },
    ctaSection: {
      ...defaultSiteContent.ctaSection,
      ...(saved.ctaSection || {})
    },
    contact: {
      ...defaultSiteContent.contact,
      ...(saved.contact || {})
    }
  };
}

/** GET /api/site-content - Fetch all customizable website copy/text */
export async function GET(): Promise<NextResponse> {
  try {
    // 1. Try MongoDB
    try {
      await connectToDatabase();
      const doc = await SiteContentModel.findOne({ key: CONTENT_KEY }).lean();
      const aboutCards = await AboutCardModel.find({}).lean().catch(() => []);

      if (doc && doc.data) {
        const merged = mergeWithDefaults(doc.data as Partial<SiteContentData>);

        // Enrich about.cards with imageSrc from AboutCardModel if missing
        if (aboutCards.length > 0 && merged.about?.cards) {
          merged.about.cards = merged.about.cards.map((c) => {
            const found = aboutCards.find((ac: any) => (ac.cardId || ac.id) === c.id);
            return {
              ...c,
              imageSrc: c.imageSrc || found?.imageSrc || ""
            };
          });
        }

        return NextResponse.json({
          ok: true,
          data: merged
        });
      }
    } catch (dbErr) {
      console.warn("MongoDB site-content read failed, trying cloud-sync fallback:", dbErr);
    }

    // 2. Try Cloud Sync
    const cloud = await getCloudData().catch(() => null);
    if (cloud?.siteContent) {
      return NextResponse.json({
        ok: true,
        data: mergeWithDefaults(cloud.siteContent)
      });
    }

    // 3. Fallback to default
    return NextResponse.json({
      ok: true,
      data: defaultSiteContent
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch site content";
    return NextResponse.json({ ok: false, message, data: defaultSiteContent }, { status: 500 });
  }
}

/** POST /api/site-content - Save updated site copy to MongoDB & Cloud Sync */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) as Partial<SiteContentData> | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    const merged = mergeWithDefaults(body);

    let savedToMongo = false;
    try {
      await connectToDatabase();

      // Ensure we preserve existing imageSrc if not provided in incoming body
      const existingDoc = await SiteContentModel.findOne({ key: CONTENT_KEY }).lean();
      const existingAboutCards = await AboutCardModel.find({}).lean().catch(() => []);

      if (merged.about?.cards) {
        merged.about.cards = merged.about.cards.map((newCard) => {
          const prevCard = existingDoc?.data?.about?.cards?.find((pc: any) => pc.id === newCard.id);
          const aboutCardDoc = existingAboutCards.find((ac: any) => (ac.cardId || ac.id) === newCard.id);
          return {
            ...newCard,
            imageSrc: newCard.imageSrc || prevCard?.imageSrc || aboutCardDoc?.imageSrc || ""
          };
        });
      }

      await SiteContentModel.findOneAndUpdate(
        { key: CONTENT_KEY },
        { $set: { key: CONTENT_KEY, data: merged } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      savedToMongo = true;
    } catch (mongoErr) {
      console.warn("MongoDB site-content save warning:", mongoErr);
    }

    // Dual-persist to Cloud Sync
    try {
      await saveCloudData({ siteContent: merged });
    } catch (cloudErr) {
      console.warn("Cloud Sync site-content backup warning:", cloudErr);
    }

    return NextResponse.json({
      ok: true,
      message: "Site content updated successfully",
      savedToMongo,
      data: merged
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save site content";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** PUT /api/site-content - Same as POST */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  return POST(request);
}
