import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET /api/reviews - Fetch all client reviews from MongoDB reviews collection */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, data: [] }, { status: 200 });
    }

    const reviews = await ReviewModel.find({}).sort({ createdAt: -1 }).lean();
    const formatted = reviews.map((rev) => ({
      id: String(rev._id),
      authorName: rev.authorName,
      roleOrEvent: rev.roleOrEvent || "Luxury Event Client",
      rating: rev.rating || 5,
      comment: rev.comment,
      avatarSrc: rev.avatarSrc || "",
      isApproved: rev.isApproved ?? true,
      createdAt: rev.createdAt ? rev.createdAt.toISOString() : new Date().toISOString()
    }));

    return NextResponse.json({ ok: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ ok: false, message, data: [] }, { status: 500 });
  }
}

/** POST /api/reviews - Add a new review to MongoDB reviews collection */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { authorName, roleOrEvent, rating, comment, avatarSrc } = body;

    if (!authorName || !comment) {
      return NextResponse.json({ ok: false, message: "Author name and comment are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, message: "Database connection unavailable" }, { status: 503 });
    }

    const newReview = await ReviewModel.create({
      authorName: authorName.trim(),
      roleOrEvent: roleOrEvent ? roleOrEvent.trim() : "Luxury Event Client",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      avatarSrc: avatarSrc || "",
      isApproved: true
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: String(newReview._id),
        authorName: newReview.authorName,
        roleOrEvent: newReview.roleOrEvent,
        rating: newReview.rating,
        comment: newReview.comment,
        avatarSrc: newReview.avatarSrc,
        isApproved: newReview.isApproved
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/reviews?id=xyz - Delete review from MongoDB reviews collection */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ ok: false, message: "Database connection unavailable" }, { status: 503 });
    }

    if (all === "true") {
      await ReviewModel.deleteMany({});
      return NextResponse.json({ ok: true, message: "All reviews deleted" });
    }

    if (!id) {
      return NextResponse.json({ ok: false, message: "Review ID required" }, { status: 400 });
    }

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await ReviewModel.findByIdAndDelete(id);
    }

    return NextResponse.json({ ok: true, message: "Review deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
