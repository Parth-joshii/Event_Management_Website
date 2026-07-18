import { MapPin, Users } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { VenueShowcaseItem } from "@/types/venue";

interface VenueCardProps {
  readonly venue: VenueShowcaseItem;
}

/** Renders a premium venue explorer card. */
export function VenueCard({ venue }: VenueCardProps): React.ReactElement {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.title} ${venue.location}`
  )}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70">
      <ResponsiveImage
        alt={venue.heroImageAlt}
        className="h-64"
        fallbackClassName={venue.fallbackClassName}
        imageClassName="transition duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 50vw, 100vw"
        src={venue.heroImage}
        title={venue.title}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#2D2238]">{venue.title}</h3>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#5c4b6e]">
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 text-[#7d5ea1]" />
            {venue.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users aria-hidden="true" className="size-4 text-[#7d5ea1]" />
            {venue.capacity} guests
          </span>
        </div>
        <p className="mt-4 text-sm font-semibold text-[#2D2238]">{venue.priceRange}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {venue.facilities.map((facility) => (
            <span
              className="rounded-full bg-[#FAF7FF] px-3 py-1 text-xs font-medium text-[#7d5ea1]"
              key={facility}
            >
              {facility}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <GradientButton asChild>
            <a href="#contact">Book Venue</a>
          </GradientButton>
          <GradientButton asChild tone="light">
            <a href={mapsHref} rel="noreferrer" target="_blank">
              Google Maps
            </a>
          </GradientButton>
        </div>
      </div>
    </article>
  );
}
