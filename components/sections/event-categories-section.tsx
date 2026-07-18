import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { eventCategories } from "@/features/events/data/event-categories";

/** Renders interactive event category preview cards. */
export function EventCategoriesSection(): React.ReactElement {
  return (
    <section
      id="events"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#2D2238_100%)] py-24 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Event Categories"
            title="Celebrations Crafted For Every Occasion"
            description="Browse the signature categories that will later connect directly with the full gallery and event customization flows."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Reveal delay={index * 0.05} key={category.title}>
                <Link
                  className="group relative block overflow-hidden rounded-lg border border-white/20 shadow-[0_26px_90px_rgba(45,34,56,0.18)] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                  href={category.href}
                >
                  <ResponsiveImage
                    alt={category.imageAlt}
                    className="h-80"
                    fallbackClassName={category.fallbackClassName}
                    imageClassName="transition duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    src={category.imageSrc}
                    title={category.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/88 via-[#2D2238]/22 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/16 backdrop-blur">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="text-2xl font-semibold">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/76">
                      {category.description}
                    </p>
                    <span className="mt-5 inline-flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View Gallery
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
