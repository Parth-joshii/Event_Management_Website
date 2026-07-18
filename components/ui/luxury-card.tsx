import * as React from "react";
import { cn } from "@/lib/utils";

/** Renders a refined card for premium content blocks. */
export function LuxuryCard({
  className,
  ...props
}: React.ComponentProps<"article">): React.ReactElement {
  return (
    <article
      className={cn(
        "group rounded-lg border border-white/70 bg-white/82 p-6 shadow-[0_20px_70px_rgba(45,34,56,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70 hover:shadow-[0_28px_90px_rgba(45,34,56,0.12)]",
        className
      )}
      {...props}
    />
  );
}
