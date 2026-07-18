"use client";

import * as React from "react";
import { EmptyState } from "@/components/showcase/empty-state";
import { GalleryCard } from "@/components/showcase/gallery-card";
import { Lightbox } from "@/components/showcase/lightbox";
import { MasonryLayout } from "@/components/showcase/masonry-layout";
import type { GalleryImageItem } from "@/types/gallery";

interface GalleryGridProps {
  readonly items: readonly GalleryImageItem[];
}

/** Renders the interactive masonry gallery and fullscreen lightbox. */
export function GalleryGrid({ items }: GalleryGridProps): React.ReactElement {
  const [openId, setOpenId] = React.useState<string>();
  const [favourites, setFavourites] = React.useState<ReadonlySet<string>>(
    () => new Set()
  );

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
