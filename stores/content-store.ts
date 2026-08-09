import { create } from "zustand";
import { persist } from "zustand/middleware";
import { eventCategories } from "@/features/events/data/event-categories";
import { featuredGallery } from "@/features/gallery/data/featured-gallery";

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
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: number;
  specialRequirements?: string;
  createdAt: string;
  status: "New" | "Contacted" | "Confirmed";
}

export interface AboutCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
}

interface ContentState {
  events: EventItem[];
  photos: PhotoItem[];
  videos: VideoItem[];
  inquiries: InquiryItem[];
  aboutCards: AboutCardItem[];
  isAuthenticated: boolean;
  isDbSyncing: boolean;

  // Hydration from MongoDB
  fetchFromDatabase: () => Promise<void>;

  // Authentication actions
  login: (password: string) => boolean;
  logout: () => void;

  // About cards management
  updateAboutCardImage: (id: string, imageSrc: string) => void;

  // Event management
  addEvent: (event: Omit<EventItem, "id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => Promise<void>;
  deleteAllEvents: () => Promise<void>;

  // Photo management
  addPhoto: (photo: Omit<PhotoItem, "id">) => Promise<void>;
  addMultiplePhotos: (photosList: Omit<PhotoItem, "id">[]) => Promise<void>;
  updatePhoto: (id: string, photo: Partial<PhotoItem>) => void;
  toggleFeaturedPhoto: (id: string, isFeatured: boolean) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;

  // Video management
  addVideo: (video: Omit<VideoItem, "id">) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  // Inquiry management
  addInquiry: (inquiry: Omit<InquiryItem, "id" | "createdAt" | "status">) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryItem["status"]) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
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

const defaultEvents: EventItem[] = [];

const defaultPhotos: PhotoItem[] = [];

const defaultVideos: VideoItem[] = [
  {
    id: "vid-1",
    title: "Hero Background Showcase",
    category: "Hero",
    videoSrc: "/videos/landing-page.mp4",
    posterSrc: "",
    description: "Main cinematic luxury event celebration video background"
  }
];

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      events: defaultEvents,
      photos: defaultPhotos,
      videos: defaultVideos,
      inquiries: [
        {
          id: "inq-1",
          fullName: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91 99770 24666",
          eventType: "Luxury Wedding",
          eventDate: "2026-11-20",
          budget: 1500000,
          specialRequirements: "Royal stage setup and bridal entry lighting",
          createdAt: new Date().toISOString(),
          status: "New"
        }
      ],
      aboutCards: defaultAboutCards,
      isAuthenticated: false,
      isDbSyncing: false,

      updateAboutCardImage: (id: string, imageSrc: string) => {
        set({
          aboutCards: get().aboutCards.map((card) =>
            card.id === id ? { ...card, imageSrc } : card
          )
        });
      },

      fetchFromDatabase: async () => {
        set({ isDbSyncing: true });
        try {
          const [photosRes, videosRes, eventsRes, inquiriesRes] = await Promise.all([
            fetch("/api/photos").then((r) => r.json()).catch(() => null),
            fetch("/api/videos").then((r) => r.json()).catch(() => null),
            fetch("/api/events").then((r) => r.json()).catch(() => null),
            fetch("/api/inquiries").then((r) => r.json()).catch(() => null)
          ]);

          if (photosRes?.ok && Array.isArray(photosRes.data)) {
            set({ photos: photosRes.data });
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
        } catch (e) {
          console.error("Failed to sync store with MongoDB API:", e);
        } finally {
          set({ isDbSyncing: false });
        }
      },

      login: (password: string) => {
        if (password === "admin123" || password === "admin") {
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
          const data = await res.json();
          if (data.ok && data.data?.id) {
            set({
              events: get().events.map((ev) => (ev.id === localId ? { ...ev, id: data.data.id } : ev))
            });
          }
        } catch (e) {
          console.error("Failed to persist event to MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
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
          console.error("Failed to delete event from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      deleteAllEvents: async () => {
        set({ events: [] });
        try {
          await fetch("/api/events?all=true", { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete all events from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
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
          const data = await res.json();
          if (data.ok && data.data?.id) {
            set({
              photos: get().photos.map((ph) => (ph.id === localId ? { ...ph, id: data.data.id } : ph))
            });
          }
        } catch (e) {
          console.error("Failed to persist photo to MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      addMultiplePhotos: async (photosList) => {
        const tempNewPhotos: PhotoItem[] = photosList.map((p, idx) => ({
          ...p,
          id: `photo-${Date.now()}-${idx}`
        }));
        set({ photos: [...tempNewPhotos, ...get().photos] });

        try {
          await Promise.all(
            photosList.map((item) =>
              fetch("/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item)
              })
            )
          );
        } catch (e) {
          console.error("Failed to persist bulk photos to MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
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
          console.error("Failed to update featured photo status in MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      deletePhoto: async (id) => {
        set({ photos: get().photos.filter((ph) => ph.id !== id) });
        try {
          await fetch(`/api/photos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete photo from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      deleteAllPhotos: async () => {
        set({ photos: [] });
        try {
          await fetch("/api/photos?all=true", { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete all photos from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
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
          const data = await res.json();
          if (data.ok && data.data?.id) {
            set({
              videos: get().videos.map((v) => (v.id === localId ? { ...v, id: data.data.id } : v))
            });
          }
        } catch (e) {
          console.error("Failed to persist video to MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      deleteVideo: async (id) => {
        set({ videos: get().videos.filter((v) => v.id !== id) });
        try {
          await fetch(`/api/videos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete video from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      addInquiry: async (inquiryData) => {
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
          console.error("Failed to update inquiry status in MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      },

      deleteInquiry: async (id) => {
        set({ inquiries: get().inquiries.filter((inq) => inq.id !== id) });
        try {
          await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete inquiry from MongoDB:", e);
        } finally {
          await get().fetchFromDatabase();
        }
      }
    }),
    {
      name: "velora-admin-content-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        aboutCards: state.aboutCards
      })
    }
  )
);
