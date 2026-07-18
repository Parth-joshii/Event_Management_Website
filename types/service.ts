import type { LucideIcon } from "lucide-react";

export interface ServiceOffering {
  readonly description: string;
  readonly fallbackClassName: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly included: readonly string[];
  readonly title: string;
}
