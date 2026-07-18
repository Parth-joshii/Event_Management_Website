import * as React from "react";
import { cn } from "@/lib/utils";

/** Provides a compact framed surface for repeated item content. */
export function Card({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

/** Provides the header region inside a card. */
export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="card-header"
      className={cn("grid auto-rows-min gap-1.5 px-6", className)}
      {...props}
    />
  );
}

/** Provides the title text inside a card. */
export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/** Provides the supporting description text inside a card. */
export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/** Provides the main body region inside a card. */
export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

/** Provides the footer region inside a card. */
export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
}
