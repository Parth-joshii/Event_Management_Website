import Link from "next/link";
import { ArrowDown, Images, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { ScrollVideo } from "@/components/animations/scroll-video";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";

interface HeroSectionProps {
  readonly desktopVideoSrc?: string;
  readonly mobileVideoSrc?: string;
}

/** Renders the cinematic landing hero with video or premium fallback visuals. */
export function HeroSection({
  desktopVideoSrc,
  mobileVideoSrc
}: HeroSectionProps): React.ReactElement {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#2D2238] text-white"
    >
      <ScrollVideo desktopSrc={desktopVideoSrc} mobileSrc={mobileVideoSrc} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,34,56,0.55)_0%,rgba(45,34,56,0.58)_42%,rgba(45,34,56,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(191,162,219,0.32),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.24),transparent_26%)]" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-16">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-[#EBDCFB] uppercase backdrop-blur">
            Bespoke Celebrations · Impeccably Curated
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 text-xl font-medium text-balance text-[#EBDCFB] sm:text-2xl">
            {siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <GradientButton asChild>
                <Link href="#customize">
                  <WandSparkles aria-hidden="true" className="size-4" />
                  Design Your Celebration
                </Link>
              </GradientButton>
            </MagneticButton>
            <MagneticButton>
              <GradientButton asChild tone="light">
                <Link href="#gallery">
                  <Images aria-hidden="true" className="size-4" />
                  Explore Our Portfolio
                </Link>
              </GradientButton>
            </MagneticButton>
          </div>
        </Reveal>
      </Container>

      <Link
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none md:flex"
        href="#about"
      >
        <span>Scroll</span>
        <ArrowDown aria-hidden="true" className="size-4 animate-bounce" />
      </Link>
    </section>
  );
}
