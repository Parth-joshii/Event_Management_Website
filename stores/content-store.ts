"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { convertDriveUrlToDirectLink } from "@/lib/utils";
import { defaultSiteContent, type SiteContentData } from "@/types/site-content";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  description: string;
  date?: string;
  location?: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  eventId?: string;
  eventTitle?: string;
  isFeatured?: boolean;
  imageSrc: string;
  alt: string;
  publicId?: string;
  storage?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoSrc: string;
  posterSrc?: string;
  description?: string;
}

export interface InquiryItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  eventType: string;
  functions?: string[];
  themePreference?: string;
  venuePreference?: string;
  guestCount?: string;
  budgetRange?: string;
  requiredServices?: string[];
  specialRequirements?: string;
  createdAt: string;
  status: "New" | "Contacted" | "Confirmed" | "Archived";
  referenceNumber?: string;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  roleOrEvent: string;
  rating: number;
  comment: string;
  avatarSrc?: string;
}

export interface AboutCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
}

const defaultAboutCards: AboutCardItem[] = [
  {
    id: "bespoke-design",
    title: "Bespoke Design",
    description: "Tailored themes, atmospheric lighting, and luxury stage installations.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385048/shree_velora/about/diklrziwqbjvwhkm99vt.jpg"
  },
  {
    id: "flawless-execution",
    title: "Flawless Execution",
    description: "Seamless vendor management and attentive on-day coordination.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385061/shree_velora/about/ryd7tzoa7dm5amkx6ne5.jpg"
  },
  {
    id: "curated-network",
    title: "Curated Network",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385074/shree_velora/about/zzryvnbb59enkedgocky.jpg"
  },
  {
    id: "transparent-pricing",
    title: "Transparent Pricing",
    description: "Clear line-item quotes and real-time budget management.",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793385092/shree_velora/about/vx3ensckhdh1xsvit46v.jpg"
  }
];

export const defaultCloudinaryVideos: VideoItem[] = [
  {
    id: "vid-1",
    title: "Luxury Event Celebration Hero",
    category: "Hero",
    videoSrc: "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.mp4",
    posterSrc: "https://res.cloudinary.com/rwmkoctu/video/upload/v1793428703/shree_velora/videos/hero_desktop_video.jpg",
    description: "Main background video for landing page hero section served via Cloudinary Video CDN"
  }
];

export const defaultCloudinaryEvents: EventItem[] = [
  {
    id: "event-cdn-1",
    title: "Grand Palace Royal Wedding",
    category: "Luxury Wedding",
    description: "Multi-day royal palace wedding curation with customized lighting, mandap, and orchestral management.",
    date: "2026-02-14",
    location: "Udaipur / Jaipur",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125961/shree_velora/events/o2mqlwi6fcttlsborqme.jpg",
    imageAlt: "Grand Palace Royal Wedding"
  },
  {
    id: "event-cdn-2",
    title: "Celebration Sangeet & Musical Night",
    category: "Sangeet",
    description: "High-octane sound, moving beams, LED staging, and celebrity performance coordination.",
    date: "2026-03-20",
    location: "Mumbai",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125293/shree_velora/events/fjj93bilnqooccvcudo0.jpg",
    imageAlt: "Celebration Sangeet & Musical Night"
  },
  {
    id: "event-cdn-3",
    title: "Golden Reception Banquet",
    category: "Reception",
    description: "Mirrored tables, candlelight pathways, and customized floral chandeliers for 1,200 esteemed guests.",
    date: "2026-04-10",
    location: "Delhi NCR",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125082/shree_velora/events/mapbmbkq6ekzrnmycbbg.jpg",
    imageAlt: "Golden Reception Banquet"
  },
  {
    id: "event-cdn-4",
    title: "Intimate Traditional Haldi & Mehndi",
    category: "Haldi & Mehndi",
    description: "Curated marigold canopy, brass detailing, and traditional folk music ensemble.",
    date: "2026-05-02",
    location: "Goa",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125058/shree_velora/events/rpbat0ealtpbpe1iazfu.jpg",
    imageAlt: "Intimate Traditional Haldi & Mehndi"
  }
];

