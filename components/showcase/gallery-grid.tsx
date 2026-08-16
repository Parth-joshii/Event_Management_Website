"use client";

import * as React from "react";
import { EmptyState } from "@/components/showcase/empty-state";
import { GalleryCard } from "@/components/showcase/gallery-card";
import { Lightbox } from "@/components/showcase/lightbox";
import { MasonryLayout } from "@/components/showcase/masonry-layout";
import { useContentStore } from "@/stores/content-store";
import type { GalleryImageItem } from "@/types/gallery";

interface GalleryGridProps {
  readonly items: readonly GalleryImageItem[];
}

/** Renders the interactive masonry gallery and fullscreen lightbox synced with live MongoDB admin photos. */
export function GalleryGrid({ items: propItems }: GalleryGridProps): React.ReactElement {
  const { photos, fetchFromDatabase } = useContentStore();
  const [openId, setOpenId] = React.useState<string>();
  const [favourites, setFavourites] = React.useState<ReadonlySet<string>>(
    () => new Set()
  );

  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  // Combine static showcase items with live MongoDB photos uploaded by Admin
  const items = React.useMemo(() => {
    if (photos.length === 0) return propItems;
    const mongoItems: GalleryImageItem[] = photos.map((p, idx) => ({
      id: p.id,
      imageSrc: p.imageSrc,
      filename: `photo-${idx}`,
      alt: p.alt || p.title,
      width: 1200,
      height: 900,
      category: "Wedding",
      eventName: p.eventTitle || p.title,
      location: "Udaipur",
      budget: "Luxury",
      theme: "Royal Elegance",
      season: "Winter",
      year: 2026,
      popularity: 100,
      tags: ["luxury", "newest"],
      caption: p.title,
      photographer: "Velora Studios",
      description: p.title,
      fallbackClassName: "bg-[#2D2238]"
    }));
    return [...mongoItems, ...propItems];
  }, [photos, propItems]);

  const toggleFavourite = (id: string) => {
    setFavourites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (items.length === 0) {
    return (
      <EmptyState
        description="Try a different category, budget, theme, location, or search term."
        title="No gallery images match these filters"
      />
    );
  }

  return (
    <>
      <MasonryLayout>
        {items.map((item) => (
          <GalleryCard
            isFavourite={favourites.has(item.id)}
            item={item}
            key={item.id}
            onFavouriteToggle={toggleFavourite}
            onOpen={setOpenId}
          />
        ))}
      </MasonryLayout>
      <Lightbox
        favourites={favourites}
        items={items}
        onClose={() => setOpenId(undefined)}
        onFavouriteToggle={toggleFavourite}
        openId={openId}
        setOpenId={setOpenId}
      />
    </>
  );
}
