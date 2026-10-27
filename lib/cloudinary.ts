import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

function cleanEnv(val?: string | null): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

/** Get and sanitize Cloudinary credentials from environment variables */
export function getCloudinaryCredentials() {
  const cloudName = cleanEnv(
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
  const apiKey = cleanEnv(
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  );
  const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);
  const cloudinaryUrl = cleanEnv(process.env.CLOUDINARY_URL);

  return { cloudName, apiKey, apiSecret, cloudinaryUrl };
}

/**
 * Configure Cloudinary with environment credentials dynamically.
 * Supports individual variables or the consolidated CLOUDINARY_URL.
 */
export function configureCloudinary(): boolean {
  const { cloudName, apiKey, apiSecret, cloudinaryUrl } = getCloudinaryCredentials();

  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true
    });
    return true;
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }

  return false;
}

/** Check if Cloudinary is configured with valid credentials */
export function isCloudinaryConfigured(): boolean {
  return configureCloudinary();
}

/** Get the configured cloud name if available */
export function getCloudinaryCloudName(): string | null {
  const { cloudName, cloudinaryUrl } = getCloudinaryCredentials();
  if (cloudName) return cloudName;
  if (cloudinaryUrl) {
    try {
      const parsed = new URL(cloudinaryUrl);
      return parsed.hostname || null;
    } catch {
      return null;
    }
  }
  return null;
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "auto" | "raw";
  tags?: string[];
  publicId?: string;
}

/**
 * Uploads a file buffer to Cloudinary.
 * Applies automatic WebP/AVIF format optimization and quality compression.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file."
    );
  }

  const folder = options.folder || "shree_velora/gallery";
  const resourceType = options.resourceType || "image";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: options.publicId,
        tags: options.tags || ["shree_velora", "events"],
        // Automatically optimize images on Cloudinary
        fetch_format: "auto",
        quality: "auto"
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          const errMsg =
            (error && typeof error === "object" && "message" in error && typeof error.message === "string")
              ? error.message
              : (error ? String(error) : "Cloudinary upload failed: no result returned");
          reject(new Error(errMsg));
          return;
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary by its publicId.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  if (!isCloudinaryConfigured()) {
    return { result: "not_configured" };
  }

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return response as { result: string };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deletion failed";
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, message);
    return { result: "error" };
  }
}

/**
 * Extracts the Cloudinary public_id from a Cloudinary URL.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v12345/shree_velora/gallery/sample.jpg"
 * -> "shree_velora/gallery/sample"
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/;
    const match = url.match(regex);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export { cloudinary };
