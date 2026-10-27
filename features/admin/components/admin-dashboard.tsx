"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  Video as VideoIcon,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useContentStore, type InquiryItem } from "@/stores/content-store";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import {
  convertDriveUrlToDirectLink,
  extractDriveUrlsFromText,
  resolveRenderableImageSrc
} from "@/lib/utils";
import {
  uploadFileToCloudinary,
  uploadMultipleImagesToCloudinary,
  checkCloudinaryStatus
} from "@/lib/image-upload";

function isValidHttpOrDataUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    (trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("/")) &&
    trimmed.length > 5
  );
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
    reviews,
    addReview,
    deleteReview,
    aboutCards,
    updateAboutCardImage,
    fetchFromDatabase,
    addEvent,
    deleteEvent,
    deleteAllEvents,
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
  const [activeTab, setActiveTab] = React.useState("events");
  const [addEventOpen, setAddEventOpen] = React.useState(false);
  const [addPhotoOpen, setAddPhotoOpen] = React.useState(false);
  const [addVideoOpen, setAddVideoOpen] = React.useState(false);
  const [addReviewOpen, setAddReviewOpen] = React.useState(false);

  // New Review Form state
  const [revAuthorName, setRevAuthorName] = React.useState("");
  const [revRole, setRevRole] = React.useState("Luxury Event Client");
  const [revRating, setRevRating] = React.useState(5);
  const [revComment, setRevComment] = React.useState("");

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthorName.trim() || !revComment.trim()) return;

    await addReview({
      authorName: revAuthorName.trim(),
      roleOrEvent: revRole.trim() || "Luxury Event Client",
      rating: revRating,
      comment: revComment.trim()
    });

    setRevAuthorName("");
    setRevComment("");
    setAddReviewOpen(false);
  };

  // Cloudinary status & upload state
  const [cloudinaryStatus, setCloudinaryStatus] = React.useState<{
    configured: boolean;
    cloudName: string | null;
  } | null>(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = React.useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = React.useState(false);
  const [uploadProgressText, setUploadProgressText] = React.useState("");
  const [isUploadingEventCover, setIsUploadingEventCover] = React.useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = React.useState(false);

  // Sync from DB & check Cloudinary status on mount
  React.useEffect(() => {
    void fetchFromDatabase();
    void checkCloudinaryStatus().then((status) => setCloudinaryStatus(status));
  }, [fetchFromDatabase]);

  // New Event Form state
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventCategory, setEventCategory] = React.useState("Luxury Wedding");
  const [eventDescription, setEventDescription] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("India");
  const [eventImageSrc, setEventImageSrc] = React.useState("");

  // New Photo Form state
  const [photoTitle, setPhotoTitle] = React.useState("");
  const [photoCategory, setPhotoCategory] = React.useState("Wedding Stage");
  const [selectedEventId, setSelectedEventId] = React.useState("");
  const [isFeaturedPhoto, setIsFeaturedPhoto] = React.useState(false);
  const [photoImagesList, setPhotoImagesList] = React.useState<string[]>([]);
  const [photoImageSrc, setPhotoImageSrc] = React.useState("");
  const [photoUploadMethod, setPhotoUploadMethod] = React.useState<"computer" | "drive">("computer");

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
    if (isSavingPhoto || isUploadingPhotos) return;

    if (photoImagesList.length === 0 && !photoImageSrc.trim()) {
      toast.error("Please choose or upload a photo first.");
      return;
    }

    setIsSavingPhoto(true);
    try {
      const matchedEvent = events.find((ev) => ev.id === selectedEventId);
      const targetEventTitle = matchedEvent ? matchedEvent.title : "";

      if (photoImagesList.length > 1) {
        const bulkItems = photoImagesList.map((src, idx) => ({
          title: photoTitle ? `${photoTitle} #${idx + 1}` : matchedEvent ? `${matchedEvent.title} Photo #${idx + 1}` : `Photo #${idx + 1}`,
          category: photoCategory || matchedEvent?.category || "General",
          eventId: selectedEventId,
          eventTitle: targetEventTitle,
          isFeatured: isFeaturedPhoto && idx === 0,
          imageSrc: src,
          alt: photoTitle || targetEventTitle || "Event Photo"
        }));
        await useContentStore.getState().addMultiplePhotos(bulkItems);
        toast.success(`✓ Published ${bulkItems.length} photos to gallery!`);
      } else {
        const src = photoImagesList[0] || photoImageSrc.trim();
        if (!src) {
          toast.error("Please choose or upload a photo first.");
          return;
        }
        const title = photoTitle.trim() || matchedEvent?.title || "Event Photo";
        await addPhoto({
          title,
          category: photoCategory || matchedEvent?.category || "General",
          eventId: selectedEventId,
          eventTitle: targetEventTitle,
          isFeatured: isFeaturedPhoto,
          imageSrc: src,
          alt: title
        });
        toast.success("✓ Saved photo to gallery!");
      }

      setPhotoTitle("");
      setPhotoImagesList([]);
      setPhotoImageSrc("");
      setSelectedEventId("");
      setIsFeaturedPhoto(false);
      setAddPhotoOpen(false);
    } catch (err) {
      console.error("Failed to save photo:", err);
      toast.error("Failed to save photo to gallery.");
    } finally {
      setIsSavingPhoto(false);
    }
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
                placeholder="Enter admin password"
                required
                type="password"
                autoComplete="current-password"
                value={passwordInput}
                className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {loginError ? (
              <p className="text-xs font-semibold text-rose-400">
                Invalid password. Access denied.
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
        {/* Bento Grid Header & Statistics Showcase */}
        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          {/* Main Bento Hero Card (Span 2 Columns) */}
          <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#2D2238] via-[#3a2c49] to-[#1f1629] p-6 text-white shadow-xl lg:col-span-2">
            <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                    <Activity className="size-3.5 animate-pulse" />
                    MongoDB Cloud Live Sync Active
                  </span>
                  <h2 className="font-display mt-3 text-2xl font-bold tracking-wide sm:text-3xl text-white">
                    Command & Control Center
                  </h2>
                  <p className="mt-1 text-xs text-[#EBDCFB]/70 max-w-lg">
                    Manage your royal weddings, showcase media, client reviews, and booking inquiries in real time.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-[#D4AF37]">Quick Actions:</span>
                <button
                  onClick={() => {
                    setActiveTab("events");
                    setAddEventOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25 cursor-pointer border border-white/20 active:scale-95"
                >
                  <Plus className="size-3 text-[#D4AF37]" /> Add Event
                </button>
                <button
                  onClick={() => {
                    setActiveTab("photos");
                    setAddPhotoOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25 cursor-pointer border border-white/20 active:scale-95"
                >
                  <Plus className="size-3 text-[#D4AF37]" /> Add Photo
                </button>
                <button
                  onClick={() => {
                    setActiveTab("videos");
                    setAddVideoOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25 cursor-pointer border border-white/20 active:scale-95"
                >
                  <Plus className="size-3 text-[#D4AF37]" /> Add Video
                </button>
              </div>
            </div>
          </div>

          {/* Right Bento Column: 2 Stacked Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {/* Bento Card: Live Inquiries Status */}
            <div
              onClick={() => setActiveTab("inquiries")}
              className="rounded-2xl border border-[#EBDCFB] bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#D4AF37]/60 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7d5ea1]">
                  Client Inquiries
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[#EBDCFB]/50 text-[#2D2238]">
                  <UserCheck className="size-4 text-[#D4AF37]" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-3xl font-bold text-[#2D2238]">{inquiries.length}</p>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ● Real-time Leads
                </span>
              </div>
            </div>

            {/* Bento Card: Total Media Assets */}
            <div
              onClick={() => setActiveTab("photos")}
              className="rounded-2xl border border-[#EBDCFB] bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#D4AF37]/60 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7d5ea1]">
                  Media Showcase
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[#EBDCFB]/50 text-[#2D2238]">
                  <ImageIcon className="size-4 text-[#D4AF37]" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-3xl font-bold text-[#2D2238]">
                  {photos.length + videos.length}
                </p>
                <span className="text-xs text-[#5c4b6e] font-medium">
                  {photos.length} Photos • {videos.length} Videos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Small Bento Quick Counter Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            onClick={() => setActiveTab("events")}
            className="group rounded-2xl border border-[#EBDCFB] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#5c4b6e]">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
              <Calendar className="size-4 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-2 text-2xl font-bold text-[#2D2238]">{events.length}</p>
          </div>

          <div
            onClick={() => setActiveTab("photos")}
            className="group rounded-2xl border border-[#EBDCFB] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#5c4b6e]">
              <span className="text-xs font-semibold uppercase tracking-wider">Gallery Photos</span>
              <ImageIcon className="size-4 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-2 text-2xl font-bold text-[#2D2238]">{photos.length}</p>
          </div>

          <div
            onClick={() => setActiveTab("videos")}
            className="group rounded-2xl border border-[#EBDCFB] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#5c4b6e]">
              <span className="text-xs font-semibold uppercase tracking-wider">Video Assets</span>
              <VideoIcon className="size-4 text-[#D4AF37]" />
            </div>
            <p className="font-display mt-2 text-2xl font-bold text-[#2D2238]">{videos.length}</p>
          </div>

          <div
            onClick={() => setActiveTab("reviews")}
            className="group rounded-2xl border border-[#EBDCFB] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#5c4b6e]">
              <span className="text-xs font-semibold uppercase tracking-wider">Client Reviews</span>
              <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
            </div>
            <p className="font-display mt-2 text-2xl font-bold text-[#2D2238]">{reviews.length}</p>
          </div>
        </div>

        {/* Tabbed Admin Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 rounded-2xl border border-[#EBDCFB] bg-white p-1.5 shadow-sm flex-wrap gap-1">
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="photos">Manage Photos</TabsTrigger>
            <TabsTrigger value="videos">Manage Videos</TabsTrigger>
            <TabsTrigger value="about-cards">About Cards Photos</TabsTrigger>
            <TabsTrigger value="reviews">Manage Reviews</TabsTrigger>
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

              <div className="flex items-center gap-3">
                {events.length > 0 ? (
                  <button
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete ALL events?")) {
                        await deleteAllEvents();
                      }
                    }}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Clear All Events ({events.length})
                  </button>
                ) : null}

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
                      <Label htmlFor="ev-img">Event Cover Photo (Card Thumbnail) *</Label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingEventCover}
                        className="mt-1.5 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white disabled:opacity-50"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingEventCover(true);
                          try {
                            const res = await uploadFileToCloudinary(file, {
                              folder: "shree_velora/events",
                              category: eventCategory
                            });
                            setEventImageSrc(res.url);
                            toast.success("Event cover uploaded to Cloudinary CDN!");
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : "Upload failed";
                            toast.error(msg);
                          } finally {
                            setIsUploadingEventCover(false);
                          }
                        }}
                      />
                      {isUploadingEventCover ? (
                        <p className="mt-1.5 text-xs text-purple-600 flex items-center gap-1.5 font-medium">
                          <Loader2 className="size-3.5 animate-spin" /> Compressing & uploading cover to Cloudinary...
                        </p>
                      ) : null}
                      <Input
                        id="ev-img"
                        className="mt-2"
                        onChange={(e) => setEventImageSrc(convertDriveUrlToDirectLink(e.target.value))}
                        placeholder="Cloudinary URL, image link, or Google Drive link"
                        value={eventImageSrc}
                      />
                      {eventImageSrc ? (
                        <div className="mt-2 h-24 w-full overflow-hidden rounded-md border border-[#EBDCFB]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveRenderableImageSrc(eventImageSrc)}
                            alt="Preview"
                            className="size-full object-cover"
                          />
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
                    <span className="absolute top-3 left-3 rounded-full bg-[#2D2238]/80 px-2.5 py-1 text-[10px] font-semibold text-[#D4AF37] backdrop-blur">
                      🖼️ Event Cover Photo
                    </span>
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
            {/* Live Cloudinary CDN Status Card */}
            <div className="rounded-xl border border-[#EBDCFB] bg-gradient-to-r from-purple-50/70 via-white to-amber-50/40 p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      cloudinaryStatus?.configured
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <Cloud className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-[#2D2238]">
                        {cloudinaryStatus?.configured
                          ? "Cloudinary CDN Connected"
                          : "Cloudinary CDN Storage"}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          cloudinaryStatus?.configured
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {cloudinaryStatus?.configured ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <AlertCircle className="size-3" />
                        )}
                        {cloudinaryStatus?.configured
                          ? `Cloud: ${cloudinaryStatus.cloudName}`
                          : "Credentials Needed"}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c4b6e] mt-0.5">
                      {cloudinaryStatus?.configured
                        ? "Direct CDN storage is active. Any photo larger than Vercel's limit (>3.8MB) is automatically compressed on device before upload."
                        : "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables (.env.local or Vercel)."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void checkCloudinaryStatus().then((st) => {
                      setCloudinaryStatus(st);
                      if (st.configured) {
                        toast.success(`Cloudinary connected to '${st.cloudName}'`);
                      } else {
                        toast.warning("Cloudinary credentials not detected in environment.");
                      }
                    });
                  }}
                  className="text-xs font-semibold text-[#7d5ea1] hover:text-[#2D2238] underline cursor-pointer"
                >
                  Verify Connection
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238]">
                  Website Photos & Assets
                </h2>
                <p className="text-sm text-[#5c4b6e]">
                  Add or remove website photos stored in MongoDB and hosted on Cloudinary CDN.
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

                <Dialog
                  open={addPhotoOpen}
                  onOpenChange={(open) => {
                    setAddPhotoOpen(open);
                    if (!open) {
                      setPhotoImagesList([]);
                      setPhotoImageSrc("");
                      setPhotoTitle("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <GradientButton type="button">
                      <Plus className="size-4" />
                      Add New Photo
                    </GradientButton>
                  </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white border-[#EBDCFB] text-[#2D2238] rounded-2xl shadow-xl">
                  <DialogHeader className="px-4 py-3 border-b border-[#EBDCFB]/70 bg-gradient-to-r from-purple-50/70 to-white shrink-0">
                    <DialogTitle className="font-display text-base font-bold text-[#2D2238]">
                      Add New Photo
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#5c4b6e]">
                      Upload directly to Cloudinary CDN or paste image links.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddPhotoSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-y-auto px-4 py-3 space-y-2.5 flex-1 text-xs">
                      <div>
                        <Label htmlFor="ph-event" className="text-xs font-semibold text-slate-700">Assign to Specific Event</Label>
                        <select
                          id="ph-event"
                          onChange={(e) => {
                            setSelectedEventId(e.target.value);
                            const ev = events.find((item) => item.id === e.target.value);
                            if (ev && !photoTitle) setPhotoTitle(`${ev.title} Photo`);
                          }}
                          value={selectedEventId}
                          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        >
                          <option value="">-- General Gallery (No Specific Event) --</option>
                          {events.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                              📌 {ev.title} ({ev.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="ph-title" className="text-xs font-semibold text-slate-700">Caption / Title</Label>
                          <Input
                            id="ph-title"
                            onChange={(e) => setPhotoTitle(e.target.value)}
                            placeholder="e.g. Royal Stage"
                            value={photoTitle}
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ph-cat" className="text-xs font-semibold text-slate-700">Category Tag</Label>
                          <Input
                            id="ph-cat"
                            onChange={(e) => setPhotoCategory(e.target.value)}
                            placeholder="e.g. Stage Decor"
                            value={photoCategory}
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* Compact Method Switcher */}
                      <div>
                        <Label className="text-xs font-semibold text-slate-700 mb-1 block">Photo Source</Label>
                        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUploadMethod("computer");
                              setPhotoImagesList([]);
                              setPhotoImageSrc("/images/gallery/wedding-stage.jpg");
                            }}
                            className={`py-1 px-2 rounded-md font-medium text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                              photoUploadMethod === "computer"
                                ? "bg-white text-[#2D2238] shadow-xs font-semibold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <Cloud className="size-3.5 text-[#7d5ea1]" />
                            Upload from Computer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUploadMethod("drive");
                              setPhotoImagesList([]);
                              setPhotoImageSrc("/images/gallery/wedding-stage.jpg");
                            }}
                            className={`py-1 px-2 rounded-md font-medium text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                              photoUploadMethod === "drive"
                                ? "bg-white text-[#2D2238] shadow-xs font-semibold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <ExternalLink className="size-3.5 text-slate-500" />
                            Google Drive Links
                          </button>
                        </div>
                      </div>

                      {/* Method 1: Computer Upload */}
                      {photoUploadMethod === "computer" ? (
                        <div className="rounded-lg border border-purple-100 bg-purple-50/40 p-2.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="ph-src" className="text-xs font-medium text-purple-900">
                              Select Image Files
                            </Label>
                            <span className="text-[10px] text-purple-600">
                              ⚡ Auto-compressed for Vercel
                            </span>
                          </div>
                          <input
                            id="ph-src"
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isUploadingPhotos}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white disabled:opacity-50 cursor-pointer"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              setIsUploadingPhotos(true);
                              setUploadProgressText(`Preparing ${files.length} photo(s)...`);

                              try {
                                const uploaded = await uploadMultipleImagesToCloudinary(files, {
                                  category: photoCategory,
                                  folder: "shree_velora/gallery",
                                  onProgress: (_curr, _tot, msg) => setUploadProgressText(msg)
                                });

                                const newUrls = uploaded.map((u) => u.url);
                                setPhotoImagesList((prev) => [...prev, ...newUrls]);
                                if (!photoImageSrc || photoImageSrc === "/images/gallery/wedding-stage.jpg") {
                                  setPhotoImageSrc(newUrls[0] || "");
                                }
                                toast.success(`✓ Uploaded ${newUrls.length} photo(s) to Cloudinary!`);
                              } catch (err) {
                                const msg = err instanceof Error ? err.message : "Upload failed";
                                toast.error(msg);
                              } finally {
                                setIsUploadingPhotos(false);
                                setUploadProgressText("");
                                e.target.value = "";
                              }
                            }}
                          />

                          {isUploadingPhotos ? (
                            <div className="flex items-center gap-2 rounded-md bg-purple-100/80 p-2 text-xs text-purple-700">
                              <Loader2 className="size-3.5 animate-spin shrink-0 text-purple-600" />
                              <span className="font-medium truncate">{uploadProgressText || "Uploading to Cloudinary..."}</span>
                            </div>
                          ) : null}

                          {photoImagesList.length > 0 && photoImagesList.some(isValidHttpOrDataUrl) ? (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-emerald-700">
                                  ✓ {photoImagesList.filter(isValidHttpOrDataUrl).length} photo(s) ready in Cloudinary
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPhotoImagesList([]);
                                    setPhotoImageSrc("/images/gallery/wedding-stage.jpg");
                                  }}
                                  className="text-rose-600 hover:underline cursor-pointer"
                                >
                                  Clear
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-md border border-purple-200/60 bg-white">
                                {photoImagesList.filter(isValidHttpOrDataUrl).map((url, idx) => (
                                  <div
                                    key={`${url}-${idx}`}
                                    className="group relative size-11 rounded-md overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={resolveRenderableImageSrc(url)}
                                      alt={`Photo ${idx + 1}`}
                                      className="size-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = photoImagesList.filter((_, i) => i !== idx);
                                        setPhotoImagesList(updated);
                                        if (photoImageSrc === url) {
                                          setPhotoImageSrc(updated[0] || "");
                                        }
                                      }}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                                      title="Remove this photo"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        /* Method 2: Google Drive Links */
                        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 space-y-1.5">
                          <Label htmlFor="ph-bulk-drive" className="text-xs font-medium text-slate-700">
                            Paste Google Drive Photo Links (one per line)
                          </Label>
                          <Textarea
                            id="ph-bulk-drive"
                            rows={2}
                            className="text-xs font-mono resize-none"
                            placeholder="https://drive.google.com/file/d/..."
                            onChange={(e) => {
                              const val = e.target.value.trim();
                              if (!val) {
                                setPhotoImagesList([]);
                                setPhotoImageSrc("/images/gallery/wedding-stage.jpg");
                                return;
                              }
                              const extracted = extractDriveUrlsFromText(val);
                              if (extracted.length > 0) {
                                setPhotoImagesList(extracted);
                                setPhotoImageSrc(extracted[0] || "");
                              } else if (val.startsWith("http")) {
                                const single = convertDriveUrlToDirectLink(val);
                                setPhotoImageSrc(single);
                                setPhotoImagesList([single]);
                              }
                            }}
                          />
                          {photoImagesList.length > 0 && isValidHttpOrDataUrl(photoImagesList[0]) ? (
                            <p className="text-[11px] font-semibold text-emerald-600">
                              ✓ {photoImagesList.length} photo link(s) ready
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Fixed Compact Footer */}
                    <div className="px-4 py-2.5 border-t border-[#EBDCFB]/70 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAddPhotoOpen(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-md transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <GradientButton type="submit" disabled={isUploadingPhotos || isSavingPhoto}>
                        {isSavingPhoto ? (
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="size-3.5 animate-spin" />
                            Saving to Gallery...
                          </span>
                        ) : isUploadingPhotos ? (
                          "Uploading to Cloudinary..."
                        ) : photoImagesList.length > 1 ? (
                          `Save & Publish ${photoImagesList.length} Photos`
                        ) : (
                          "Save Photo to Gallery"
                        )}
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
                      src={resolveRenderableImageSrc(ph.imageSrc)}
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
                      className="p-1.5 text-rose-600 hover:text-rose-800 transition cursor-pointer"
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
                        disabled={isUploadingVideo}
                        className="mt-1.5 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EBDCFB] file:text-[#7d5ea1] hover:file:bg-[#2D2238] hover:file:text-white disabled:opacity-50"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingVideo(true);
                          try {
                            const res = await uploadFileToCloudinary(file, { folder: "shree_velora/videos" });
                            setVideoSrc(res.url);
                            toast.success("Video uploaded to Cloudinary CDN!");
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : "Video upload failed";
                            toast.error(msg);
                          } finally {
                            setIsUploadingVideo(false);
                          }
                        }}
                      />
                      {isUploadingVideo ? (
                        <p className="mt-1 text-xs text-purple-600 flex items-center gap-1.5 font-medium">
                          <Loader2 className="size-3.5 animate-spin" /> Uploading video to Cloudinary...
                        </p>
                      ) : null}
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
                        <p className="text-xs text-gray-500 mt-0.5">Submitted: {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN") : "Recent"}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#2D2238]">
                        {inq.budgetRange || "Flexible"}
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

          {/* TAB 5: MANAGE ABOUT CARDS */}
          <TabsContent value="about-cards" className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2D2238]">
                About Shree Velora Cards Background Photos
              </h2>
              <p className="text-sm text-[#5c4b6e]">
                Upload or set background photos for each of the 4 signature cards displayed in the &quot;About Shree Velora&quot; section on the client website.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {(aboutCards || []).map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col justify-between rounded-xl border border-[#EBDCFB] bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#2D2238]">{card.title}</h3>
                      <span className="rounded-full bg-[#EBDCFB] px-2.5 py-1 text-xs font-semibold text-[#7d5ea1]">
                        {card.id}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5c4b6e]">{card.description}</p>

                    {/* Background Image Preview */}
                    <div className="relative mt-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {card.imageSrc ? (
                        <ResponsiveImage
                          alt={card.title}
                          className="size-full"
                          fallbackClassName="bg-slate-100"
                          imageClassName="object-cover"
                          sizes="100vw"
                          src={resolveRenderableImageSrc(card.imageSrc)}
                          title={card.title}
                        />
                      ) : (
                        <div className="p-4 text-center text-slate-400">
                          <ImageIcon className="mx-auto mb-1 size-8 opacity-40" />
                          <span className="text-xs font-medium">No background photo set</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">
                        Upload Photo File
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        className="mt-1 text-xs cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            toast.loading("Uploading to Cloudinary...", { id: `card-upload-${card.id}` });
                            const res = await uploadFileToCloudinary(file, { folder: "shree_velora/about" });
                            updateAboutCardImage(card.id, res.url);
                            toast.success("Card photo uploaded to Cloudinary CDN!", { id: `card-upload-${card.id}` });
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : "Failed to upload photo";
                            toast.error(msg, { id: `card-upload-${card.id}` });
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700">
                        Or Image URL
                      </Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          type="text"
                          placeholder="https://... or /images/..."
                          value={card.imageSrc || ""}
                          onChange={(e) => updateAboutCardImage(card.id, e.target.value)}
                          className="text-xs"
                        />
                        {card.imageSrc ? (
                          <button
                            type="button"
                            onClick={() => updateAboutCardImage(card.id, "")}
                            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 6: MANAGE REVIEWS */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D2238]">Client Reviews & Testimonials</h2>
                <p className="text-sm text-[#5c4b6e]">
                  Manage reviews stored in MongoDB &quot;reviews&quot; collection displayed on the client website.
                </p>
              </div>

              <Dialog open={addReviewOpen} onOpenChange={setAddReviewOpen}>
                <DialogTrigger asChild>
                  <GradientButton type="button">
                    <Plus className="size-4" />
                    Add Review
                  </GradientButton>
                </DialogTrigger>
                <DialogContent className="border-[#EBDCFB] bg-[#FAF7FF] text-[#2D2238] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-bold">Add Client Review</DialogTitle>
                    <DialogDescription className="text-[#5c4b6e]">
                      Add a new client review to MongoDB &quot;reviews&quot; collection.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddReviewSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="rev-author">Client / Author Name *</Label>
                      <Input
                        id="rev-author"
                        value={revAuthorName}
                        onChange={(e) => setRevAuthorName(e.target.value)}
                        placeholder="e.g. Vikram & Ananya Mehta"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rev-role">Role or Event *</Label>
                      <Input
                        id="rev-role"
                        value={revRole}
                        onChange={(e) => setRevRole(e.target.value)}
                        placeholder="e.g. Royal Wedding Client, Udaipur"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rev-rating">Rating (1 to 5 Stars)</Label>
                      <select
                        id="rev-rating"
                        value={revRating}
                        onChange={(e) => setRevRating(Number(e.target.value))}
                        className="mt-1 w-full rounded-md border border-[#EBDCFB] bg-white p-2 text-sm text-[#2D2238]"
                      >
                        <option value={5}>5 Stars (★★★★★)</option>
                        <option value={4}>4 Stars (★★★★☆)</option>
                        <option value={3}>3 Stars (★★★☆☆)</option>
                        <option value={2}>2 Stars (★★☆☆☆)</option>
                        <option value={1}>1 Star (★☆☆☆☆)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="rev-comment">Review Comment *</Label>
                      <Textarea
                        id="rev-comment"
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        placeholder="Enter client testimonial comment..."
                        required
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <GradientButton type="submit">Save to Database</GradientButton>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(reviews || []).map((rev) => (
                <div
                  key={rev.id}
                  className="flex flex-col justify-between rounded-xl border border-[#EBDCFB] bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#D4AF37]">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-current" />
                        ))}
                      </div>
                      <button
                        onClick={() => void deleteReview(rev.id)}
                        type="button"
                        className="text-rose-600 hover:text-rose-800 transition cursor-pointer p-1"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-4 text-xs leading-6 text-[#5c4b6e] italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#EBDCFB] pt-4">
                    <h4 className="font-bold text-sm text-[#2D2238]">{rev.authorName}</h4>
                    <p className="text-xs text-[#7d5ea1] mt-0.5">{rev.roleOrEvent}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