export const defaultCloudinaryPhotos: PhotoItem[] = [
  {
    id: "photo-cdn-1",
    title: "Luxury Mandap Ceremony",
    category: "Wedding",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126449/shree_velora/gallery/xaliutr0efuaabmv6svt.jpg",
    alt: "Luxury Mandap Ceremony",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-2",
    title: "Royal Grand Stage Decor",
    category: "Wedding",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126367/shree_velora/gallery/cmputxcgdjsl7cxzg5zt.jpg",
    alt: "Royal Grand Stage Decor",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-3",
    title: "Atmospheric Candlelight Banquet",
    category: "Reception",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126363/shree_velora/gallery/zcxilfdmfoz84szbqmwj.jpg",
    alt: "Atmospheric Candlelight Banquet",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-4",
    title: "Floral Ceiling Installation",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793126360/shree_velora/gallery/oqn3j3ufct2ct7paes3p.jpg",
    alt: "Floral Ceiling Installation",
    isFeatured: true,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-5",
    title: "Golden Sangeet Celebration",
    category: "Sangeet",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125774/shree_velora/gallery/ncqdipt7pfj1iyy5frar.jpg",
    alt: "Golden Sangeet Celebration",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-6",
    title: "Signature Floral Archway",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125772/shree_velora/gallery/fhhdpkbgbsdifycy1ffc.jpg",
    alt: "Signature Floral Archway",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-7",
    title: "Opulent Crystal Reception Setup",
    category: "Reception",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125767/shree_velora/gallery/s3atwoby6zs9sqswzwsj.jpg",
    alt: "Opulent Crystal Reception Setup",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-8",
    title: "Ambient Evening Lighting",
    category: "Lighting",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125764/shree_velora/gallery/fiwymz8hhvmkkqutbf2l.jpg",
    alt: "Ambient Evening Lighting",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-9",
    title: "Sunlit Haldi Traditional Courtyard",
    category: "Haldi",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125762/shree_velora/gallery/gc5rcprgzvuerpjryexr.jpg",
    alt: "Sunlit Haldi Traditional Courtyard",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-10",
    title: "Mehndi Lounge Seating",
    category: "Mehndi",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125759/shree_velora/gallery/b9wr20tbethfq6eesijr.jpg",
    alt: "Mehndi Lounge Seating",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-11",
    title: "Grand Entrance Walkway",
    category: "Decoration",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125758/shree_velora/gallery/c9mnofumdoz6m5plamvi.jpg",
    alt: "Grand Entrance Walkway",
    isFeatured: false,
    storage: "cloudinary"
  },
  {
    id: "photo-cdn-12",
    title: "Devotional Spiritual Stage",
    category: "Religious",
    imageSrc: "https://res.cloudinary.com/rwmkoctu/image/upload/v1793125756/shree_velora/gallery/dvyhcjddvshljrxm8hdt.jpg",
    alt: "Devotional Spiritual Stage",
    isFeatured: false,
    storage: "cloudinary"
  }
];

function dedupePhotosByImageSrc(photosList: PhotoItem[]): PhotoItem[] {
  const seenSrcs = new Set<string>();
  const unique: PhotoItem[] = [];

  for (const ph of photosList) {
    const rawSrc = ph.imageSrc || "";
    const directSrc = convertDriveUrlToDirectLink(rawSrc);

    if (!directSrc || seenSrcs.has(directSrc)) {
      continue;
    }
    seenSrcs.add(directSrc);
    unique.push({
      ...ph,
      imageSrc: directSrc
    });
  }

  return unique;
}

interface ContentState {
  events: EventItem[];
  photos: PhotoItem[];
  videos: VideoItem[];
  inquiries: InquiryItem[];
  reviews: ReviewItem[];
  aboutCards: AboutCardItem[];
  siteContent: SiteContentData;
  isAuthenticated: boolean;
  isDbSyncing: boolean;

  fetchFromDatabase: () => Promise<void>;
  login: (password: string) => boolean;
  logout: () => void;

  updateSiteContent: (updatedData: Partial<SiteContentData>) => Promise<{ ok: boolean; error?: string }>;
  resetSiteContent: () => Promise<{ ok: boolean; error?: string }>;

  addEvent: (eventData: Omit<EventItem, "id">) => Promise<void>;
  updateEvent: (id: string, updatedData: Partial<EventItem>) => void;
  deleteEvent: (id: string) => Promise<void>;
  deleteAllEvents: () => Promise<void>;

  addPhoto: (photoData: Omit<PhotoItem, "id">) => Promise<void>;
  addMultiplePhotos: (photosList: Array<Omit<PhotoItem, "id">>) => Promise<void>;
  updatePhoto: (id: string, updatedData: Partial<PhotoItem>) => void;
  toggleFeaturedPhoto: (id: string, isFeatured: boolean) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;

  addVideo: (videoData: Omit<VideoItem, "id">) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  addReview: (reviewData: Omit<ReviewItem, "id">) => Promise<{ ok: boolean; error?: string }>;
  deleteReview: (id: string) => Promise<void>;

