import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ComponentProps<"button"> {
  readonly asChild?: boolean;
  readonly tone?: "dark" | "light";
}

/** Renders a premium lavender-gold call-to-action button. */
export function GradientButton({
  asChild = false,
  className,
  tone = "dark",
  ...props
}: GradientButtonProps): React.ReactElement {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold shadow-[0_16px_38px_rgba(45,34,56,0.2)] transition duration-300 focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
        tone === "dark"
          ? "bg-gradient-to-r from-[#2D2238] via-[#7d5ea1] to-[#D4AF37] text-white hover:shadow-[0_20px_46px_rgba(45,34,56,0.28)]"
          : "border border-white/70 bg-white/90 text-[#2D2238] hover:border-[#D4AF37]/70 hover:bg-white",
        className
      )}
      {...props}
    />
  );
}
