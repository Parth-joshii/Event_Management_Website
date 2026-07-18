"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/** Renders a recoverable route error state. */
export default function ErrorPage({
  error,
  reset
}: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-dvh items-center justify-center bg-[#FAF7FF] px-6 py-16"
    >
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          Something paused
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold text-[#2D2238]">
          The experience could not load.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#5c4b6e]">
          Please refresh the page or return home while we prepare the route again.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <GradientButton onClick={reset} type="button">
            <RefreshCw aria-hidden="true" className="size-4" />
            Try Again
          </GradientButton>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
