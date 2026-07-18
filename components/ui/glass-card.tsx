import * as React from "react";
import { cn } from "@/lib/utils";

/** Renders a soft lavender glass surface. */
export function GlassCard({
  className,
  ...props
}: React.ComponentProps<"article">): React.ReactElement {
  return (
    <article
      className={cn(
        "rounded-lg border border-white/60 bg-white/50 p-6 shadow-[0_20px_70px_rgba(45,34,56,0.08)] backdrop-blur-xl transition duration-300 hover:border-[#D4AF37]/70 hover:bg-white/70",
        className
      )}
      {...props}
    />
  );
}
