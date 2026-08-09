import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPhoto extends Document {
  title: string;
  category: string;
  eventId?: string;
  eventTitle?: string;
  isFeatured?: boolean;
  imageSrc: string;
  alt: string;
  createdAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "General" },
    eventId: { type: String, default: "" },
    eventTitle: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    imageSrc: { type: String, required: true },
    alt: { type: String, default: "" }
  },
  {
    collection: "photos",
    timestamps: true
  }
);

export const PhotoModel: Model<IPhoto> =
  mongoose.models.Photo || mongoose.model<IPhoto>("Photo", PhotoSchema);
