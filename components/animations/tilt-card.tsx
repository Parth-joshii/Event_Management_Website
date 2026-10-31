"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useMotionTemplate
} from "framer-motion";

interface TiltCardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly maxTilt?: number;
  readonly scale?: number;
  readonly glareOpacity?: number;
}

/**
 * Renders an ultra-luxurious 3D perspective tilt card that responds smoothly
 * to mouse cursor positioning with physics-based spring dampening and a golden spotlight glare.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.02,
  glareOpacity = 0.18
}: TiltCardProps): React.ReactElement {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Spot light position in pixels
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for silky, non-jittery 3D rotation
  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scaleSpring = useSpring(1, springConfig);

  const [isHovered, setIsHovered] = React.useState(false);

  // Dynamic reactive spotlight gradient that tracks cursor movements
  const background = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(212,175,55,${glareOpacity}), transparent 80%)`;

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Update spot coordinates
      mouseX.set(relativeX);
      mouseY.set(relativeY);

      // Normalize to -0.5 to 0.5
      const normalizedX = relativeX / width - 0.5;
      const normalizedY = relativeY / height - 0.5;

      // Invert Y for standard natural 3D tilt
      rotateX.set(-normalizedY * maxTilt * 2);
      rotateY.set(normalizedX * maxTilt * 2);
    },
    [shouldReduceMotion, maxTilt, mouseX, mouseY, rotateX, rotateY]
  );

  const handleMouseEnter = React.useCallback(() => {
    if (shouldReduceMotion) return;
    setIsHovered(true);
    scaleSpring.set(scale);
  }, [shouldReduceMotion, scale, scaleSpring]);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scaleSpring.set(1);
  }, [rotateX, rotateY, scaleSpring]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleSpring,
        transformStyle: "preserve-3d"
      }}
      className={`relative perspective-1000 ${className}`}
    >
      {children}

      {/* Floating golden dynamic cursor spotlight glow */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
          style={{ background }}
        />
      )}
    </motion.div>
  );
}
