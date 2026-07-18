"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/** Reveals content with a reduced-motion-aware viewport animation. */
export function Reveal({
  children,
  className,
  delay = 0
}: RevealProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      viewport={{ margin: "-80px", once: true }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
