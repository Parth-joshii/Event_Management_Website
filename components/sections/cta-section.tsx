import Link from "next/link";
import { MessageCircle, WandSparkles } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { siteConfig } from "@/config/site";

const whatsappMessage = "Hi Shree Velora Event's, I want to plan an event.";

const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

/** Renders the premium lead-generation CTA. */
export function CtaSection(): React.ReactElement {
  return (
    <section
      id="customize"
      className="relative isolate overflow-hidden bg-[#2D2238] py-24 text-white sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(191,162,219,0.32),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(212,175,55,0.22),transparent_30%)]" />
      <Container className="relative z-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">
              Custom Event Plan
            </p>
            <h2 className="font-display mt-5 text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
              Ready To Design Your Dream Event?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
              Share your vision with us and our team will create a personalized event
              plan, budget estimate, and decor concept for your celebration.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton>
                <GradientButton asChild tone="light">
                  <Link href="#contact">
                    <WandSparkles aria-hidden="true" className="size-4" />
                    Start Customizing
                  </Link>
                </GradientButton>
              </MagneticButton>
              <MagneticButton>
                <GradientButton asChild>
                  <a href={whatsappHref} rel="noreferrer" target="_blank">
                    <MessageCircle aria-hidden="true" className="size-4" />
                    WhatsApp Us
                  </a>
                </GradientButton>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
