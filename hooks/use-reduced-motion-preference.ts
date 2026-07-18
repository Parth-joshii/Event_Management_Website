"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** Returns true when the user asks the OS to reduce motion. */
export function useReducedMotionPreference(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
