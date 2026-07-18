export type ServiceCategory =
  | "Luxury Weddings"
  | "Corporate Events"
  | "Birthday Parties"
  | "Private Parties"
  | "School & College Events"
  | "Religious Events"
  | "Destination Weddings"
  | "Luxury Decorations"
  | "Photography"
  | "Lighting"
  | "Sound"
  | "SFX"
  | "Artists"
  | "Anchors"
  | "Band"
  | "Ghodi"
  | "Vintage Cars"
  | "Venue Management"
  | "Event Planning";

export interface SiteConfig {
  readonly address: {
    readonly addressCountry: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly streetAddress: string;
  };
  readonly contact: {
    readonly businessHours: string;
    readonly email: string;
    readonly location: string;
    readonly phone: string;
    readonly whatsappNumber: string;
  };
  readonly description: string;
  readonly keywords: readonly string[];
  readonly locale: "en_IN";
  readonly name: string;
  readonly serviceAreas: readonly string[];
  readonly services: readonly ServiceCategory[];
  readonly social: {
    readonly facebook?: string;
    readonly instagram?: string;
    readonly whatsapp?: string;
    readonly youtube?: string;
  };
  readonly tagline: string;
  readonly url: string;
}
