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
