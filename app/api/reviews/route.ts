import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

let globalReviewsStore = [
  {
    id: "rev-1",
    authorName: "Vikram & Ananya Mehta",
    roleOrEvent: "Royal Wedding Client, Udaipur",
    rating: 5,
    comment: "Shree Velora transformed our wedding into an absolute fairytale. Every decor detail and stage execution was regal beyond words.",
    avatarSrc: "/images/testimonials-[#1].jpg"
  },
  {
    id: "rev-2",
    authorName: "Sanjay Singhania",
    roleOrEvent: "Corporate Gala Host, Mumbai",
    rating: 5,
    comment: "Flawless professionalism, magnificent venue lighting, and seamless coordination. Our high-profile corporate delegates were deeply impressed.",
    avatarSrc: "/images/testimonials-[#2].jpg"
  }
];

/** GET /api/reviews - Fetch all client reviews */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, data: globalReviewsStore });
}

/** POST /api/reviews - Add a new review */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) || {};
    const { authorName, roleOrEvent, rating, comment, avatarSrc } = body;

    if (!authorName || !comment) {
      return NextResponse.json({ ok: false, message: "Author name and comment are required" }, { status: 400 });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim(),
      roleOrEvent: roleOrEvent ? roleOrEvent.trim() : "Luxury Event Client",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      avatarSrc: avatarSrc || ""
    };

    globalReviewsStore = [newReview, ...globalReviewsStore];
    return NextResponse.json({ ok: true, data: newReview });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

/** DELETE /api/reviews?id=xyz - Delete review */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");

    if (all === "true") {
      globalReviewsStore = [];
      return NextResponse.json({ ok: true, message: "All reviews deleted" });
    }

    if (id) {
      globalReviewsStore = globalReviewsStore.filter((r) => r.id !== id);
    }

    return NextResponse.json({ ok: true, message: "Review deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
