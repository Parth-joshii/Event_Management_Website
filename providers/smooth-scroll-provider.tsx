"use client";

import * as React from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  readonly children: React.ReactNode;
}

/** Provides Lenis smooth scrolling while honoring reduced-motion preferences. */
export function SmoothScrollProvider({
  children
}: SmoothScrollProviderProps): React.ReactElement {
  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.85
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
