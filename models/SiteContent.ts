import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { SiteContentData } from "@/types/site-content";

export interface ISiteContentDoc extends Document {
  key: string;
  data: SiteContentData;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContentDoc>(
  {
    key: { type: String, required: true, unique: true, default: "global_site_content" },
    data: { type: Schema.Types.Mixed, required: true }
  },
  {
    collection: "site_content",
    timestamps: true
  }
);

export const SiteContentModel: Model<ISiteContentDoc> =
  mongoose.models.SiteContent || mongoose.model<ISiteContentDoc>("SiteContent", SiteContentSchema);
