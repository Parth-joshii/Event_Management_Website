export interface VenueShowcaseItem {
  readonly amenities: readonly string[];
  readonly capacity: number;
  readonly facilities: readonly string[];
  readonly fallbackClassName: string;
  readonly gallery: readonly string[];
  readonly heroImage: string;
  readonly heroImageAlt: string;
  readonly indoor: boolean;
  readonly location: string;
  readonly luxury: boolean;
  readonly nearbyAirport: string;
  readonly nearbyHotels: readonly string[];
  readonly outdoor: boolean;
  readonly parking: boolean;
  readonly pool: boolean;
  readonly priceRange: string;
  readonly recommendedThemes: readonly string[];
  readonly slug: string;
  readonly title: string;
  readonly tourPlaceholder: string;
  readonly venueType: "Banquet" | "Garden" | "Palace" | "Resort" | "Hotel";
  readonly videoSrc: string;
}
