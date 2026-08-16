"use client";

import * as React from "react";
import { Images, Maximize2, X } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useContentStore, type PhotoItem } from "@/stores/content-store";
import { featuredGallery } from "@/features/gallery/data/featured-gallery";
import { cn } from "@/lib/utils";

export interface GalleryDisplayItem {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  alt: string;
  photoCount: number;
  photos: PhotoItem[];
}

const defaultFallbackPhotos: PhotoItem[] = featuredGallery.map((fg, idx) => ({
  id: `fallback-${idx + 1}`,
  title: fg.title,
  category: fg.category,
  eventId: `ev-fallback-${idx + 1}`,
  eventTitle: fg.title,
  isFeatured: idx === 0,
  imageSrc: fg.imageSrc,
  alt: fg.alt
}));

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
    const activePhotos = photos.length > 0 ? photos : defaultFallbackPhotos;
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
      if (groupPhotos.length === 0) return;
      const cover = groupPhotos.find((p) => p.isFeatured) || groupPhotos[0];
      if (!cover) return;
      const displayTitle = cover.eventTitle || cover.title.replace(/\s*#\d+$/, "") || "Event Album";

      items.push({
        id: cover.eventId || cover.id,
        title: displayTitle,
        category: cover.category || "Luxury Event",
        imageSrc: cover.imageSrc,
        alt: cover.alt || displayTitle,
        photoCount: groupPhotos.length,
        photos: groupPhotos
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

        {/* Photo Gallery Grid */}
        <div className="mt-12 grid auto-rows-[19rem] gap-5 md:grid-cols-3">
          {filteredItems.map((item, index) => (
            <Reveal
              className={cn(
                index % 4 === 0 || index % 5 === 3 ? "md:row-span-2 md:auto-rows-auto" : ""
              )}
              delay={index * 0.05}
              key={item.id || item.title}
            >
              <article
                onClick={() => {
                  if (item.photos.length > 1) {
                    setActiveAlbum(item);
                  } else {
                    setActiveLightboxPhoto(item.photos[0] || null);
                  }
                }}
                className="group relative size-full overflow-hidden rounded-xl border border-white/80 bg-[#2D2238] shadow-[0_24px_80px_rgba(45,34,56,0.1)] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={item.alt || item.title}
                  className="size-full object-cover transition duration-700 group-hover:scale-110"
                  src={item.imageSrc}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/85 via-transparent to-transparent opacity-85 transition duration-300 group-hover:opacity-95" />

                {/* Album Photo Count Badge */}
                {item.photoCount > 1 ? (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#2D2238]/85 px-3 py-1 text-xs font-semibold text-[#D4AF37] backdrop-blur shadow-sm">
                    <Images className="size-3.5" />
                    {item.photoCount} Photos
                  </span>
                ) : null}

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

        {/* Modal 1: Album Folder Lightbox Dialog (Multiple Photos in Event) */}
        <Dialog open={Boolean(activeAlbum)} onOpenChange={() => setActiveAlbum(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#2D2238] border border-white/20 text-white p-6 sm:p-8 rounded-2xl shadow-2xl">
            <DialogTitle className="sr-only">{activeAlbum?.title || "Event Album Gallery"}</DialogTitle>

            {activeAlbum ? (
              <div>
                <div className="flex items-start justify-between border-b border-white/15 pb-4">
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

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeAlbum.photos.map((ph) => (
                    <div
                      key={ph.id}
                      onClick={() => setActiveLightboxPhoto(ph)}
                      className="group relative h-48 overflow-hidden rounded-xl border border-white/20 bg-black/40 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ph.imageSrc}
                        alt={ph.title}
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
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
