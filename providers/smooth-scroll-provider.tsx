"use client";

import * as React from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  readonly children: React.ReactNode;
}

/** Provides ultra-smooth Lenis momentum scrolling while honoring reduced-motion preferences. */
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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      prevent: (node) => {
        if (!node || typeof node.closest !== "function") return false;
        return Boolean(
          node.closest("[data-lenis-prevent]") ||
          node.closest('[role="dialog"]') ||
          node.closest("[data-slot='dialog-content']") ||
          node.closest(".overflow-y-auto")
        );
      }
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    // Smooth scroll for anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, { offset: -60, duration: 1.4 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

