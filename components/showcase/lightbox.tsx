"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download, Heart, Share2, X } from "lucide-react";
import { ShowcaseImage } from "@/components/showcase/showcase-image";
import type { GalleryImageItem } from "@/types/gallery";

interface LightboxProps {
  readonly favourites: ReadonlySet<string>;
  readonly items: readonly GalleryImageItem[];
  readonly onClose: () => void;
  readonly onFavouriteToggle: (id: string) => void;
  readonly openId?: string;
  readonly setOpenId: (id: string) => void;
}

/** Renders a fullscreen gallery lightbox with keyboard and touch navigation. */
export function Lightbox({
  favourites,
  items,
  onClose,
  onFavouriteToggle,
  openId,
  setOpenId
}: LightboxProps): React.ReactElement | null {
  const activeIndex = openId ? items.findIndex((item) => item.id === openId) : -1;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;
  const touchStartX = React.useRef<number | null>(null);

  const goToIndex = React.useCallback(
    (index: number) => {
      const next = items[(index + items.length) % items.length];
      if (next) {
        setOpenId(next.id);
      }
    },
    [items, setOpenId]
  );

  React.useEffect(() => {
    if (!activeItem) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        goToIndex(activeIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        goToIndex(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, activeItem, goToIndex, onClose]);

  if (!activeItem) {
    return null;
  }

  const share = async () => {
    const shareData = {
      text: activeItem.description,
      title: activeItem.caption,
      url: window.location.href
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
  };

  return (
    <div
      aria-label="Fullscreen gallery"
      aria-modal="true"
      className="fixed inset-0 z-100 bg-[#140f1d]/96 text-white backdrop-blur-xl"
      role="dialog"
      onTouchEnd={(event) => {
        if (touchStartX.current === null) {
          return;
        }
        const delta = event.changedTouches[0]?.clientX ?? touchStartX.current;
        if (touchStartX.current - delta > 50) {
          goToIndex(activeIndex + 1);
        }
        if (delta - touchStartX.current > 50) {
          goToIndex(activeIndex - 1);
        }
        touchStartX.current = null;
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <p className="text-sm font-semibold">
          {activeIndex + 1} / {items.length}
        </p>
        <div className="flex gap-2">
          <button
            aria-label="Share image"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/20"
            onClick={() => void share()}
            type="button"
          >
            <Share2 aria-hidden="true" className="size-4" />
          </button>
          <a
            aria-label="Download image"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/20"
            download={activeItem.filename}
            href={activeItem.imageSrc}
          >
            <Download aria-hidden="true" className="size-4" />
          </a>
          <button
            aria-label="Close gallery"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/20"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <button
        aria-label="Previous image"
        className="absolute top-1/2 left-4 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/20 md:flex"
        onClick={() => goToIndex(activeIndex - 1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        aria-label="Next image"
        className="absolute top-1/2 right-4 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/20 md:flex"
        onClick={() => goToIndex(activeIndex + 1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
      <div className="grid h-full grid-rows-[1fr_auto] pt-16">
        <div className="relative mx-auto w-full max-w-6xl px-4">
          <ShowcaseImage
            alt={activeItem.alt}
            className="h-full min-h-[52vh] rounded-lg"
            fallbackClassName={activeItem.fallbackClassName}
            imageClassName="object-contain"
            sizes="100vw"
            src={activeItem.imageSrc}
            title={activeItem.caption}
          />
        </div>
        <div className="border-t border-white/10 bg-white/5 p-4">
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-xl font-semibold">{activeItem.eventName}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {activeItem.description}
              </p>
              <p className="mt-2 text-xs text-white/50">
                {activeItem.location} - {activeItem.category} - {activeItem.theme} -{" "}
                {activeItem.photographer}
              </p>
            </div>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              onClick={() => onFavouriteToggle(activeItem.id)}
              type="button"
            >
              <Heart
                aria-hidden="true"
                className={
                  favourites.has(activeItem.id) ? "size-4 fill-current" : "size-4"
                }
              />
              Favourite
            </button>
          </div>
          <div className="mx-auto mt-4 flex max-w-6xl gap-2 overflow-x-auto">
            {items.map((item) => (
              <button
                aria-label={`Open ${item.caption}`}
                className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-white/15"
                key={item.id}
                onClick={() => setOpenId(item.id)}
                type="button"
              >
                <ShowcaseImage
                  alt={item.alt}
                  className="size-full"
                  fallbackClassName={item.fallbackClassName}
                  sizes="80px"
                  src={item.imageSrc}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
