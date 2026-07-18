export interface FeaturedGalleryItem {
  readonly alt: string;
  readonly category: string;
  readonly fallbackClassName: string;
  readonly imageSrc: string;
  readonly title: string;
}

export type GalleryCategory =
  | "Wedding"
  | "Haldi"
  | "Mehndi"
  | "Sangeet"
  | "Reception"
  | "Corporate"
  | "Birthday"
  | "Private"
  | "School"
  | "Religious"
  | "Lighting"
  | "Photography"
  | "Decoration"
  | "Drone"
  | "Food"
  | "Stage"
  | "Flowers";

export type GallerySortOption =
  "newest" | "popular" | "trending" | "luxury" | "traditional" | "modern";

export interface GalleryImageItem {
  readonly alt: string;
  readonly budget: "Premium" | "Luxury" | "Royal";
  readonly caption: string;
  readonly category: GalleryCategory;
  readonly description: string;
  readonly eventName: string;
  readonly fallbackClassName: string;
  readonly filename: string;
  readonly height: number;
  readonly id: string;
  readonly imageSrc: string;
  readonly location: string;
  readonly photographer: string;
  readonly popularity: number;
  readonly season: "Spring" | "Summer" | "Monsoon" | "Winter";
  readonly tags: readonly GallerySortOption[];
  readonly theme: string;
  readonly width: number;
  readonly year: number;
}
