import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:size-3",
  {
    defaultVariants: {
      variant: "default"
    },
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        luxury:
          "border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90",
        outline: "text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"
      }
    }
  }
);

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

/** Displays compact status, category, or metadata labels. */
export function Badge({
  className,
  variant,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ className, variant }))}
      {...props}
    />
  );
}
