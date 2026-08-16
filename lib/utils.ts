import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges conditional class names while preserving Tailwind conflict rules. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Resolves an application path into an absolute URL for metadata and feeds. */
export function absoluteUrl(path = "/"): string {
  return new URL(
    path,
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ).toString();
}

/**
 * Automatically converts Google Drive share links into direct image URLs.
 * Handles formats like:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function convertDriveUrlToDirectLink(url: string): string {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.includes("googleusercontent.com")) {
    return trimmed;
  }

  // Match /file/d/FILE_ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileDMatch[1]}`;
  }

  // Match id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }

  return trimmed;
}

/**
 * Extracts multiple Google Drive or external image URLs from bulk pasted text (e.g. from Google Drive folder/files).
 */
export function extractDriveUrlsFromText(text: string): string[] {
  if (!text) return [];
  const parts = text.split(/[\n,;\s]+/);
  const result: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (
      trimmed.includes("drive.google.com") ||
      trimmed.includes("googleusercontent.com") ||
      trimmed.startsWith("http")
    ) {
      const converted = convertDriveUrlToDirectLink(trimmed);
      if (converted && !result.includes(converted)) {
        result.push(converted);
      }
    }
  }

  return result;
}

const DRIVE_IMAGE_HOSTS = new Set([
  "drive.google.com",
  "lh3.googleusercontent.com",
  "googleusercontent.com",
  "drive.usercontent.google.com"
]);

/** Detects Google Drive-style image URLs that should be proxied for reliable rendering. */
export function isDriveImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const hostname = new URL(trimmed).hostname.toLowerCase();
    return Array.from(DRIVE_IMAGE_HOSTS).some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return Array.from(DRIVE_IMAGE_HOSTS).some((host) => trimmed.includes(host));
  }
}

/** Resolves an image source into a browser-friendly URL for preview and gallery rendering. */
export function resolveRenderableImageSrc(src: string): string {
  const trimmed = convertDriveUrlToDirectLink(src.trim());
  if (!trimmed) return trimmed;

  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://localhost") ||
    trimmed.startsWith("https://localhost")
  ) {
    return trimmed;
  }

  if (isDriveImageUrl(trimmed)) {
    return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