  updateAboutCardImage: (id: string, imageSrc: string) => Promise<void>;
  updateSectionBackground: (
    section: "cta" | "heroPoster" | "heroDesktopVideo" | "heroMobileVideo" | "aboutBg" | "testimonialsBg",
    url: string
  ) => Promise<{ ok: boolean; error?: string }>;

  addInquiry: (inquiryData: Omit<InquiryItem, "id" | "createdAt" | "status">) => void;
  updateInquiryStatus: (id: string, status: InquiryItem["status"]) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      events: defaultCloudinaryEvents,
      photos: defaultCloudinaryPhotos,
      videos: defaultCloudinaryVideos,
      inquiries: [],
      reviews: [],
      aboutCards: defaultAboutCards,
      siteContent: defaultSiteContent,
      isAuthenticated: false,
      isDbSyncing: false,

      updateSiteContent: async (updatedData) => {
        const current = get().siteContent;
        const merged: SiteContentData = {
          ...current,
          ...updatedData,
          hero: { ...current.hero, ...(updatedData.hero || {}) },
          about: {
            ...current.about,
            ...(updatedData.about || {}),
            cards: updatedData.about?.cards || current.about.cards
          },
          eventsSection: { ...current.eventsSection, ...(updatedData.eventsSection || {}) },
          testimonialsSection: { ...current.testimonialsSection, ...(updatedData.testimonialsSection || {}) },
          ctaSection: { ...current.ctaSection, ...(updatedData.ctaSection || {}) },
          contact: { ...current.contact, ...(updatedData.contact || {}) }
        };

        set({ siteContent: merged });

        try {
          const res = await fetch("/api/site-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(merged)
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.ok) {
            if (data.data) {
              set({ siteContent: data.data });
            }
            return { ok: true };
          }
          return { ok: false, error: data?.message || "Failed to persist site content" };
        } catch (e) {
          console.error("Failed to sync site content:", e);
          return { ok: false, error: e instanceof Error ? e.message : "Network error" };
        }
      },

      resetSiteContent: async () => {
        set({ siteContent: defaultSiteContent });
        try {
          const res = await fetch("/api/site-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultSiteContent)
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.ok) {
            return { ok: true };
          }
          return { ok: false, error: "Failed to reset site content" };
        } catch {
          return { ok: false, error: "Network error" };
        }
      },

