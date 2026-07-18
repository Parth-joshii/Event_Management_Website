import type { LucideIcon } from "lucide-react";

export interface ProcessTimelineItem {
  readonly description: string;
  readonly icon: LucideIcon;
  readonly step: string;
  readonly title: string;
}
