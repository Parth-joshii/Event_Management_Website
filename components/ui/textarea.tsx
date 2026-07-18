import * as React from "react";
import { cn } from "@/lib/utils";

/** Renders the standard multi-line input primitive. */
export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">): React.ReactElement {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground flex min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}
