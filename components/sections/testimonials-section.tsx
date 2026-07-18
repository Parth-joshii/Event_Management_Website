import { Star } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/features/testimonials/data/testimonials";

/** Renders client testimonial preview cards. */
export function TestimonialsSection(): React.ReactElement {
  return (
    <section id="testimonials" className="bg-[#FAF7FF] py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved By Families, Brands, And Celebration Hosts"
            description="A preview of the trust Shree Velora Event's builds through detail, polish, and calm execution."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal delay={index * 0.08} key={testimonial.name}>
              <LuxuryCard className="flex h-full flex-col">
                <div className="flex gap-1 text-[#D4AF37]">
                  {Array.from({ length: testimonial.rating }).map((_, star) => (
                    <Star
                      aria-hidden="true"
                      className="size-4 fill-current"
                      key={star}
                    />
                  ))}
                </div>
                <p className="mt-6 flex-1 text-sm leading-7 text-[#5c4b6e]">
                  "{testimonial.review}"
                </p>
                <div className="mt-7 border-t border-[#EBDCFB] pt-5">
                  <p className="font-semibold text-[#2D2238]">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-[#7d5ea1]">{testimonial.event}</p>
                </div>
              </LuxuryCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
