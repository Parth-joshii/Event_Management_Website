"use client";

import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ShowcaseImageProps {
  readonly alt: string;
  readonly className?: string;
  readonly fallbackClassName: string;
  readonly imageClassName?: string;
  readonly priority?: boolean;
  readonly sizes: string;
  readonly src: string;
  readonly title?: string;
}

/** Renders an optimized image with a branded client-side fallback. */
export function ShowcaseImage({
  alt,
  className,
  fallbackClassName,
  imageClassName,
  priority = false,
  sizes,
  src,
  title
}: ShowcaseImageProps): React.ReactElement {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!hasError ? (
        <Image
          alt={alt}
          className={cn("object-cover", imageClassName)}
          fill
          onError={() => setHasError(true)}
          priority={priority}
          sizes={sizes}
          src={src}
        />
      ) : (
        <div
          aria-label={alt}
          className={cn(
            "flex size-full items-end bg-gradient-to-br p-5",
            fallbackClassName
          )}
          role="img"
        >
          {title ? (
            <span className="rounded-md border border-white/30 bg-white/20 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur">
              {title}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
