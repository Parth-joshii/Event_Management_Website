import Link from "next/link";
import { ArrowDown, Images, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { ParallaxWrapper } from "@/components/animations/parallax-wrapper";
import { Reveal } from "@/components/animations/reveal";
import { ScrollVideo } from "@/components/animations/scroll-video";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";

interface HeroSectionProps {
  readonly hasHeroVideo: boolean;
}

/** Renders the cinematic landing hero with video or premium fallback visuals. */
export function HeroSection({ hasHeroVideo }: HeroSectionProps): React.ReactElement {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#2D2238] text-white"
    >
      <ScrollVideo enabled={hasHeroVideo} src="/videos/hero-event.mp4" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,34,56,0.55)_0%,rgba(45,34,56,0.58)_42%,rgba(45,34,56,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(191,162,219,0.32),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.24),transparent_26%)]" />

      <ParallaxWrapper
        className="pointer-events-none absolute top-28 left-6 hidden size-28 rounded-full border border-white/20 bg-white/10 backdrop-blur md:block"
        offset={34}
      >
        <span className="block size-full rounded-full border border-[#D4AF37]/30" />
      </ParallaxWrapper>
      <ParallaxWrapper
        className="pointer-events-none absolute right-8 bottom-24 hidden size-40 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 backdrop-blur md:block"
        offset={62}
      >
        <span className="block size-full rounded-full border border-white/15" />
      </ParallaxWrapper>

      <Container className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-16">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-[#EBDCFB] uppercase backdrop-blur">
            Luxury Event Management
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-normal text-balance sm:text-7xl lg:text-8xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 text-xl font-medium text-balance text-[#EBDCFB] sm:text-2xl">
            {siteConfig.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
            From royal weddings to elegant corporate gatherings, we design unforgettable
            experiences with luxury decor, flawless planning, and cinematic execution.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <GradientButton asChild>
                <Link href="#customize">
                  <WandSparkles aria-hidden="true" className="size-4" />
                  Customize Your Event
                </Link>
              </GradientButton>
            </MagneticButton>
            <MagneticButton>
              <GradientButton asChild tone="light">
                <Link href="#gallery">
                  <Images aria-hidden="true" className="size-4" />
                  View Our Work
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
