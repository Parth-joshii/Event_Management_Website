import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReview extends Document {
  authorName: string;
  roleOrEvent: string;
  rating: number;
  comment: string;
  avatarSrc?: string;
  isApproved?: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    authorName: { type: String, required: true, trim: true },
    roleOrEvent: { type: String, required: true, trim: true, default: "Luxury Wedding Client" },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    avatarSrc: { type: String, default: "" },
    isApproved: { type: Boolean, default: true }
  },
  {
    collection: "reviews",
    timestamps: true
  }
);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
