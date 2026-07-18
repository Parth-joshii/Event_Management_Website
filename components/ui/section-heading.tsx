import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly align?: "center" | "left";
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
}

/** Renders consistent premium section headings. */
export function SectionHeading({
  align = "center",
  description,
  eyebrow,
  title
}: SectionHeadingProps): React.ReactElement {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left"
      )}
    >
      {eyebrow ? (
        <Badge className="mb-4 border-[#D4AF37]/30 bg-[#EBDCFB]/70 text-[#2D2238]">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-normal text-balance text-[#2D2238] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-8 text-[#5c4b6e] sm:text-lg",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
