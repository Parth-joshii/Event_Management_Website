"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface ParallaxWrapperProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly offset?: number;
}

/** Applies a subtle scroll parallax effect to decorative elements. */
export function ParallaxWrapper({
  children,
  className,
  offset = 48
}: ParallaxWrapperProps): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={shouldReduceMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