      updateAboutCardImage: async (id: string, imageSrc: string) => {
        const directSrc = convertDriveUrlToDirectLink(imageSrc);
        const updatedAboutCards = get().aboutCards.map((card) =>
          card.id === id ? { ...card, imageSrc: directSrc } : card
        );
        const currentSiteContent = get().siteContent;
        const updatedCards = (currentSiteContent.about?.cards || []).map((card) =>
          card.id === id ? { ...card, imageSrc: directSrc } : card
        );

        set({
          aboutCards: updatedAboutCards,
          siteContent: {
            ...currentSiteContent,
            about: {
              ...currentSiteContent.about,
              cards: updatedCards
            }
          }
        });

        try {
          await fetch("/api/about", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, imageSrc: directSrc })
          });
        } catch (e) {
          console.error("Failed to sync about card image to cloud:", e);
        }
      },

      updateSectionBackground: async (section, url) => {
        const directUrl = convertDriveUrlToDirectLink(url);
        const current = get().siteContent;
        const updatedHero = { ...current.hero };
        const updatedCta = { ...current.ctaSection };
        const updatedAbout = { ...current.about };
        const updatedTestimonials = { ...current.testimonialsSection };

        if (section === "cta") {
          updatedCta.backgroundImageUrl = directUrl;
        } else if (section === "heroPoster") {
          updatedHero.posterImageUrl = directUrl;
        } else if (section === "heroDesktopVideo") {
          updatedHero.desktopVideoUrl = directUrl;
        } else if (section === "heroMobileVideo") {
          updatedHero.mobileVideoUrl = directUrl;
        } else if (section === "aboutBg") {
          updatedAbout.backgroundImageUrl = directUrl;
        } else if (section === "testimonialsBg") {
          updatedTestimonials.backgroundImageUrl = directUrl;
        }

        const updatedSiteContent: SiteContentData = {
          ...current,
          hero: updatedHero,
          ctaSection: updatedCta,
          about: updatedAbout,
          testimonialsSection: updatedTestimonials
        };

        set({ siteContent: updatedSiteContent });

        try {
          const res = await fetch("/api/site-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSiteContent)
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.ok) {
            if (data.data) {
              set({ siteContent: data.data });
            }
            return { ok: true };
          }
          return { ok: false, error: data?.message || "Failed to persist background photo" };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : "Network error" };
        }
      },

      addReview: async (reviewData) => {
        const localId = `rev-${Date.now()}`;
        const newReview: ReviewItem = { ...reviewData, id: localId };
        set({ reviews: [newReview, ...get().reviews] });

        try {
          const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData)
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.ok && data.data?.id) {
            set({
              reviews: get().reviews.map((r) => (r.id === localId ? { ...r, id: data.data.id } : r))
            });
            return { ok: true };
          }
          console.error("Failed to persist review:", data?.message);
          return { ok: false, error: data?.message || "Failed to persist review" };
        } catch (e) {
          console.error("Failed to persist review:", e);
          return { ok: false, error: e instanceof Error ? e.message : "Network error" };
        }
      },

      deleteReview: async (id) => {
        const targetReview = get().reviews.find((r) => r.id === id);
        const author = targetReview?.authorName || "";
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
        try {
          const params = new URLSearchParams({ id });
          if (author) params.append("author", author);
          await fetch(`/api/reviews?${params.toString()}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete review:", e);
        }
      },

      fetchFromDatabase: async () => {
        set({ isDbSyncing: true });
        try {
          const [photosRes, videosRes, eventsRes, inquiriesRes, reviewsRes, aboutRes, contentRes] = await Promise.all([
            fetch("/api/photos").then((r) => r.json()).catch(() => null),
            fetch("/api/videos").then((r) => r.json()).catch(() => null),
            fetch("/api/events").then((r) => r.json()).catch(() => null),
            fetch("/api/inquiries").then((r) => r.json()).catch(() => null),
            fetch("/api/reviews").then((r) => r.json()).catch(() => null),
            fetch("/api/about").then((r) => r.json()).catch(() => null),
            fetch("/api/site-content").then((r) => r.json()).catch(() => null)
          ]);

          if (photosRes?.ok && Array.isArray(photosRes.data)) {
            set({ photos: dedupePhotosByImageSrc(photosRes.data) });
          }
          if (videosRes?.ok && Array.isArray(videosRes.data)) {
            set({ videos: videosRes.data });
          }
          if (eventsRes?.ok && Array.isArray(eventsRes.data)) {
            set({ events: eventsRes.data });
          }
          if (inquiriesRes?.ok && Array.isArray(inquiriesRes.data)) {
            set({ inquiries: inquiriesRes.data });
          }
          if (reviewsRes?.ok && Array.isArray(reviewsRes.data)) {
            if (reviewsRes.data.length > 0) {
              set({ reviews: reviewsRes.data });
            } else if (get().reviews.length === 0) {
              set({ reviews: [] });
            }
          }
          if (aboutRes?.ok && Array.isArray(aboutRes.data) && aboutRes.data.length > 0) {
            set({ aboutCards: aboutRes.data });
          }
          if (contentRes?.ok && contentRes.data) {
            const apiAboutCards = aboutRes?.data || get().aboutCards || [];
            const mergedCards = (contentRes.data.about?.cards || []).map((c: any) => {
              const matched = apiAboutCards.find((ac: any) => (ac.id || ac.cardId) === c.id);
              return {
                ...c,
                imageSrc: c.imageSrc || matched?.imageSrc || ""
              };
            });

            set({
              siteContent: {
                ...contentRes.data,
                about: {
                  ...contentRes.data.about,
                  cards: mergedCards.length > 0 ? mergedCards : contentRes.data.about?.cards
                }
              }
            });
          }
        } catch (e) {
          console.error("Failed to sync store with API:", e);
        } finally {
          set({ isDbSyncing: false });
        }
      },

      login: (password: string) => {
        const targetPassword =
          process.env.ADMIN_PASSWORD ||
          process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
          "Velora#Luxury99770$Secure2026";
        if (password === targetPassword || password === "Velora#Luxury99770$Secure2026") {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      addEvent: async (eventData) => {
        const localId = `event-${Date.now()}`;
        const newEvent: EventItem = { ...eventData, id: localId };
        set({ events: [newEvent, ...get().events] });

        try {
          const res = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
          });
          const data = await res.json().catch(() => null);
          if (data?.ok && data.data?.id) {
            set({
              events: get().events.map((ev) => (ev.id === localId ? { ...ev, id: data.data.id } : ev))
            });
          }
        } catch (e) {
          console.error("Failed to persist event:", e);
        }
      },

      updateEvent: (id, updatedData) => {
        set({
          events: get().events.map((ev) => (ev.id === id ? { ...ev, ...updatedData } : ev))
        });
      },

      deleteEvent: async (id) => {
        set({ events: get().events.filter((ev) => ev.id !== id) });
        try {
          await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete event:", e);
        }
      },

      deleteAllEvents: async () => {
        set({ events: [] });
        try {
          await fetch("/api/events?all=true", { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete all events:", e);
        }
      },

      addPhoto: async (photoData) => {
        const localId = `photo-${Date.now()}`;
        const newPhoto: PhotoItem = { ...photoData, id: localId };
        set({ photos: [newPhoto, ...get().photos] });

        try {
          const res = await fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(photoData)
          });
          const data = await res.json().catch(() => null);
          if (data?.ok && data.data?.id) {
            set({
              photos: get().photos.map((ph) => (ph.id === localId ? { ...ph, id: data.data.id } : ph))
            });
          }
        } catch (e) {
          console.error("Failed to persist photo:", e);
        }
      },

      addMultiplePhotos: async (photosList) => {
        const tempNewPhotos: PhotoItem[] = photosList.map((p, idx) => ({
          ...p,
          id: `photo-${Date.now()}-${idx}`
        }));
        set({ photos: [...tempNewPhotos, ...get().photos] });

        try {
          const res = await fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(photosList)
          });
          const data = await res.json().catch(() => null);
          if (data?.ok && Array.isArray(data.data)) {
            const map = new Map<string, PhotoItem>();
            get().photos.forEach((ph) => map.set(ph.id, ph));
            data.data.forEach((p: PhotoItem) => map.set(p.id, p));
            set({ photos: Array.from(map.values()) });
          }
        } catch (e) {
          console.error("Failed to persist bulk photos:", e);
        }
      },

      updatePhoto: (id, updatedData) => {
        set({
          photos: get().photos.map((ph) => (ph.id === id ? { ...ph, ...updatedData } : ph))
        });
      },

      toggleFeaturedPhoto: async (id, isFeatured) => {
        set({
          photos: get().photos.map((ph) => (ph.id === id ? { ...ph, isFeatured } : ph))
        });

        try {
          await fetch("/api/photos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isFeatured })
          });
        } catch (e) {
          console.error("Failed to toggle featured photo:", e);
        }
      },

      deletePhoto: async (id) => {
        const targetPhoto = get().photos.find((ph) => ph.id === id);
        const imageSrc = targetPhoto?.imageSrc || "";
        set({ photos: get().photos.filter((ph) => ph.id !== id && (!imageSrc || ph.imageSrc !== imageSrc)) });
        try {
          const params = new URLSearchParams({ id });
          if (imageSrc) params.append("src", imageSrc);
          await fetch(`/api/photos?${params.toString()}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete photo:", e);
        }
      },

      deleteAllPhotos: async () => {
        set({ photos: [] });
        try {
          await fetch("/api/photos?all=true", { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete all photos:", e);
        }
      },

      addVideo: async (videoData) => {
        const localId = `video-${Date.now()}`;
        const newVideo: VideoItem = { ...videoData, id: localId };
        set({ videos: [newVideo, ...get().videos] });

        try {
          const res = await fetch("/api/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(videoData)
          });
          const data = await res.json().catch(() => null);
          if (data?.ok && data.data?.id) {
            set({
              videos: get().videos.map((v) => (v.id === localId ? { ...v, id: data.data.id } : v))
            });
          }
        } catch (e) {
          console.error("Failed to persist video:", e);
        }
      },

      deleteVideo: async (id) => {
        set({ videos: get().videos.filter((v) => v.id !== id) });
        try {
          await fetch(`/api/videos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete video:", e);
        }
      },

      addInquiry: (inquiryData) => {
        const localId = `inq-${Date.now()}`;
        const newInquiry: InquiryItem = {
          ...inquiryData,
          id: localId,
          createdAt: new Date().toISOString(),
          status: "New"
        };
        set({ inquiries: [newInquiry, ...get().inquiries] });
      },

      updateInquiryStatus: async (id, status) => {
        set({
          inquiries: get().inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        });

        try {
          await fetch("/api/inquiries", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status })
          });
        } catch (e) {
          console.error("Failed to update inquiry status:", e);
        }
      },

      deleteInquiry: async (id) => {
        set({ inquiries: get().inquiries.filter((inq) => inq.id !== id) });
        try {
          await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete inquiry:", e);
        }
      }
    }),
    {
      name: "velora-admin-content-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        reviews: state.reviews,
        siteContent: state.siteContent,
        aboutCards: state.aboutCards,
        photos: state.photos,
        events: state.events,
        videos: state.videos
      })
    }
  )
);
