import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { DownloadSummaryButton } from "@/components/lead/download-summary-button";
import { GradientButton } from "@/components/ui/gradient-button";
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
  title: "Thank You | Shree Velora Event's"
};

/** Renders the inquiry success confirmation page. */
export default async function CustomizeSuccessPage({
  searchParams
}: SuccessPageProps): Promise<React.ReactElement> {
  const params = (await searchParams) ?? {};
  const referenceNumber = Array.isArray(params.ref)
    ? params.ref[0]
    : params.ref || "SV-INQUIRY";
  const logoSrc = optionalPublicAsset("/logos/logo.png");
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    `Hi Shree Velora Event's, my inquiry reference is ${referenceNumber}.`
  )}`;

  return (
    <>
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content" className="bg-[#FAF7FF] px-4 py-32 sm:px-6 lg:px-8">
        <Container>
          <section className="mx-auto max-w-2xl rounded-lg border border-white/70 bg-white p-8 text-center shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              Thank You
            </p>
            <h1 className="font-display mt-4 text-4xl font-semibold text-[#2D2238]">
              Your inquiry has been received.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#5c4b6e]">
              Reference Number:{" "}
              <span className="font-semibold text-[#2D2238]">{referenceNumber}</span>
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5c4b6e]">
              Our team will contact you shortly with the next planning steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <GradientButton asChild>
                <Link href="/">Back Home</Link>
              </GradientButton>
              <GradientButton asChild tone="light">
                <a href={whatsappHref} rel="noreferrer" target="_blank">
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp
                </a>
              </GradientButton>
              <DownloadSummaryButton
                referenceNumber={referenceNumber}
                summary={{
                  "Reference Number": referenceNumber,
                  Status: "Submitted",
                  Company: siteConfig.name
                }}
              />
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
