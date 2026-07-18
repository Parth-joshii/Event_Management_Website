import * as React from "react";
import { cn } from "@/lib/utils";

/** Renders an accessible loading placeholder for pending UI regions. */
export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
