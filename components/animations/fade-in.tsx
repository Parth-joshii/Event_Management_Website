"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  readonly delay?: number;
  readonly y?: number;
}

/** Renders a reduced-motion-aware entrance animation wrapper. */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  ...props
}: FadeInProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
