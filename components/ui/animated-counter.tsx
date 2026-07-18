"use client";

import * as React from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
  readonly duration?: number;
  readonly suffix?: string;
  readonly value: number;
}

/** Animates a number when it enters the viewport. */
export function AnimatedCounter({
  duration = 1.6,
  suffix = "",
  value
}: AnimatedCounterProps): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { margin: "-80px", once: true });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) {
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });

    return controls.stop;
  }, [duration, isInView, motionValue, value]);

  return (
    <motion.span ref={ref}>
      {displayValue}
      {suffix}
    </motion.span>
  );
}
