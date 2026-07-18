import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";

/** Renders the platform 404 route. */
export default function NotFound(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh items-center justify-center bg-[#FAF7FF] px-6 py-16"
    >
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          404
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-balance text-[#2D2238]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-balance text-[#5c4b6e]">
          The route is not available in this phase of the platform.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <GradientButton asChild>
            <Link href="/">Return home</Link>
          </GradientButton>
          <Button asChild variant="outline">
            <Link href="/#contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
