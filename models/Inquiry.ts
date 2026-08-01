import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IInquiry extends Document {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: number;
  specialRequirements?: string;
  status: "New" | "Contacted" | "Confirmed";
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, default: "Luxury Wedding" },
    eventDate: { type: String, default: "" },
    budget: { type: Number, default: 500000 },
    specialRequirements: { type: String, default: "" },
    status: { type: String, enum: ["New", "Contacted", "Confirmed"], default: "New" }
  },
  {
    timestamps: true
  }
);

export const InquiryModel: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
