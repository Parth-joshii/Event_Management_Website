"use client";

import * as React from "react";
import { Images, Maximize2, X } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useContentStore, type PhotoItem } from "@/stores/content-store";
import { dedupePhotosByImageSrc } from "@/lib/photo-utils";
import { cn, resolveRenderableImageSrc } from "@/lib/utils";

export interface GalleryDisplayItem {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  alt: string;
  photoCount: number;
  photos: PhotoItem[];
}

/** Renders the dynamic showcase gallery grouped by Event / Album to prevent duplicate cards. */
export function FeaturedGallerySection(): React.ReactElement {
  const { photos, fetchFromDatabase } = useContentStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [activeAlbum, setActiveAlbum] = React.useState<GalleryDisplayItem | null>(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = React.useState<PhotoItem | null>(null);

  // Sync latest data on client mount
  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  // Group photos by Event or unique Title/Category to eliminate repetitive duplicate cards
  const displayItems = React.useMemo(() => {
    const activePhotos = dedupePhotosByImageSrc(photos);
    const groups: Record<string, PhotoItem[]> = {};
    const standalone: PhotoItem[] = [];

    activePhotos.forEach((ph) => {
      const eventKey = ph.eventId || (ph.eventTitle ? ph.eventTitle.trim().toLowerCase() : null);
      if (eventKey) {
        if (!groups[eventKey]) groups[eventKey] = [];
        groups[eventKey].push(ph);
      } else {
        standalone.push(ph);
      }
    });

    const items: GalleryDisplayItem[] = [];

    // Process event groups (each event gets EXACTLY 1 card)
    Object.values(groups).forEach((groupPhotos) => {
      const uniquePhotos = dedupePhotosByImageSrc(groupPhotos);
      if (uniquePhotos.length === 0) return;
      const cover = uniquePhotos.find((p) => p.isFeatured) || uniquePhotos[0];
      if (!cover) return;
      const displayTitle = cover.eventTitle || cover.title.replace(/\s*#\d+$/, "") || "Event Album";

      items.push({
        id: cover.eventId || cover.id,
        title: displayTitle,
        category: cover.category || "Luxury Event",
        imageSrc: cover.imageSrc,
        alt: cover.alt || displayTitle,
        photoCount: uniquePhotos.length,
        photos: uniquePhotos
      });
    });

    // Process standalone photos
    standalone.forEach((ph) => {
      items.push({
        id: ph.id,
        title: ph.title,
        category: ph.category,
        imageSrc: ph.imageSrc,
        alt: ph.alt || ph.title,
        photoCount: 1,
        photos: [ph]
      });
    });

    return items;
  }, [photos]);

  // Extract unique categories for filtering
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    displayItems.forEach((item) => set.add(item.category));
    return ["All", ...Array.from(set)];
  }, [displayItems]);

  // Filter display items
  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "All") return displayItems;
    return displayItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [displayItems, selectedCategory]);

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
        {categories.length > 1 ? (
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
        ) : null}

        {filteredItems.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#EBDCFB] bg-white px-6 py-10 text-center shadow-sm">
            <p className="font-semibold text-[#2D2238]">No uploaded photos are available yet.</p>
            <p className="mt-2 text-sm text-[#5c4b6e]">
              Once the admin uploads photos to the shared gallery, they will appear here for everyone.
            </p>
          </div>
        ) : (
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {filteredItems.map((item, index) => (
              <div key={item.id || item.title} className="mb-6 break-inside-avoid">
                <Reveal delay={index * 0.04}>
                  <article
                    onClick={() => {
                      if (item.photos.length > 1) {
                        setActiveAlbum(item);
                      } else {
                        setActiveLightboxPhoto(item.photos[0] || null);
                      }
                    }}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/80 bg-[#1E1428] shadow-[0_20px_60px_rgba(45,34,56,0.14)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(45,34,56,0.28)] hover:border-[#D4AF37]/60"
                  >
                    {/* Natural Image Box - Automatically adapts to photo's natural aspect ratio */}
                    <div className="relative w-full overflow-hidden bg-[#181122]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={item.alt || item.title}
                        className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        src={resolveRenderableImageSrc(item.imageSrc)}
                        loading="lazy"
                      />
                      {/* Targeted bottom gradient for sharp contrast on captions while keeping the upper photo completely clear */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1F1629]/95 via-[#1F1629]/55 to-transparent transition-opacity duration-300 group-hover:opacity-95" />
                    </div>

                    {/* Album Photo Count Badge */}
                    {item.photoCount > 1 ? (
                      <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#1E1428]/90 px-3 py-1 text-xs font-semibold text-[#D4AF37] backdrop-blur-md shadow-lg">
                        <Images className="size-3.5" />
                        {item.photoCount} Photos
                      </span>
                    ) : null}

                    {/* Hover overlay zoom button */}
                    <div className="absolute top-3.5 right-3.5 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100 shadow-md">
                      <Maximize2 className="size-4 text-[#D4AF37]" />
                    </div>

                    {/* Bottom Caption and Category */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                      <Badge className="border-[#D4AF37]/60 bg-[#D4AF37]/20 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                        {item.category}
                      </Badge>
                      <h3 className="mt-1.5 text-lg sm:text-xl font-bold font-display leading-snug drop-shadow text-white">
                        {item.title}
                      </h3>
                    </div>
                  </article>
                </Reveal>
              </div>
            ))}
          </div>
        )}

        {/* Modal 1: Album Folder Lightbox Dialog (Multiple Photos in Event) */}
        <Dialog open={Boolean(activeAlbum)} onOpenChange={() => setActiveAlbum(null)}>
          <DialogContent
            data-lenis-prevent
            className="max-w-5xl max-h-[88vh] overflow-y-auto bg-[#2D2238] border border-white/20 text-white p-6 sm:p-8 rounded-2xl shadow-2xl custom-scrollbar overscroll-contain"
          >
            <DialogTitle className="sr-only">{activeAlbum?.title || "Event Album Gallery"}</DialogTitle>

            {activeAlbum ? (
              <div>
                <div className="sticky top-0 z-20 -mt-2 bg-[#2D2238]/95 backdrop-blur-md flex items-start justify-between border-b border-white/15 pb-4 pt-2">
                  <div>
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {activeAlbum.category} • Album Gallery
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                      {activeAlbum.title}
                    </h2>
                    <p className="text-sm text-white/70 mt-1">
                      Viewing all {activeAlbum.photoCount} photos uploaded for {activeAlbum.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveAlbum(null)}
                    type="button"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mt-6 columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
                  {activeAlbum.photos.map((ph) => (
                    <div
                      key={ph.id}
                      onClick={() => setActiveLightboxPhoto(ph)}
                      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/20 bg-black/40 cursor-pointer shadow-md transition hover:-translate-y-1 hover:border-[#D4AF37]/60"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveRenderableImageSrc(ph.imageSrc)}
                        alt={ph.title}
                        className="w-full h-auto block object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100 flex items-end p-3 text-xs text-white font-medium">
                        {ph.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Modal 2: Single Photo Full-screen Lightbox Dialog */}
        <Dialog open={Boolean(activeLightboxPhoto)} onOpenChange={() => setActiveLightboxPhoto(null)}>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none text-white">
            <DialogTitle className="sr-only">
              {activeLightboxPhoto?.title || "Photo Lightbox"}
            </DialogTitle>
            {activeLightboxPhoto ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#2D2238] p-4 text-center shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveRenderableImageSrc(activeLightboxPhoto.imageSrc)}
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
