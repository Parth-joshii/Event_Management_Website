"use client";

import * as React from "react";
import { AnimationProvider } from "@/providers/animation-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/providers/theme-provider";

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

/** Composes all client providers required by the application shell. */
export function AppProviders({ children }: AppProvidersProps): React.ReactElement {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AnimationProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AnimationProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
