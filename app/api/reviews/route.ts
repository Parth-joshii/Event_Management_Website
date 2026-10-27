import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function serializeReview(review: any) {
  return {
    id: review._id?.toString?.() || review.id || "",
    authorName: review.authorName,
    roleOrEvent: review.roleOrEvent || "Luxury Celebration Client",
    rating: Number(review.rating) || 5,
    comment: review.comment,
    avatarSrc: review.avatarSrc || "",
    createdAt: review.createdAt
  };
}

/** GET /api/reviews - Fetch all client reviews persisted in MongoDB */
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    let reviews = await ReviewModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      ok: true,
      data: reviews.map((r) => serializeReview(r))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/reviews - Add a new review and persist to MongoDB */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};
    const { authorName, roleOrEvent, rating, comment, avatarSrc } = body;

    if (!authorName || !comment) {
      return NextResponse.json({ ok: false, message: "Author name and comment are required" }, { status: 400 });
    }

    await connectToDatabase();
    const created = await ReviewModel.create({
      authorName: authorName.trim(),
      roleOrEvent: roleOrEvent ? roleOrEvent.trim() : "Luxury Event Client",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      avatarSrc: avatarSrc || ""
    });

    return NextResponse.json({ ok: true, data: serializeReview(created) });
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
