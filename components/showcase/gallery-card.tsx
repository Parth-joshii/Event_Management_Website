"use client";

import { Heart, MapPin, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShowcaseImage } from "@/components/showcase/showcase-image";
import type { GalleryImageItem } from "@/types/gallery";

interface GalleryCardProps {
  readonly isFavourite: boolean;
  readonly item: GalleryImageItem;
  readonly onFavouriteToggle: (id: string) => void;
  readonly onOpen: (id: string) => void;
}

/** Renders a masonry gallery card with premium hover details. */
export function GalleryCard({
  isFavourite,
  item,
  onFavouriteToggle,
  onOpen
}: GalleryCardProps): React.ReactElement {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
      <button
        aria-label={`Open ${item.caption}`}
        className="relative block w-full focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
        onClick={() => onOpen(item.id)}
        type="button"
      >
        <ShowcaseImage
          alt={item.alt}
          className="h-auto min-h-72 w-full"
          fallbackClassName={item.fallbackClassName}
          imageClassName="transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={item.imageSrc}
          title={item.caption}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/82 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/18 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Maximize2 aria-hidden="true" className="size-4" />
        </span>
      </button>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="bg-[#EBDCFB] text-[#2D2238]">{item.category}</Badge>
            <h3 className="mt-3 text-lg font-semibold text-[#2D2238]">
              {item.eventName}
            </h3>
          </div>
          <button
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#EBDCFB] text-[#7d5ea1] transition hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
            onClick={() => onFavouriteToggle(item.id)}
            type="button"
          >
            <Heart
              aria-hidden="true"
              className={isFavourite ? "size-4 fill-current" : "size-4"}
            />
          </button>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#5c4b6e]">
          <MapPin aria-hidden="true" className="size-4" />
          {item.location} - {item.year}
        </p>
        <p className="mt-3 text-sm leading-6 text-[#5c4b6e]">{item.caption}</p>
      </div>
    </article>
  );
}
