"use client";

import * as React from "react";
import { Images, Maximize2, Sparkles, X } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useContentStore, PhotoItem } from "@/stores/content-store";
import { cn } from "@/lib/utils";

/** Renders the dynamic featured gallery section connected to Admin store. */
export function FeaturedGallerySection(): React.ReactElement {
  const { photos } = useContentStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [activeLightboxPhoto, setActiveLightboxPhoto] = React.useState<PhotoItem | null>(null);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    photos.forEach((ph) => set.add(ph.category));
    return ["All", ...Array.from(set)];
  }, [photos]);

  // Filter photos
  const filteredPhotos = React.useMemo(() => {
    if (selectedCategory === "All") return photos;
    return photos.filter((ph) => ph.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [photos, selectedCategory]);

  return (
    <section id="gallery" className="bg-[#FAF7FF] py-24 sm:py-28 text-[#2D2238]">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Showcase Gallery"
            title="Moments Of Beauty, Designed To Be Remembered"
            description="Explore our curated collection of luxury wedding stages, vibrant ceremonies, corporate productions, and bespoke celebrations."
          />
        </Reveal>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer",
                selectedCategory === cat
                  ? "bg-[#2D2238] text-[#D4AF37] shadow-md"
                  : "bg-white border border-[#EBDCFB] text-[#5c4b6e] hover:bg-[#EBDCFB]/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="mt-12 grid auto-rows-[19rem] gap-5 md:grid-cols-3">
          {filteredPhotos.map((item, index) => (
            <Reveal
              className={cn(
                index % 4 === 0 || index % 5 === 3 ? "md:row-span-2 md:auto-rows-auto" : ""
              )}
              delay={index * 0.05}
              key={item.id || item.title}
            >
              <article
                onClick={() => setActiveLightboxPhoto(item)}
                className="group relative size-full overflow-hidden rounded-xl border border-white/80 bg-[#2D2238] shadow-[0_24px_80px_rgba(45,34,56,0.1)] cursor-pointer"
              >
                <img
                  alt={item.alt || item.title}
                  className="size-full object-cover transition duration-700 group-hover:scale-110"
                  src={item.imageSrc}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/gallery/wedding-stage.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/85 via-transparent to-transparent opacity-85 transition duration-300 group-hover:opacity-95" />

                {/* Hover overlay button */}
                <div className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur opacity-0 transition duration-300 group-hover:opacity-100 text-white">
                  <Maximize2 className="size-4" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <Badge className="border-[#D4AF37]/60 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase font-semibold">
                    {item.category}
                  </Badge>
                  <h3 className="mt-2 text-xl font-bold font-display">{item.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Full-screen Lightbox Dialog */}
        <Dialog open={Boolean(activeLightboxPhoto)} onOpenChange={() => setActiveLightboxPhoto(null)}>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none text-white">
            <DialogTitle className="sr-only">
              {activeLightboxPhoto?.title || "Photo Lightbox"}
            </DialogTitle>
            {activeLightboxPhoto ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#2D2238] p-4 text-center shadow-2xl">
                <img
                  src={activeLightboxPhoto.imageSrc}
                  alt={activeLightboxPhoto.alt}
                  className="max-h-[75vh] w-full rounded-xl object-contain mx-auto"
                />
                <div className="mt-4 text-left px-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {activeLightboxPhoto.category}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {activeLightboxPhoto.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveLightboxPhoto(null)}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                    type="button"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </Container>
    </section>
  );
}
