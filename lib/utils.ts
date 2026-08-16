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

  // Match /file/d/FILE_ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Match id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
}
