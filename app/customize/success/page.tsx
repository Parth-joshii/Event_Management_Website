import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, CheckCircle2, Home, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { DownloadSummaryButton } from "@/components/lead/download-summary-button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";

interface SuccessPageProps {
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Your Celebration Journey Has Begun | Shree Velora Event's"
};

/** Renders the premium animated success confirmation screen. */
export default async function CustomizeSuccessPage({
  searchParams
}: SuccessPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const referenceNumber = Array.isArray(params.ref) ? params.ref[0] : params.ref || "SV-2026-99770";
  const fullName = Array.isArray(params.name) ? params.name[0] : params.name || "Valued Client";
  const eventType = Array.isArray(params.event) ? params.event[0] : params.event || "Wedding";
  const eventDate = Array.isArray(params.date) ? params.date[0] : params.date || "Upcoming Date";
  const city = Array.isArray(params.city) ? params.city[0] : params.city || "Indore";
  const guests = Array.isArray(params.guests) ? params.guests[0] : params.guests || "350";

  const logoSrc = optionalPublicAsset("/logos/logo.png");

  const whatsappMessage = `Hi Shree Velora Event's,\n\nI just submitted my celebration requirements.\n\nReference: ${referenceNumber}\nEvent: ${eventType}\nDate: ${eventDate}\nGuests: ${guests}\nLocation: ${city}\n\nI would like to discuss my event.`;

  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#FAF7FF] via-white to-[#FAF7FF] px-4 py-28 sm:px-6 lg:px-8">
        <Container>
          <section className="mx-auto max-w-2xl rounded-3xl border border-[#EBDCFB] bg-white p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Ambient Gold Glow Background */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />

            <span className="relative z-10 mx-auto inline-flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2D2238] to-[#7d5ea1] text-[#D4AF37] shadow-xl ring-4 ring-[#D4AF37]/30 mb-6">
              <CheckCircle2 className="size-10" />
            </span>

            <span className="relative z-10 block text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Confirmation Confirmed
            </span>

            <h1 className="font-display relative z-10 mt-2 text-3xl font-black text-[#2D2238] sm:text-5xl">
              Your Celebration Journey Has Begun
            </h1>

            <p className="relative z-10 mt-4 text-base font-medium text-[#5c4b6e] sm:text-lg">
              Thank you, <span className="font-bold text-[#2D2238]">{fullName}</span>. We&apos;ve received your event vision and our team will review it shortly.
            </p>

            {/* Reference ID Badge */}
            <div className="relative z-10 mt-6 inline-block rounded-2xl border border-[#D4AF37]/40 bg-[#2D2238] px-6 py-3.5 text-white shadow-md">
              <p className="text-[10px] font-semibold text-[#EBDCFB]/70 uppercase tracking-widest">Inquiry Reference Number</p>
              <p className="font-mono text-2xl font-black text-[#D4AF37] mt-0.5 tracking-wider">{referenceNumber}</p>
            </div>

            {/* Summary Details Box */}
            <div className="relative z-10 mt-6 rounded-2xl border border-[#EBDCFB] bg-[#FAF7FF] p-5 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5"><span className="text-[#7d5ea1]">Event Type:</span><span className="font-bold text-[#2D2238]">{eventType}</span></div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5"><span className="text-[#7d5ea1]">City:</span><span className="font-bold text-[#2D2238]">{city}</span></div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5"><span className="text-[#7d5ea1]">Guest Count:</span><span className="font-bold text-[#2D2238]">{guests} Guests</span></div>
              <div className="flex justify-between"><span className="text-[#7d5ea1]">Date:</span><span className="font-bold text-[#2D2238]">{eventDate || "Flexible"}</span></div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 mt-8 flex flex-col justify-center gap-3.5 sm:flex-row flex-wrap">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <GradientButton type="button" className="w-full sm:w-auto px-6 py-3 text-sm shadow-xl">
                  <MessageCircle className="size-4 mr-1.5" />
                  Chat on WhatsApp
                </GradientButton>
              </a>

              <DownloadSummaryButton
                referenceNumber={referenceNumber}
                summary={{
                  "Reference Number": referenceNumber,
                  Name: fullName,
                  "Event Type": eventType,
                  City: city,
                  Guests: guests,
                  Date: eventDate,
                  Status: "Inquiry Received",
                  Company: siteConfig.name
                }}
              />

              <Link href="/gallery">
                <Button type="button" variant="outline" className="w-full sm:w-auto border-[#EBDCFB] text-[#2D2238] hover:bg-[#EBDCFB]/30">
                  <Sparkles className="size-4 mr-1.5 text-[#D4AF37]" /> Explore Our Work
                </Button>
              </Link>

              <Link href="/">
                <Button type="button" variant="ghost" className="w-full sm:w-auto text-[#7d5ea1] hover:text-[#2D2238]">
                  <Home className="size-4 mr-1.5" /> Back to Home
                </Button>
              </Link>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
