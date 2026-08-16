import Image from "next/image";
import * as React from "react";
import { publicAssetExists } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  readonly alt: string;
  readonly className?: string;
  readonly fallbackClassName: string;
  readonly imageClassName?: string;
  readonly priority?: boolean;
  readonly sizes: string;
  readonly src: string;
  readonly title?: string;
}

/** Renders a Next image when available, otherwise a branded visual fallback. */
export function ResponsiveImage({
  alt,
  className,
  fallbackClassName,
  imageClassName,
  priority = false,
  sizes,
  src,
  title
}: ResponsiveImageProps): React.ReactElement {
  const hasImage = publicAssetExists(src);
  const usesInlineSource = src.startsWith("data:") || src.startsWith("blob:");

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {hasImage ? (
        usesInlineSource ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt}
            className={cn("absolute inset-0 size-full object-cover", imageClassName)}
            src={src}
          />
        ) : (
          <Image
            alt={alt}
            className={cn("object-cover", imageClassName)}
            fill
            priority={priority}
            sizes={sizes}
            src={src}
          />
        )
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
