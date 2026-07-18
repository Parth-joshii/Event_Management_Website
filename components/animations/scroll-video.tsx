"use client";

import * as React from "react";
import { registerGsapPlugins, ScrollTrigger } from "@/animations/gsap";
import { cn } from "@/lib/utils";

interface ScrollVideoProps {
  readonly className?: string;
  readonly enabled: boolean;
  readonly poster?: string;
  readonly src: string;
}

/** Connects hero video progress to scroll position when the asset is available. */
export function ScrollVideo({
  className,
  enabled,
  poster,
  src
}: ScrollVideoProps): React.ReactElement {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasVideoError, setHasVideoError] = React.useState(!enabled);

  React.useEffect(() => {
    if (!enabled || hasVideoError || !sectionRef.current || !videoRef.current) {
      return;
    }

    registerGsapPlugins();

    const video = videoRef.current;
    const trigger = ScrollTrigger.create({
      end: "bottom top",
      onUpdate: (self) => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration * self.progress;
        }
      },
      scrub: true,
      start: "top top",
      trigger: sectionRef.current
    });

    void video.play().catch(() => {
      video.controls = false;
    });

    return () => {
      trigger.kill();
    };
  }, [enabled, hasVideoError]);

  return (
    <div ref={sectionRef} className={cn("absolute inset-0", className)}>
      {!hasVideoError ? (
        <video
          ref={videoRef}
          aria-label="Luxury event celebration background"
          autoPlay
          className="size-full object-cover"
          loop
          muted
          onError={() => setHasVideoError(true)}
          playsInline
          poster={poster}
          preload="metadata"
          src={src}
        />
      ) : (
        <div className="relative size-full overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(212,175,55,0.55),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(191,162,219,0.7),transparent_30%),linear-gradient(135deg,#2D2238_0%,#6f5689_44%,#BFA2DB_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0,transparent_28%,rgba(212,175,55,0.18)_50%,transparent_74%)]" />
          <div className="absolute top-[18%] left-[12%] size-24 rounded-full border border-white/30 bg-white/10 blur-[1px]" />
          <div className="absolute right-[14%] bottom-[16%] size-36 rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/15 blur-sm" />
          <div className="absolute top-[58%] left-[46%] size-16 rounded-full border border-[#EBDCFB]/50 bg-[#EBDCFB]/20" />
        </div>
      )}
    </div>
  );
}
