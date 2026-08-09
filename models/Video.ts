import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IVideo extends Document {
  title: string;
  category: string;
  videoSrc: string;
  posterSrc?: string;
  description?: string;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "Hero" },
    videoSrc: { type: String, required: true },
    posterSrc: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  {
    collection: "videos",
    timestamps: true
  }
);

export const VideoModel: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
