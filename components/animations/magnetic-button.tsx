"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/** Adds a subtle magnetic hover response around CTA controls. */
export function MagneticButton({
  children,
  className
}: MagneticButtonProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, stiffness: 180 });
  const springY = useSpring(y, { damping: 18, stiffness: 180 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseLeave={reset}
      onMouseMove={handleMouseMove}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
