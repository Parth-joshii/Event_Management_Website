"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  Video as VideoIcon
} from "lucide-react";
import { useContentStore, EventItem, PhotoItem, VideoItem, InquiryItem } from "@/stores/content-store";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";

/** Preserves Ultra-HD 2400px crisp image resolution & 95% pristine quality while optimizing for cloud storage. */
function compressImageFile(file: File, maxWidth = 2400, quality = 0.95): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve((e.target?.result as string) || "");
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || "");
      img.src = (e.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  });
}

export function AdminDashboard(): React.ReactElement {
  const {
    isAuthenticated,
    login,
    logout,
    events,
    photos,
    videos,
    inquiries,
    fetchFromDatabase,
    addEvent,
    deleteEvent,
    addPhoto,
    deletePhoto,
    deleteAllPhotos,
    addVideo,
    deleteVideo,
    updateInquiryStatus,
    deleteInquiry
  } = useContentStore();

  const [passwordInput, setPasswordInput] = React.useState("");
  const [loginError, setLoginError] = React.useState(false);
  const [addEventOpen, setAddEventOpen] = React.useState(false);
  const [addPhotoOpen, setAddPhotoOpen] = React.useState(false);
  const [addVideoOpen, setAddVideoOpen] = React.useState(false);

  // Sync from DB on mount
  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  // New Event Form state
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventCategory, setEventCategory] = React.useState("Luxury Wedding");
  const [eventDescription, setEventDescription] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("India");
  const [eventImageSrc, setEventImageSrc] = React.useState("/images/gallery/wedding-stage.jpg");

  // New Photo Form state
  const [photoTitle, setPhotoTitle] = React.useState("");
  const [photoCategory, setPhotoCategory] = React.useState("Wedding Stage");
  const [selectedEventId, setSelectedEventId] = React.useState("");
  const [photoImagesList, setPhotoImagesList] = React.useState<string[]>([]);
  const [photoImageSrc, setPhotoImageSrc] = React.useState("/images/gallery/wedding-stage.jpg");

  // New Video Form state
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoCategory, setVideoCategory] = React.useState("Portfolio");
  const [videoSrc, setVideoSrc] = React.useState("/videos/landing-page.mp4");
  const [videoDescription, setVideoDescription] = React.useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput("");
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim()) return;

    await addEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      description: eventDescription.trim(),
      date: eventDate || "2026-09-01",
      location: eventLocation || "India",
      imageSrc: eventImageSrc.trim() || "/images/gallery/wedding-stage.jpg",
      imageAlt: eventTitle.trim()
    });

    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setAddEventOpen(false);
  };

  // Handle single or bulk photo submission
  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedEvent = events.find((ev) => ev.id === selectedEventId);
    const targetEventTitle = matchedEvent ? matchedEvent.title : "";

    if (photoImagesList.length > 1) {
      const bulkItems = photoImagesList.map((src, idx) => ({
        title: photoTitle ? `${photoTitle} #${idx + 1}` : matchedEvent ? `${matchedEvent.title} Photo #${idx + 1}` : `Photo #${idx + 1}`,
        category: photoCategory || matchedEvent?.category || "General",
        eventId: selectedEventId,
        eventTitle: targetEventTitle,
        imageSrc: src,
        alt: photoTitle || targetEventTitle || "Event Photo"
      }));
      await useContentStore.getState().addMultiplePhotos(bulkItems);
    } else {
      const src = photoImagesList[0] || photoImageSrc || "/images/gallery/wedding-stage.jpg";
      const title = photoTitle.trim() || matchedEvent?.title || "Event Photo";
      await addPhoto({
        title,
        category: photoCategory || matchedEvent?.category || "General",
        eventId: selectedEventId,
        eventTitle: targetEventTitle,
        imageSrc: src,
        alt: title
      });
    }

    setPhotoTitle("");
    setPhotoImagesList([]);
    setSelectedEventId("");
    setAddPhotoOpen(false);
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    await addVideo({
      title: videoTitle.trim(),
      category: videoCategory,
      videoSrc: videoSrc.trim() || "/videos/landing-page.mp4",
      description: videoDescription.trim()
    });

    setVideoTitle("");
    setVideoDescription("");
    setAddVideoOpen(false);
  };

  // If not authenticated, show login UI
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2D2238] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-white/15 text-[#D4AF37]">
              <Lock className="size-6" />
            </span>
            <h1 className="font-display mt-5 text-3xl font-bold">{siteConfig.name}</h1>
            <p className="mt-1 text-sm text-[#EBDCFB]">Admin Control Panel</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="admin-pass" className="text-white">
                Admin Password
              </Label>
              <Input
                id="admin-pass"
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                placeholder="Enter password (default: admin123)"
                required
                type="password"
                value={passwordInput}
                className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {loginError ? (
              <p className="text-xs font-semibold text-rose-400">
                Invalid password. Please try again (Password: admin123).
              </p>
            ) : null}

            <GradientButton className="w-full justify-center" type="submit">
              Login to Admin Panel
            </GradientButton>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-white/60 hover:text-[#D4AF37]">
                ← Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FAF7FF] text-[#2D2238]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#EBDCFB] bg-[#2D2238] text-white shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-[#D4AF37]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h1 className="font-display text-lg font-bold leading-none">
                {siteConfig.name} Admin
              </h1>
              <p className="text-[10px] text-white/60">MongoDB Powered Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:inline-flex"
            >
              View Live Client Website
              <ExternalLink className="size-3.5" />
            </Link>
            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <Container className="py-8">
        {/* Quick Stats Bar */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-[#EBDCFB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7d5ea1]">
                Total Events
              </span>
              <Calendar className="size-5 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-xl border border-[#EBDCFB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7d5ea1]">
                Gallery Photos
              </span>
              <ImageIcon className="size-5 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-3 text-[#2D2238] text-3xl font-bold">{photos.length}</p>
          </div>

          <div className="rounded-xl border border-[#EBDCFB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7d5ea1]">
                Videos
              </span>
              <VideoIcon className="size-5 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-3 text-[#2D2238] text-3xl font-bold">{videos.length}</p>
          </div>

          <div className="rounded-xl border border-[#EBDCFB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7d5ea1]">
                Client Inquiries
              </span>
              <UserCheck className="size-5 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold">{inquiries.length}</p>
          </div>
        </div>

        {/* Tabbed Admin Interface */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-6 bg-[#EBDCFB]/60 p-1">
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="photos">Manage Photos</TabsTrigger>
            <TabsTrigger value="videos">Manage Videos</TabsTrigger>
            <TabsTrigger value="inquiries">Client Inquiries</TabsTrigger>
          </TabsList>

          {/* TAB 1: MANAGE EVENTS */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238]">Events List</h2>
                <p className="text-sm text-[#5c4b6e]">
                  Add or remove events stored in MongoDB and displayed on the client website.
                </p>
              </div>

              <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
                <DialogTrigger asChild>
                  <GradientButton type="button">
                    <Plus className="size-4" />
                    Add New Event
                  </GradientButton>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white border-[#EBDCFB] text-[#2D2238]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-bold">
                      Add New Event
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the event details to store in MongoDB and feature on the site.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddEventSubmit} className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="ev-title">Event Title *</Label>
                      <Input
                        id="ev-title"
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="e.g. Royal Palace Wedding"
                        required
                        value={eventTitle}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ev-cat">Event Category</Label>
                      <select
                        id="ev-cat"
                        onChange={(e) => setEventCategory(e.target.value)}
                        value={eventCategory}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="Luxury Wedding">Luxury Wedding</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Private Party">Private Party</option>
                        <option value="School & College Function">School & College Function</option>
                        <option value="Religious Event">Religious Event</option>
                      </select>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="ev-date">Event Date</Label>
                        <Input
                          id="ev-date"
                          onChange={(e) => setEventDate(e.target.value)}
                          type="date"
                          value={eventDate}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ev-loc">Location</Label>
                        <Input
                          id="ev-loc"
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="e.g. Udaipur / Mumbai"
                          value={eventLocation}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ev-img">Select Photo File or Image URL</Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-1.5 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setEventImageSrc(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Input
                        id="ev-img"
                        className="mt-2"
                        onChange={(e) => setEventImageSrc(e.target.value)}
                        placeholder="Or paste URL e.g. /images/gallery/wedding-stage.jpg"
                        value={eventImageSrc}
                      />
                      {eventImageSrc ? (
                        <div className="mt-2 h-24 w-full overflow-hidden rounded-md border border-[#EBDCFB]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={eventImageSrc} alt="Preview" className="size-full object-cover" />
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="ev-desc">Event Description *</Label>
                      <Textarea
                        id="ev-desc"
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Provide details about decor, stage setup, and guest experience..."
                        required
                        rows={3}
                        value={eventDescription}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <GradientButton type="submit">Save & Publish Event</GradientButton>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#EBDCFB] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.imageSrc}
                      alt={ev.title}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-[#2D2238]/80 px-3 py-1 text-xs font-semibold text-[#D4AF37] backdrop-blur">
                      {ev.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl font-bold text-[#2D2238]">
                      {ev.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-[#5c4b6e]">
                      {ev.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#EBDCFB] pt-4 text-xs text-[#7d5ea1]">
                      <span>📍 {ev.location || "India"}</span>
                      <button
                        onClick={() => void deleteEvent(ev.id)}
                        type="button"
                        className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                        Remove Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: MANAGE PHOTOS */}
          <TabsContent value="photos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238]">
                  Website Photos & Assets
                </h2>
                <p className="text-sm text-[#5c4b6e]">
                  Add or remove website photos stored in MongoDB.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {photos.length > 0 ? (
                  <button
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete ALL photos from the gallery?")) {
                        await deleteAllPhotos();
                      }
                    }}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Clear All Photos ({photos.length})
                  </button>
                ) : null}

                <Dialog open={addPhotoOpen} onOpenChange={setAddPhotoOpen}>
                  <DialogTrigger asChild>
                    <GradientButton type="button">
                      <Plus className="size-4" />
                      Add New Photo
                    </GradientButton>
                  </DialogTrigger>
                <DialogContent className="max-w-md bg-white border-[#EBDCFB] text-[#2D2238]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-bold">
                      Add New Photo
                    </DialogTitle>
                    <DialogDescription>
                      Choose a photo file from your computer or enter an image URL.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddPhotoSubmit} className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="ph-event">Assign to Specific Event</Label>
                      <select
                        id="ph-event"
                        onChange={(e) => {
                          setSelectedEventId(e.target.value);
                          const ev = events.find((item) => item.id === e.target.value);
                          if (ev && !photoTitle) setPhotoTitle(`${ev.title} Photo`);
                        }}
                        value={selectedEventId}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">-- General Gallery (No Specific Event) --</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            📌 {ev.title} ({ev.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="ph-title">Photo Title / Caption</Label>
                      <Input
                        id="ph-title"
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="e.g. Royal Stage Lighting / Bridal Entry"
                        value={photoTitle}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ph-cat">Category Tag</Label>
                      <Input
                        id="ph-cat"
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        placeholder="e.g. Stage Decor, Haldi, Corporate"
                        value={photoCategory}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ph-src">Select Photos from Computer (Select Multiple Files)</Label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-1.5 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            const compressedUrls = await Promise.all(
                              files.map((file) => compressImageFile(file))
                            );
                            setPhotoImagesList(compressedUrls);
                            if (compressedUrls[0]) setPhotoImageSrc(compressedUrls[0]);
                          }
                        }}
                      />
                      {photoImagesList.length > 0 ? (
                        <p className="mt-1.5 text-xs font-semibold text-emerald-600">
                          ✓ {photoImagesList.length} photos selected ready to upload
                        </p>
                      ) : (
                        <Input
                          id="ph-src"
                          className="mt-2"
                          onChange={(e) => setPhotoImageSrc(e.target.value)}
                          placeholder="Or paste URL e.g. /images/gallery/wedding-stage.jpg"
                          value={photoImageSrc}
                        />
                      )}

                      {photoImageSrc ? (
                        <div className="mt-2 h-24 w-full overflow-hidden rounded-md border border-[#EBDCFB]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photoImageSrc} alt="Preview" className="size-full object-cover" />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <GradientButton type="submit">
                        {photoImagesList.length > 1
                          ? `Upload ${photoImagesList.length} Photos to Event`
                          : "Upload & Save Photo"}
                      </GradientButton>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((ph) => (
                <div
                  key={ph.id}
                  className="group relative overflow-hidden rounded-xl border border-[#EBDCFB] bg-white shadow-sm"
                >
                  <div className="h-56 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ph.imageSrc}
                      alt={ph.alt}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/gallery/wedding-stage.jpg";
                      }}
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
                        {ph.eventTitle ? `📌 Event: ${ph.eventTitle}` : ph.category}
                      </p>
                      <h4 className="font-semibold text-[#2D2238]">{ph.title}</h4>
                    </div>

                    <button
                      onClick={() => void deletePhoto(ph.id)}
                      type="button"
                      className="p-2 text-rose-600 hover:text-rose-800 transition cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: MANAGE VIDEOS */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238]">
                  Website Videos & Cinematic Assets
                </h2>
                <p className="text-sm text-[#5c4b6e]">
                  Upload video files or add video links stored in MongoDB for the hero background and portfolio showcases.
                </p>
              </div>

              <Dialog open={addVideoOpen} onOpenChange={setAddVideoOpen}>
                <DialogTrigger asChild>
                  <GradientButton type="button">
                    <Plus className="size-4" />
                    Add New Video
                  </GradientButton>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white border-[#EBDCFB] text-[#2D2238]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-bold">
                      Add New Video
                    </DialogTitle>
                    <DialogDescription>
                      Select a video file from your computer or enter a video URL.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddVideoSubmit} className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="vd-title">Video Title *</Label>
                      <Input
                        id="vd-title"
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Royal Wedding Highlights"
                        required
                        value={videoTitle}
                      />
                    </div>

                    <div>
                      <Label htmlFor="vd-cat">Category Tag</Label>
                      <Input
                        id="vd-cat"
                        onChange={(e) => setVideoCategory(e.target.value)}
                        placeholder="e.g. Hero, Portfolio, Wedding"
                        value={videoCategory}
                      />
                    </div>

                    <div>
                      <Label htmlFor="vd-file">Choose Video File from Computer</Label>
                      <input
                        type="file"
                        accept="video/*"
                        className="mt-1.5 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("file", file);
                            try {
                              const res = await fetch("/api/upload", { method: "POST", body: formData });
                              const data = await res.json();
                              if (data.ok && data.url) {
                                setVideoSrc(data.url);
                                return;
                              }
                            } catch {
                              // Fallback
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => setVideoSrc(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Input
                        id="vd-src"
                        className="mt-2"
                        onChange={(e) => setVideoSrc(e.target.value)}
                        placeholder="Or paste video URL e.g. /videos/landing-page.mp4"
                        value={videoSrc}
                      />
                    </div>

                    <div>
                      <Label htmlFor="vd-desc">Description</Label>
                      <Textarea
                        id="vd-desc"
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Short description of this video asset..."
                        rows={2}
                        value={videoDescription}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <GradientButton type="submit">Upload & Save Video</GradientButton>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Videos Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="group relative overflow-hidden rounded-xl border border-[#EBDCFB] bg-white shadow-sm"
                >
                  <div className="h-56 w-full overflow-hidden bg-black">
                    <video
                      src={v.videoSrc}
                      controls
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
                        {v.category}
                      </p>
                      <h4 className="font-semibold text-[#2D2238]">{v.title}</h4>
                      {v.description ? (
                        <p className="text-xs text-[#5c4b6e] mt-1">{v.description}</p>
                      ) : null}
                    </div>

                    <button
                      onClick={() => void deleteVideo(v.id)}
                      type="button"
                      className="p-2 text-rose-600 hover:text-rose-800 transition cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: CLIENT INQUIRIES */}
          <TabsContent value="inquiries" className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2D2238]">Client Inquiries</h2>
              <p className="text-sm text-[#5c4b6e]">
                Inquiries submitted by potential clients stored in MongoDB.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#EBDCFB] bg-white shadow-sm">
              <table className="w-full text-left text-sm text-[#2D2238]">
                <thead className="bg-[#FAF7FF] border-b border-[#EBDCFB] text-xs font-semibold text-[#7d5ea1] uppercase">
                  <tr>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Event & Date</th>
                    <th className="px-5 py-4">Budget</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBDCFB]">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#FAF7FF]/50 transition">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{inq.fullName}</p>
                        <p className="text-xs text-[#5c4b6e] inline-flex items-center gap-1 mt-0.5">
                          <Phone className="size-3" /> {inq.phone}
                        </p>
                        <br />
                        <p className="text-xs text-[#5c4b6e] inline-flex items-center gap-1">
                          <Mail className="size-3" /> {inq.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-[#7d5ea1]">{inq.eventType}</span>
                        <p className="text-xs text-gray-500 mt-0.5">Date: {inq.eventDate}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        ₹{inq.budget.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            void updateInquiryStatus(inq.id, e.target.value as InquiryItem["status"])
                          }
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => void deleteInquiry(inq.id)}
                          type="button"
                          className="text-rose-600 hover:text-rose-800 transition cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
