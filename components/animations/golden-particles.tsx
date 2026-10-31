"use client";

import * as React from "react";

interface GoldenParticlesProps {
  readonly count?: number;
  readonly className?: string;
}

/**
 * Renders lightweight floating golden dust & bokeh sparkles for royal celebrations.
 */
export function GoldenParticles({
  count = 18,
  className = ""
}: GoldenParticlesProps): React.ReactElement {
  // Deterministic seed generation prevents hydration mismatch between server and client
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = ((i * 37) % 94) + 3; // 3% to 97%
      const top = ((i * 53) % 88) + 6;
      const size = (i % 3) + 2.5; // 2.5px to 4.5px
      const duration = 5 + (i % 5) * 1.5; // 5s to 11s
      const delay = (i % 6) * 0.7;
      const opacity = 0.35 + (i % 5) * 0.12;

      return { id: i, left, top, size, duration, delay, opacity };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.85)]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}

