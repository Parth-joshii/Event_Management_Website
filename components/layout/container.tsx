import * as React from "react";
import { cn } from "@/lib/utils";

/** Constrains page content to the platform's standard readable width. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
