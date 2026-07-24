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
  imageSrc: string;
  alt: string;
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

interface ContentState {
  events: EventItem[];
  photos: PhotoItem[];
  inquiries: InquiryItem[];
  isAuthenticated: boolean;

  // Authentication actions
  login: (password: string) => boolean;
  logout: () => void;

  // Event management
  addEvent: (event: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Photo management
  addPhoto: (photo: Omit<PhotoItem, "id">) => void;
  updatePhoto: (id: string, photo: Partial<PhotoItem>) => void;
  deletePhoto: (id: string) => void;

  // Inquiry management
  addInquiry: (inquiry: Omit<InquiryItem, "id" | "createdAt" | "status">) => void;
  updateInquiryStatus: (id: string, status: InquiryItem["status"]) => void;
  deleteInquiry: (id: string) => void;
}

const defaultEvents: EventItem[] = eventCategories.map((item, idx) => ({
  id: `event-${idx + 1}`,
  title: item.title,
  category: item.title,
  description: item.description,
  date: "2026-08-15",
  location: "India",
  imageSrc: item.imageSrc,
  imageAlt: item.imageAlt
}));

const defaultPhotos: PhotoItem[] = featuredGallery.map((item, idx) => ({
  id: `photo-${idx + 1}`,
  title: item.title,
  category: item.category,
  imageSrc: item.imageSrc,
  alt: item.alt
}));

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      events: defaultEvents,
      photos: defaultPhotos,
      inquiries: [
        {
          id: "inq-1",
          fullName: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91 98765 12345",
          eventType: "Luxury Wedding",
          eventDate: "2026-11-20",
          budget: 1500000,
          specialRequirements: "Royal stage setup and bridal entry lighting",
          createdAt: new Date().toISOString(),
          status: "New"
        }
      ],
      isAuthenticated: false,

      login: (password: string) => {
        if (password === "admin123" || password === "admin") {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      addEvent: (eventData) => {
        const newEvent: EventItem = {
          ...eventData,
          id: `event-${Date.now()}`
        };
        set({ events: [newEvent, ...get().events] });
      },

      updateEvent: (id, updatedData) => {
        set({
          events: get().events.map((ev) => (ev.id === id ? { ...ev, ...updatedData } : ev))
        });
      },

      deleteEvent: (id) => {
        set({ events: get().events.filter((ev) => ev.id !== id) });
      },

      addPhoto: (photoData) => {
        const newPhoto: PhotoItem = {
          ...photoData,
          id: `photo-${Date.now()}`
        };
        set({ photos: [newPhoto, ...get().photos] });
      },

      updatePhoto: (id, updatedData) => {
        set({
          photos: get().photos.map((ph) => (ph.id === id ? { ...ph, ...updatedData } : ph))
        });
      },

      deletePhoto: (id) => {
        set({ photos: get().photos.filter((ph) => ph.id !== id) });
      },

      addInquiry: (inquiryData) => {
        const newInquiry: InquiryItem = {
          ...inquiryData,
          id: `inq-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "New"
        };
        set({ inquiries: [newInquiry, ...get().inquiries] });
      },

      updateInquiryStatus: (id, status) => {
        set({
          inquiries: get().inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        });
      },

      deleteInquiry: (id) => {
        set({ inquiries: get().inquiries.filter((inq) => inq.id !== id) });
      }
    }),
    {
      name: "velora-admin-content-storage"
    }
  )
);
