import Link from "next/link";
import { Images } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredGallery } from "@/features/gallery/data/featured-gallery";
import { cn } from "@/lib/utils";

/** Renders the featured gallery preview grid. */
export function FeaturedGallerySection(): React.ReactElement {
  return (
    <section id="gallery" className="bg-[#FAF7FF] py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Featured Gallery"
            title="A Preview Of Signature Event Moments"
            description="A lightbox-ready gallery structure for wedding stages, Haldi decor, receptions, corporate setups, birthday themes, and religious celebrations."
          />
        </Reveal>
        <div className="mt-14 grid auto-rows-[18rem] gap-5 md:grid-cols-3">
          {featuredGallery.map((item, index) => (
            <Reveal
              className={cn(index === 0 || index === 3 ? "md:row-span-2" : "")}
              delay={index * 0.05}
              key={item.title}
            >
              <article className="group relative size-full overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
                <ResponsiveImage
                  alt={item.alt}
                  className="size-full"
                  fallbackClassName={item.fallbackClassName}
                  imageClassName="transition duration-700 group-hover:scale-110"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={item.imageSrc}
                  title={item.category}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/78 via-transparent to-transparent opacity-85" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 flex justify-center">
          <GradientButton asChild>
            <Link href="#events">
              <Images aria-hidden="true" className="size-4" />
              Explore Full Gallery
            </Link>
          </GradientButton>
        </Reveal>
      </Container>
    </section>
  );
}
