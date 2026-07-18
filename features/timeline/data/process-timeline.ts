import {
  BadgeIndianRupee,
  Camera,
  ClipboardCheck,
  Lightbulb,
  Sparkles,
  WandSparkles
} from "lucide-react";
import type { ProcessTimelineItem } from "@/types/timeline";

export const processTimeline = [
  {
    description:
      "We understand your occasion, guest profile, venue needs, and celebration goals.",
    icon: ClipboardCheck,
    step: "01",
    title: "Consultation"
  },
  {
    description:
      "Our team builds the mood, theme, decor direction, and event flow around your vision.",
    icon: Lightbulb,
    step: "02",
    title: "Concept & Theme Planning"
  },
  {
    description:
      "You receive a clear budget structure with priorities, inclusions, and premium options.",
    icon: BadgeIndianRupee,
    step: "03",
    title: "Budget & Quotation"
  },
  {
    description:
      "We coordinate decor, artists, sound, lighting, photography, and production partners.",
    icon: WandSparkles,
    step: "04",
    title: "Vendor & Decor Management"
  },
  {
    description:
      "The event day is handled with precision, supervision, and guest-first coordination.",
    icon: Sparkles,
    step: "05",
    title: "Event Execution"
  },
  {
    description:
      "We close the experience with polished memories, galleries, and post-event support.",
    icon: Camera,
    step: "06",
    title: "Celebration & Memories"
  }
] as const satisfies readonly ProcessTimelineItem[];
