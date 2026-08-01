import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: string;
  description: string;
  date?: string;
  location?: string;
  imageSrc: string;
  imageAlt?: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "Luxury Wedding" },
    description: { type: String, required: true },
    date: { type: String, default: "" },
    location: { type: String, default: "India" },
    imageSrc: { type: String, required: true },
    imageAlt: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

export const EventModel: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
