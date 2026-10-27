"use client";

/**
 * Client-Side Image Upload & Vercel Limit Enforcement Engine
 *
 * Requirements:
 * 1. Follow Vercel serverless payload limits (strictly 4.5 MB ceiling).
 * 2. If an image exceeds the Vercel limit (> 3.8 MB safe threshold), automatically
 *    compress it on the client side using HTML5 Canvas & Blob down to ~1-2 MB before sending.
 * 3. If an image is within the limit, upload directly without lossy re-encoding.
 * 4. Stream directly to Cloudinary CDN via /api/upload and return secure CDN URLs.
 */

// Vercel Serverless Function hard body limit is 4.5 MB (4,718,592 bytes).
// We set our safe client-side threshold to 3.8 MB to account for multipart form overhead.
export const VERCEL_MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024;
export const VERCEL_SAFE_CLIENT_LIMIT_BYTES = 3.8 * 1024 * 1024;

export interface CompressionResult {
  file: File;
  wasCompressed: boolean;
  originalSize: number;
  compressedSize: number;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  storage: string;
  bytes?: number;
  format?: string;
}

/** Check if a File is a compressible image */
export function isCompressibleImage(file: File): boolean {
  if (!file || !file.type) return false;
  const isImageMime = file.type.startsWith("image/");
  // Skip animated GIFs and vector SVGs to preserve animations and vectors
  const isExcluded = file.type === "image/gif" || file.type === "image/svg+xml";
  return isImageMime && !isExcluded;
}

/** Format byte size to human-readable string (e.g. "3.4 MB", "820 KB") */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Checks an image file against the Vercel payload limit.
 * - If file size <= maxBytes (3.8 MB): returns the original file untouched.
 * - If file size > maxBytes: compresses the image on the client side using Canvas
 *   until it fits comfortably under the Vercel limit while preserving luxury visual clarity.
 */
export async function compressImageIfExceedsLimit(
  file: File,
  options: {
    maxBytes?: number;
    maxDimension?: number;
    initialQuality?: number;
  } = {}
): Promise<CompressionResult> {
  const maxBytes = options.maxBytes ?? VERCEL_SAFE_CLIENT_LIMIT_BYTES;
  const maxDimension = options.maxDimension ?? 2560; // 2560px provides stunning 4K/retina clarity
  const initialQuality = options.initialQuality ?? 0.85;

  const originalSize = file.size;

  // 1. If file is already within the Vercel limit or not compressible, return as-is
  if (file.size <= maxBytes || !isCompressibleImage(file)) {
    return {
      file,
      wasCompressed: false,
      originalSize,
      compressedSize: originalSize
    };
  }

  // 2. Compress image using HTML5 Canvas & Blob
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downscale dimensions if exceeding maxDimension, maintaining strict aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          // Canvas 2D unsupported fallback: return original
          resolve({
            file,
            wasCompressed: false,
            originalSize,
            compressedSize: originalSize
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively find optimal quality to guarantee file is below maxBytes
        let quality = initialQuality;
        let blob: Blob | null = await new Promise((res) =>
          canvas.toBlob(res, "image/jpeg", quality)
        );

        while (blob && blob.size > maxBytes && quality > 0.45) {
          quality -= 0.12;
          blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
        }

        // If still exceeding (e.g. extremely complex large photo), reduce resolution by 25%
        if (blob && blob.size > maxBytes) {
          const scaledW = Math.round(width * 0.75);
          const scaledH = Math.round(height * 0.75);
          const secondaryCanvas = document.createElement("canvas");
          secondaryCanvas.width = scaledW;
          secondaryCanvas.height = scaledH;
          const sCtx = secondaryCanvas.getContext("2d");
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = "high";
            sCtx.drawImage(canvas, 0, 0, scaledW, scaledH);
            blob = await new Promise((res) =>
              secondaryCanvas.toBlob(res, "image/jpeg", 0.75)
            );
          }
        }

        URL.revokeObjectURL(objectUrl);

        if (!blob) {
          resolve({
            file,
            wasCompressed: false,
            originalSize,
            compressedSize: originalSize
          });
          return;
        }

        const safeName = file.name.replace(/\.[^.]+$/, ".jpg");
        const compressedFile = new File([blob], safeName, {
          type: "image/jpeg",
          lastModified: Date.now()
        });

        resolve({
          file: compressedFile,
          wasCompressed: true,
          originalSize,
          compressedSize: compressedFile.size
        });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // If image loading fails, resolve original file
      resolve({
        file,
        wasCompressed: false,
        originalSize,
        compressedSize: originalSize
      });
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a single file directly to Cloudinary via /api/upload.
 * Automatically checks and compresses images that exceed Vercel's payload limit.
 */
export async function uploadFileToCloudinary(
  file: File,
  options: {
    folder?: string;
    category?: string;
    onProgress?: (status: string) => void;
  } = {}
): Promise<UploadResult> {
  // 1. Check size and compress if image exceeds Vercel limit
  let fileToUpload = file;
  if (isCompressibleImage(file) && file.size > VERCEL_SAFE_CLIENT_LIMIT_BYTES) {
    const origMb = formatBytes(file.size);
    options.onProgress?.(`Compressing ${file.name} (${origMb}) to meet Vercel limit...`);

    const { file: compressedFile, compressedSize } = await compressImageIfExceedsLimit(file);
    const compMb = formatBytes(compressedSize);
    options.onProgress?.(`Compressed ${origMb} ➜ ${compMb}. Uploading to Cloudinary CDN...`);
    fileToUpload = compressedFile;
  } else {
    options.onProgress?.(`Uploading ${file.name} to Cloudinary CDN...`);
  }

  // 2. Transmit to /api/upload
  const formData = new FormData();
  formData.append("file", fileToUpload);
  if (options.folder) formData.append("folder", options.folder);
  if (options.category) formData.append("category", options.category);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.ok || !data?.url) {
    const errorMsg = data?.message || `Upload failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return {
    url: data.url,
    publicId: data.publicId,
    storage: data.storage || "cloudinary",
    bytes: data.bytes,
    format: data.format
  };
}

/**
 * Uploads multiple image files sequentially with real-time progress callbacks.
 * Pre-compresses any oversized images to strictly respect Vercel limits.
 */
export async function uploadMultipleImagesToCloudinary(
  files: File[],
  options: {
    folder?: string;
    category?: string;
    onProgress?: (current: number, total: number, message: string) => void;
  } = {}
): Promise<Array<{ url: string; publicId?: string; originalName: string }>> {
  const results: Array<{ url: string; publicId?: string; originalName: string }> = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const prefix = `[${i + 1}/${files.length}]`;
    options.onProgress?.(i + 1, files.length, `${prefix} Preparing ${file.name}...`);

    const result = await uploadFileToCloudinary(file, {
      folder: options.folder,
      category: options.category,
      onProgress: (status) => options.onProgress?.(i + 1, files.length, `${prefix} ${status}`)
    });

    results.push({
      url: result.url,
      publicId: result.publicId,
      originalName: file.name
    });
  }

  return results;
}

/** Check server Cloudinary configuration and active cloud name */
export async function checkCloudinaryStatus(): Promise<{
  configured: boolean;
  cloudName: string | null;
}> {
  try {
    const res = await fetch("/api/upload", { method: "GET" });
    const data = await res.json().catch(() => null);
    if (data?.ok && data.cloudinary) {
      return {
        configured: Boolean(data.cloudinary.configured),
        cloudName: data.cloudinary.cloudName || null
      };
    }
    return { configured: false, cloudName: null };
  } catch {
    return { configured: false, cloudName: null };
  }
}
