export type ThemeCategory =
  | "Royal Palace"
  | "Traditional"
  | "Modern Luxury"
  | "Minimal"
  | "Boho"
  | "White Floral"
  | "Garden Wedding"
  | "Destination"
  | "Vintage"
  | "Luxury Gold"
  | "Pastel"
  | "Mandap Themes"
  | "Reception Stage"
  | "Haldi Theme"
  | "Mehndi Theme";

export interface EventTheme {
  readonly category: ThemeCategory;
  readonly colorPalette: readonly string[];
  readonly description: string;
  readonly fallbackClassName: string;
  readonly flowersUsed: readonly string[];
  readonly gallery: readonly string[];
  readonly heroImage: string;
  readonly idealGuestCount: string;
  readonly lightingUsed: readonly string[];
  readonly recommendedBudget: string;
  readonly recommendedThemeSlugs: readonly string[];
  readonly slug: string;
  readonly suitableVenues: readonly string[];
  readonly title: string;
  readonly videoSrc: string;
}
