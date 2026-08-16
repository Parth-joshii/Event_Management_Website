export interface PhotoLike {
  readonly imageSrc: string;
}

/** Normalizes a stored photo source so duplicate-looking entries can be compared reliably. */
export function normalizePhotoSrc(src: string): string {
  return src.trim();
}

/** Removes duplicate photos that point at the same image source. */
export function dedupePhotosByImageSrc<T extends PhotoLike>(photos: readonly T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const photo of photos) {
    const key = normalizePhotoSrc(photo.imageSrc);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(photo);
  }

  return unique;
}
