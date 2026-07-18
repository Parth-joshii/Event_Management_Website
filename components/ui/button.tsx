import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default"
    },
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        icon: "size-10",
        lg: "h-11 px-6",
        sm: "h-9 px-3"
      },
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        ghost: "hover:bg-accent/12 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        luxury: "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent/10 hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"
      }
    }
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
}

/** Renders the primary command primitive used across the platform. */
export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps): React.ReactElement {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
