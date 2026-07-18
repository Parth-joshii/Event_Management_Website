"use client";

import * as React from "react";
import { registerGsapPlugins } from "@/animations/gsap";

interface AnimationProviderProps {
  readonly children: React.ReactNode;
}

/** Initializes animation libraries that require the browser runtime. */
export function AnimationProvider({
  children
}: AnimationProviderProps): React.ReactElement {
  React.useEffect(() => {
    registerGsapPlugins();
  }, []);

  return <>{children}</>;
}
