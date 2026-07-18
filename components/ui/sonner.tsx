"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Renders global toast notifications with theme-aware styling. */
export function Toaster({ ...props }: ToasterProps): React.ReactElement {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          actionButton:
            "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
          cancelButton:
            "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground",
          description: "group-[.toast]:text-muted-foreground",
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg"
        }
      }}
      {...props}
    />
  );
}
