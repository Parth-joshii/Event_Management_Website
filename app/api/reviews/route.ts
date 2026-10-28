import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

import { getCloudData, saveCloudData } from "@/lib/cloud-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface RawReview {
  _id?: { toString: () => string };
  id?: string;
  authorName?: string;
  roleOrEvent?: string;
  rating?: number | string;
  comment?: string;
  avatarSrc?: string;
  createdAt?: Date | string;
}

function serializeReview(review: RawReview) {
  return {
    id: review._id?.toString?.() || review.id || "",
    authorName: review.authorName || "Valued Client",
    roleOrEvent: review.roleOrEvent || "Luxury Celebration Client",
    rating: Number(review.rating) || 5,
    comment: review.comment || "",
    avatarSrc: review.avatarSrc || "",
    createdAt: review.createdAt || new Date().toISOString()
  };
}

/** GET /api/reviews - Fetch all client reviews persisted in MongoDB with cloud fallback */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const reviews = await ReviewModel.find({}).sort({ createdAt: -1 }).lean();

    if (reviews && reviews.length > 0) {
      return NextResponse.json({
        ok: true,
        data: reviews.map((r) => serializeReview(r))
      });
    }

    // If MongoDB has no reviews yet, check cloud backup
    const cloud = await getCloudData().catch(() => null);
    if (cloud?.reviews && cloud.reviews.length > 0) {
      return NextResponse.json({ ok: true, data: cloud.reviews });
    }

    return NextResponse.json({ ok: true, data: [] });
  } catch (error) {
    console.warn("MongoDB review fetch warning, checking cloud sync fallback:", error);
    try {
      const cloud = await getCloudData().catch(() => null);
      if (cloud?.reviews && cloud.reviews.length > 0) {
        return NextResponse.json({ ok: true, data: cloud.reviews });
      }
    } catch {}

    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/reviews - Add a new review and persist to MongoDB & Cloud Sync */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};
    const { authorName, roleOrEvent, rating, comment, avatarSrc } = body;

    if (!authorName || !comment) {
      return NextResponse.json({ ok: false, message: "Author name and comment are required" }, { status: 400 });
    }

    const reviewData = {
      authorName: authorName.trim(),
      roleOrEvent: roleOrEvent ? roleOrEvent.trim() : "Luxury Event Client",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      avatarSrc: avatarSrc || ""
    };

    let serialized: ReturnType<typeof serializeReview> | null = null;

    // 1. Persist to MongoDB
    try {
      await connectToDatabase();
      const created = await ReviewModel.create(reviewData);
      serialized = serializeReview(created);
    } catch (mongoErr) {
      console.warn("MongoDB review save failed, using cloud-sync fallback:", mongoErr);
    }

    // 2. Dual-save to shared cloud storage as backup
    try {
      const cloud = await getCloudData();
      const existingReviews = cloud.reviews || [];
      const itemToSave = serialized || {
        id: `rev-${Date.now()}`,
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      await saveCloudData({
        reviews: [itemToSave, ...existingReviews.filter((r) => r.id !== itemToSave.id)]
      });
      if (!serialized) {
        serialized = itemToSave;
      }
    } catch (cloudErr) {
      console.warn("Cloud sync review backup warning:", cloudErr);
    }

    if (!serialized) {
      throw new Error("Failed to save review to storage");
    }

    return NextResponse.json({ ok: true, data: serialized });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/reviews?id=xyz - Delete review permanently from MongoDB */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const author = searchParams.get("author");
    const all = searchParams.get("all") === "true";

    await connectToDatabase();

    if (all) {
      await ReviewModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All reviews deleted" });
    }

    if (id || author) {
      if (id && mongoose.isValidObjectId(id)) {
        await ReviewModel.findByIdAndDelete(id);
      } else {
        await ReviewModel.deleteOne({
          $or: [
            ...(id ? [{ _id: id }] : []),
            ...(author ? [{ authorName: author }] : [])
          ]
        });
      }
    }

    return NextResponse.json({ ok: true, message: "Review deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
