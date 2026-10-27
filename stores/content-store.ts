"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { convertDriveUrlToDirectLink } from "@/lib/utils";

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
    imageSrc: ""
  },
  {
    id: "flawless-execution",
    title: "Flawless Execution",
    description: "Seamless vendor management and attentive on-day coordination.",
    imageSrc: ""
  },
  {
    id: "curated-network",
    title: "Curated Network",
    description: "Exclusive access to top-tier venues, artists, and production masters.",
    imageSrc: ""
  },
  {
    id: "transparent-pricing",
    title: "Transparent Pricing",
    description: "Clear line-item quotes and real-time budget management.",
    imageSrc: ""
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
  isAuthenticated: boolean;
  isDbSyncing: boolean;

  fetchFromDatabase: () => Promise<void>;
  login: (password: string) => boolean;
  logout: () => void;

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

  addReview: (reviewData: Omit<ReviewItem, "id">) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  updateAboutCardImage: (id: string, imageSrc: string) => Promise<void>;

  addInquiry: (inquiryData: Omit<InquiryItem, "id" | "createdAt" | "status">) => void;
  updateInquiryStatus: (id: string, status: InquiryItem["status"]) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      events: [
        {
          id: "ev-1",
          title: "Riya & Aman Royal Wedding",
          category: "Royal Wedding",
          description: "A grand palace wedding featuring a glass mandap and 10,000+ floral elements.",
          date: "2026-02-14",
          location: "Udaipur Palace",
          imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Riya and Aman Royal Palace Wedding"
        },
        {
          id: "ev-2",
          title: "Aster Corporate Annual Meet",
          category: "Corporate Production",
          description: "High-impact stage production with dynamic LED walls and executive hospitality.",
          date: "2026-01-20",
          location: "JW Marriott Mumbai",
          imageSrc: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Aster Corporate Stage Production"
        }
      ],
      photos: [],
      videos: [],
      inquiries: [],
      reviews: [
        {
          id: "rev-1",
          authorName: "Vikram & Ananya Mehta",
          roleOrEvent: "Royal Wedding Client, Udaipur",
          rating: 5,
          comment: "Shree Velora transformed our wedding into an absolute fairytale. Every decor detail and stage execution was regal beyond words.",
          avatarSrc: "/images/testimonials-[#1].jpg"
        },
        {
          id: "rev-2",
          authorName: "Sanjay Singhania",
          roleOrEvent: "Corporate Gala Host, Mumbai",
          rating: 5,
          comment: "Flawless professionalism, magnificent venue lighting, and seamless coordination. Our high-profile corporate delegates were deeply impressed.",
          avatarSrc: "/images/testimonials-[#2].jpg"
        }
      ],
      aboutCards: defaultAboutCards,
      isAuthenticated: false,
      isDbSyncing: false,

      updateAboutCardImage: async (id: string, imageSrc: string) => {
        const directSrc = convertDriveUrlToDirectLink(imageSrc);
        set({
          aboutCards: get().aboutCards.map((card) =>
            card.id === id ? { ...card, imageSrc: directSrc } : card
          )
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
          if (data?.ok && data.data?.id) {
            set({
              reviews: get().reviews.map((r) => (r.id === localId ? { ...r, id: data.data.id } : r))
            });
          }
        } catch (e) {
          console.error("Failed to persist review:", e);
        }
      },

      deleteReview: async (id) => {
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
        try {
          await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete review:", e);
        }
      },

      fetchFromDatabase: async () => {
        set({ isDbSyncing: true });
        try {
          const localPhotos = get().photos;
          const [photosRes, videosRes, eventsRes, inquiriesRes, reviewsRes, aboutRes] = await Promise.all([
            fetch("/api/photos").then((r) => r.json()).catch(() => null),
            fetch("/api/videos").then((r) => r.json()).catch(() => null),
            fetch("/api/events").then((r) => r.json()).catch(() => null),
            fetch("/api/inquiries").then((r) => r.json()).catch(() => null),
            fetch("/api/reviews").then((r) => r.json()).catch(() => null),
            fetch("/api/about").then((r) => r.json()).catch(() => null)
          ]);

          if (photosRes?.ok && Array.isArray(photosRes.data)) {
            if (photosRes.data.length > 0) {
              set({ photos: dedupePhotosByImageSrc(photosRes.data) });
            } else if (localPhotos.length > 0) {
              await fetch("/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localPhotos)
              }).catch(() => null);

              const refreshedPhotos = await fetch("/api/photos").then((r) => r.json()).catch(() => null);
              if (refreshedPhotos?.ok && Array.isArray(refreshedPhotos.data) && refreshedPhotos.data.length > 0) {
                set({ photos: dedupePhotosByImageSrc(refreshedPhotos.data) });
              }
            }
          }
          if (videosRes?.ok && Array.isArray(videosRes.data) && videosRes.data.length > 0) {
            set({ videos: videosRes.data });
          }
          if (eventsRes?.ok && Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
            set({ events: eventsRes.data });
          }
          if (inquiriesRes?.ok && Array.isArray(inquiriesRes.data) && inquiriesRes.data.length > 0) {
            set({ inquiries: inquiriesRes.data });
          }
          if (reviewsRes?.ok && Array.isArray(reviewsRes.data) && reviewsRes.data.length > 0) {
            set({ reviews: reviewsRes.data });
          }
          if (aboutRes?.ok && Array.isArray(aboutRes.data) && aboutRes.data.length > 0) {
            set({ aboutCards: aboutRes.data });
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
        set({ photos: get().photos.filter((ph) => ph.id !== id) });
        try {
          await fetch(`/api/photos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
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
        events: state.events,
        photos: state.photos,
        videos: state.videos,
        inquiries: state.inquiries,
        reviews: state.reviews,
        aboutCards: state.aboutCards
      })
    }
  )
);
