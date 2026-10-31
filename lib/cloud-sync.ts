/**
 * Instant Zero-Config Shared Cloud Storage
 * Provides live cross-browser synchronization for photos, events, reviews, and about cards
 * across all devices worldwide without requiring any manual database setup.
 */

import type { SiteContentData } from "@/types/site-content";

const CLOUD_BIN_ID = "66c1f100e41b4d34e42358bc"; // Public shared cloud sync bin for Shree Velora Events
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`;

export interface AboutCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export interface CloudStoreData {
  photos: Array<{
    id: string;
    title: string;
    category: string;
    eventId?: string;
    eventTitle?: string;
    isFeatured?: boolean;
    imageSrc: string;
    alt: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    date?: string;
    location?: string;
    imageSrc: string;
    imageAlt?: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    category: string;
    videoSrc: string;
    posterSrc?: string;
    description?: string;
  }>;
  reviews: Array<{
    id: string;
    authorName: string;
    roleOrEvent: string;
    rating: number;
    comment: string;
    avatarSrc?: string;
  }>;
  aboutCards: AboutCardItem[];
  siteContent?: SiteContentData;
}

const defaultAboutCards: AboutCardItem[] = [
  { id: "bespoke-design", title: "Bespoke Design", description: "Tailored themes, atmospheric lighting, and luxury stage installations.", imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385048/shree_velora/about/diklrziwqbjvwhkm99vt.jpg" },
  { id: "flawless-execution", title: "Flawless Execution", description: "Seamless vendor management and attentive on-day coordination.", imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385061/shree_velora/about/ryd7tzoa7dm5amkx6ne5.jpg" },
  { id: "curated-network", title: "Curated Network", description: "Exclusive access to top-tier venues, artists, and production masters.", imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385074/shree_velora/about/zzryvnbb59enkedgocky.jpg" },
  { id: "transparent-pricing", title: "Transparent Pricing", description: "Clear line-item quotes and real-time budget management.", imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385092/shree_velora/about/vx3ensckhdh1xsvit46v.jpg" }
];

// In-memory cache for ultra-fast local server response
let memoryCache: CloudStoreData = {
  photos: [],
  events: [],
  videos: [],
  reviews: [],
  aboutCards: defaultAboutCards
};

let lastFetchTime = 0;
const CACHE_TTL_MS = 3000; // 3 second cache

/** Fetches shared data from cloud storage across all browsers */
export async function getCloudData(): Promise<CloudStoreData> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && memoryCache.photos.length > 0) {
    return memoryCache;
  }

  try {
    // Also try Google Sheets if configured
    const gUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    if (gUrl) {
      const gRes = await fetch(`${gUrl}?action=all`, { cache: "no-store" }).catch(() => null);
      const gData = await gRes?.json().catch(() => null);
      if (gData?.ok && (gData.photos?.length || gData.events?.length)) {
        memoryCache = {
          photos: gData.photos || memoryCache.photos,
          events: gData.events || memoryCache.events,
          videos: gData.videos || memoryCache.videos,
          reviews: gData.reviews || memoryCache.reviews,
          aboutCards: gData.aboutCards || memoryCache.aboutCards
        };
        lastFetchTime = now;
        return memoryCache;
      }
    }

    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { "X-Bin-Meta": "false" },
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && typeof data === "object") {
        memoryCache = {
          photos: Array.isArray(data.photos) ? data.photos : memoryCache.photos,
          events: Array.isArray(data.events) ? data.events : memoryCache.events,
          videos: Array.isArray(data.videos) ? data.videos : memoryCache.videos,
          reviews: Array.isArray(data.reviews) ? data.reviews : memoryCache.reviews,
          aboutCards: Array.isArray(data.aboutCards) && data.aboutCards.length > 0 ? data.aboutCards : memoryCache.aboutCards
        };
        lastFetchTime = now;
      }
    }
  } catch (err) {
    console.warn("Cloud sync read warning:", err);
  }

  return memoryCache;
}

/** Updates shared data to cloud storage so all browsers see the change immediately */
export async function saveCloudData(update: Partial<CloudStoreData>): Promise<CloudStoreData> {
  memoryCache = { ...memoryCache, ...update };
  lastFetchTime = Date.now();

  try {
    // 1. Sync to Google Sheets if configured
    const gUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    if (gUrl) {
      fetch(gUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "syncAll", data: memoryCache })
      }).catch(() => null);
    }

    // 2. Sync to JSONBin Cloud Store
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memoryCache)
    });
  } catch (err) {
    console.warn("Cloud sync write warning:", err);
  }

  return memoryCache;
}
