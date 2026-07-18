import type { ServiceCategory } from "@/types/site";
import type { LucideIcon } from "lucide-react";

export type EventLifecycleStage =
  "draft" | "quoted" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface EventLead {
  readonly category: ServiceCategory;
  readonly city: string;
  readonly guestCount?: number;
  readonly plannedDate?: string;
  readonly stage: EventLifecycleStage;
}

export interface EventCategoryPreview {
  readonly description: string;
  readonly fallbackClassName: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly title: string;
}

export type PortfolioEventCategory =
  | "Luxury Weddings"
  | "Corporate"
  | "Birthday"
  | "Private"
  | "College"
  | "Religious"
  | "Destination Wedding";

export interface PortfolioEvent {
  readonly budgetRange: string;
  readonly category: PortfolioEventCategory;
  readonly challenges: readonly string[];
  readonly clientName: string;
  readonly clientReview: string;
  readonly clientStory: string;
  readonly decorationTheme: string;
  readonly duration: string;
  readonly entertainment: string;
  readonly fallbackClassName: string;
  readonly finalResult: string;
  readonly food: string;
  readonly gallery: readonly string[];
  readonly guestCount: number;
  readonly heroImage: string;
  readonly heroImageAlt: string;
  readonly lighting: string;
  readonly location: string;
  readonly photography: string;
  readonly servicesUsed: readonly string[];
  readonly slug: string;
  readonly solutions: readonly string[];
  readonly testimonial: string;
  readonly theme: string;
  readonly timeline: readonly {
    readonly description: string;
    readonly label: string;
  }[];
  readonly title: string;
  readonly venue: string;
  readonly videoSrc: string;
  readonly year: number;
}
