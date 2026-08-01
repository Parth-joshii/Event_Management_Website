"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, X, Images } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useContentStore, type EventItem, type PhotoItem } from "@/stores/content-store";

/** Renders interactive event category preview cards synced with Admin store & MongoDB. */
export function EventCategoriesSection(): React.ReactElement {
  const { events, photos, fetchFromDatabase } = useContentStore();
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [activePhotoLightbox, setActivePhotoLightbox] = React.useState<PhotoItem | null>(null);

  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  // Filter photos for the active modal event
  const eventPhotos = React.useMemo(() => {
    if (!selectedEvent) return [];
    return photos.filter((ph) => {
      if (ph.eventId && ph.eventId === selectedEvent.id) return true;
      if (ph.eventTitle && ph.eventTitle.toLowerCase() === selectedEvent.title.toLowerCase()) return true;
      if (ph.category.toLowerCase() === selectedEvent.category.toLowerCase()) return true;
      return false;
    });
  }, [photos, selectedEvent]);

  return (
    <section
      id="events"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#2D2238_100%)] py-24 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Signature Occasions"
            title="Distinctive Experiences For Every Celebration"
            description="Click on any event below to explore all photos, decor highlights, and luxury stage setups created by Shree Velora Event's."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((category, index) => {
            const count = photos.filter(
              (p) =>
                p.eventId === category.id ||
                p.eventTitle?.toLowerCase() === category.title.toLowerCase() ||
                p.category.toLowerCase() === category.category.toLowerCase()
            ).length;

            return (
              <Reveal delay={index * 0.05} key={category.id || category.title}>
                <div
                  onClick={() => setSelectedEvent(category)}
                  className="group relative block overflow-hidden rounded-xl border border-white/20 shadow-[0_26px_90px_rgba(45,34,56,0.18)] cursor-pointer"
                >
                  <div className="h-80 w-full overflow-hidden bg-[#2D2238]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={category.imageAlt || category.title}
                      className="size-full object-cover transition duration-700 group-hover:scale-110"
                      src={category.imageSrc}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/gallery/wedding-stage.jpg";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2238]/90 via-[#2D2238]/30 to-transparent" />
                  
                  {count > 0 ? (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#2D2238]/85 px-3 py-1 text-xs font-semibold text-[#D4AF37] backdrop-blur shadow-sm">
                      <Images className="size-3.5" />
                      {count} {count === 1 ? "Photo" : "Photos"}
                    </span>
                  ) : null}

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/16 backdrop-blur text-[#D4AF37]">
                      <Sparkles aria-hidden="true" className="size-4" />
                    </div>
                    <h3 className="text-2xl font-semibold font-display">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/76 line-clamp-2">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur transition duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#2D2238] group-hover:text-[#D4AF37]">
                      View Event Gallery
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Modal: Photos belonging to the clicked Event */}
        <Dialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#2D2238] border border-white/20 text-white p-6 sm:p-8 rounded-2xl shadow-2xl">
            <DialogTitle className="sr-only">{selectedEvent?.title || "Event Gallery"}</DialogTitle>

            {selectedEvent ? (
              <div>
                <div className="flex items-start justify-between border-b border-white/15 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {selectedEvent.category} • {selectedEvent.location || "India"}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-sm text-white/70 mt-1 max-w-2xl">{selectedEvent.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    type="button"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Images className="size-4 text-[#D4AF37]" />
                    Event Photo Gallery ({eventPhotos.length})
                  </h3>

                  {eventPhotos.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {eventPhotos.map((ph) => (
                        <div
                          key={ph.id}
                          onClick={() => setActivePhotoLightbox(ph)}
                          className="group relative h-48 overflow-hidden rounded-xl border border-white/20 bg-black/40 cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ph.imageSrc}
                            alt={ph.alt || ph.title}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition" />
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-xs font-semibold truncate">{ph.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                      <Images className="mx-auto size-8 text-white/40 mb-2" />
                      <p className="text-sm text-white/70 font-medium">
                        No photos added for this event yet.
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Admin can add photos for this event from the Admin Panel (/admin).
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <Link
                      href="#contact"
                      onClick={() => setSelectedEvent(null)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-6 py-2.5 text-xs font-semibold text-[#2D2238] transition hover:bg-[#D4AF37]/90"
                    >
                      Book This Event Theme
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Lightbox for zooming event photo */}
        <Dialog open={Boolean(activePhotoLightbox)} onOpenChange={() => setActivePhotoLightbox(null)}>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none text-white">
            <DialogTitle className="sr-only">{activePhotoLightbox?.title || "Zoom Photo"}</DialogTitle>
            {activePhotoLightbox ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#2D2238] p-4 text-center shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhotoLightbox.imageSrc}
                  alt={activePhotoLightbox.alt}
                  className="max-h-[75vh] w-full rounded-xl object-contain mx-auto"
                />
                <div className="mt-4 text-left px-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{activePhotoLightbox.title}</h3>
                  </div>
                  <button
                    onClick={() => setActivePhotoLightbox(null)}
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
