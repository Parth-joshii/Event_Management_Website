import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/layout/json-ld";
import { RootShell } from "@/components/layout/root-shell";
import { SkipLink } from "@/components/layout/skip-link";
import { defaultMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers/app-providers";
import { createOrganizationJsonLd } from "@/utils/seo";
import "@/styles/globals.css";

const sans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Cormorant_Garamond({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  colorScheme: "light dark",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    {
      color: "#faf6ea",
      media: "(prefers-color-scheme: light)"
    },
    {
      color: "#151923",
      media: "(prefers-color-scheme: dark)"
    }
  ],
  width: "device-width"
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

/** Renders the global document shell and providers. */
export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          sans.variable,
          display.variable,
          "bg-background text-foreground min-h-dvh font-sans antialiased"
        )}
      >
        <JsonLd data={createOrganizationJsonLd()} />
        <AppProviders>
          <SkipLink />
          <RootShell>{children}</RootShell>
          <Toaster richColors />
        </AppProviders>
      </body>
    </html>
  );
}
