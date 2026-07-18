"use client";

import * as React from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { ShowcaseImage } from "@/components/showcase/showcase-image";

interface VideoPlayerProps {
  readonly description: string;
  readonly fallbackClassName: string;
  readonly posterSrc: string;
  readonly title: string;
  readonly videoSrc: string;
}

/** Renders a lazy premium video player shell with practical controls. */
export function VideoPlayer({
  description,
  fallbackClassName,
  posterSrc,
  title,
  videoSrc
}: VideoPlayerProps): React.ReactElement {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const togglePlay = async () => {
    if (!videoRef.current || hasError) {
      return;
    }

    if (videoRef.current.paused) {
      await videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
      <div className="relative h-64 bg-[#2D2238]">
        {!hasError ? (
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted={isMuted}
            onError={() => setHasError(true)}
            playsInline
            poster={posterSrc}
            preload="metadata"
            src={videoSrc}
          />
        ) : (
          <ShowcaseImage
            alt={`${title} video preview`}
            className="size-full"
            fallbackClassName={fallbackClassName}
            sizes="(min-width: 1024px) 33vw, 100vw"
            src={posterSrc}
            title={title}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#2D2238]/90 to-transparent p-4 text-white">
          <button
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="flex size-10 items-center justify-center rounded-full bg-white/16 backdrop-blur"
            onClick={() => void togglePlay()}
            type="button"
          >
            {isPlaying ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
          </button>
          <div className="flex gap-2">
            <button
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="flex size-10 items-center justify-center rounded-full bg-white/16 backdrop-blur"
              onClick={() => setIsMuted((value) => !value)}
              type="button"
            >
              {isMuted ? (
                <VolumeX aria-hidden="true" className="size-4" />
              ) : (
                <Volume2 aria-hidden="true" className="size-4" />
              )}
            </button>
            <button
              aria-label="Fullscreen video"
              className="flex size-10 items-center justify-center rounded-full bg-white/16 backdrop-blur"
              onClick={() => void videoRef.current?.requestFullscreen()}
              type="button"
            >
              <Maximize2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-[#2D2238]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#5c4b6e]">{description}</p>
        <p className="mt-3 text-xs font-semibold text-[#7d5ea1]">
          Quality selector ready for CDN integration
        </p>
      </div>
    </article>
  );
}
