"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

/** Registers GSAP browser plugins once per client runtime. */
export function registerGsapPlugins(): void {
  if (pluginsRegistered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
}

export { gsap, ScrollTrigger };
