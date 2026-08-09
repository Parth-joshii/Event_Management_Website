"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/** Reveals content with liquid-smooth viewport animations. */
export function Reveal({
  children,
  className,
  delay = 0
}: RevealProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }}
      viewport={{ margin: "-60px", once: true }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
    >
      {children}
    </motion.div>
  );
}

