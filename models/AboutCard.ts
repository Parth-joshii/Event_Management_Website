import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAboutCard extends Document {
  cardId: string;
  number?: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutCardSchema = new Schema<IAboutCard>(
  {
    cardId: { type: String, required: true, unique: true },
    number: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageSrc: { type: String, default: "" }
  },
  {
    collection: "about_cards",
    timestamps: true
  }
);

export const AboutCardModel: Model<IAboutCard> =
  mongoose.models.AboutCard || mongoose.model<IAboutCard>("AboutCard", AboutCardSchema);

