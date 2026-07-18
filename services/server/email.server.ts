import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import type { InquirySubmission } from "@/types/inquiry";

export type EmailSendStatus = "not-configured" | "sent" | "skipped";

interface InquiryEmailContext {
  readonly referenceNumber: string;
}

function isEmailConfigured(): boolean {
  return Boolean(
    env.SMTP_HOST &&
    env.SMTP_PORT &&
    env.SMTP_USER &&
    env.SMTP_PASS &&
    env.SMTP_FROM_EMAIL &&
    env.SMTP_TO_EMAIL
  );
}

function createSummaryRows(inquiry: InquirySubmission): string {
  const rows = [
    ["Name", inquiry.fullName],
    ["Phone", inquiry.phone],
    ["Email", inquiry.email],
    ["City", inquiry.city],
    ["Event Type", inquiry.eventType],
    ["Functions", inquiry.functions.join(", ") || "Not selected"],
    ["Theme", inquiry.theme],
    ["Venue", inquiry.venuePreference],
    ["Guests", inquiry.guests.toLocaleString("en-IN")],
    ["Budget", `INR ${inquiry.budget.toLocaleString("en-IN")}`],
    ["Services", inquiry.selectedServices.join(", ")],
    ["Special Requirements", inquiry.specialRequirements || "None"]
  ];

  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px;border-bottom:1px solid #eadcf8;color:#6b5b78">${label}</td><td style="padding:10px;border-bottom:1px solid #eadcf8;color:#2D2238;font-weight:600">${value}</td></tr>`
    )
    .join("");
}

function createEmailTemplate(
  inquiry: InquirySubmission,
  context: InquiryEmailContext,
  variant: "business" | "customer"
): string {
  const heading =
    variant === "business"
      ? "New Event Inquiry Received"
      : "Thank You For Your Inquiry";
  const intro =
    variant === "business"
      ? "A new inquiry has been submitted from the website."
      : "Our team has received your inquiry and will contact you shortly.";

  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#FAF7FF;padding:28px">
      <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #eadcf8;border-radius:12px;overflow:hidden">
        <div style="background:#2D2238;color:#fff;padding:28px">
          <p style="margin:0;color:#D4AF37;letter-spacing:2px;text-transform:uppercase;font-size:12px">${siteConfig.name}</p>
          <h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:30px">${heading}</h1>
          <p style="margin:12px 0 0;color:#ded2ea">${intro}</p>
        </div>
        <div style="padding:24px">
          <p style="margin:0 0 16px;color:#2D2238;font-weight:700">Reference Number: ${context.referenceNumber}</p>
          <table style="width:100%;border-collapse:collapse">${createSummaryRows(inquiry)}</table>
          <p style="margin:24px 0 0;color:#6b5b78;line-height:1.7">For urgent planning support, contact ${siteConfig.contact.phone} or reply to this email.</p>
        </div>
      </div>
    </div>
  `;
}

/** Sends business and customer inquiry emails when SMTP is configured. */
export async function sendInquiryEmails(
  inquiry: InquirySubmission,
  context: InquiryEmailContext
): Promise<EmailSendStatus> {
  if (!isEmailConfigured()) {
    return "not-configured";
  }

  const transporter = nodemailer.createTransport({
    auth: {
      pass: env.SMTP_PASS,
      user: env.SMTP_USER
    },
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE
  });

  await transporter.sendMail({
    from: env.SMTP_FROM_EMAIL,
    html: createEmailTemplate(inquiry, context, "business"),
    replyTo: inquiry.email,
    subject: `New Inquiry ${context.referenceNumber} - ${inquiry.eventType}`,
    to: env.SMTP_TO_EMAIL
  });

  await transporter.sendMail({
    from: env.SMTP_FROM_EMAIL,
    html: createEmailTemplate(inquiry, context, "customer"),
    subject: `Thank you - ${context.referenceNumber} | ${siteConfig.name}`,
    to: inquiry.email
  });

  return "sent";
}
