"use client";

import * as React from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/stores/content-store";

/** Renders client testimonials connected directly to MongoDB reviews collection. */
export function TestimonialsSection(): React.ReactElement {
  const { reviews, addReview, fetchFromDatabase } = useContentStore();
  const [showForm, setShowForm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [formName, setFormName] = React.useState("");
  const [formEvent, setFormEvent] = React.useState("");
  const [formRating, setFormRating] = React.useState(5);
  const [formReview, setFormReview] = React.useState("");

  React.useEffect(() => {
    void fetchFromDatabase();
  }, [fetchFromDatabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim()) return;

    await addReview({
      authorName: formName.trim(),
      roleOrEvent: formEvent.trim() || "Luxury Celebration Client",
      rating: formRating,
      comment: formReview.trim()
    });

    setSubmitted(true);
    setFormName("");
    setFormEvent("");
    setFormRating(5);
    setFormReview("");
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2500);
  };

  return (
    <section id="testimonials" className="bg-[#FAF7FF] py-24 sm:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Client Stories"
              title="Celebrations Remembered, Trust Earned"
              description="Words from families, brands, and hosts who entrusted Shree Velora with their most meaningful occasions."
            />
            <GradientButton
              onClick={() => setShowForm(!showForm)}
              tone="dark"
              type="button"
            >
              <MessageSquarePlus aria-hidden="true" className="size-4" />
              {showForm ? "Close Form" : "Write A Review"}
            </GradientButton>
          </div>
        </Reveal>

        {/* Add Review Form */}
        {showForm ? (
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-[#EBDCFB] bg-white p-6 sm:p-8 shadow-lg max-w-2xl mx-auto"
            >
              <h3 className="font-display text-2xl font-semibold text-[#2D2238]">
                Share Your Experience
              </h3>
              <p className="mt-1 text-sm text-[#5c4b6e]">
                We value your feedback. Let us know how your event went! Your review will be saved in our database.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-lg bg-[#EBDCFB]/70 p-4 text-center font-medium text-[#2D2238]">
                  Thank you! Your review has been saved to MongoDB successfully.
                </div>
              ) : (
                <div className="mt-6 grid gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="review-name">Your Name *</Label>
                      <Input
                        id="review-name"
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Ananya Roy"
                        required
                        value={formName}
                      />
                    </div>
                    <div>
                      <Label htmlFor="review-event">Event Type</Label>
                      <Input
                        id="review-event"
                        onChange={(e) => setFormEvent(e.target.value)}
                        placeholder="e.g. Royal Wedding, Sangeet"
                        value={formEvent}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review-rating">Rating (1 to 5 Stars)</Label>
                    <div className="mt-2 flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          className="p-1 text-[#D4AF37] focus:outline-none transition hover:scale-110 cursor-pointer"
                          key={star}
                          onClick={() => setFormRating(star)}
                          type="button"
                        >
                          <Star
                            className={`size-6 ${
                              star <= formRating ? "fill-current" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review-msg">Your Review *</Label>
                    <Textarea
                      id="review-msg"
                      onChange={(e) => setFormReview(e.target.value)}
                      placeholder="Tell us about your celebration experience..."
                      required
                      rows={3}
                      value={formReview}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <GradientButton type="submit">Submit Review</GradientButton>
                  </div>
                </div>
              )}
            </form>
          </Reveal>
        ) : null}

        {/* Testimonials Grid or Empty State */}
        {!reviews || reviews.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#EBDCFB] bg-white px-6 py-10 text-center shadow-sm">
            <p className="font-semibold text-[#2D2238]">No client reviews published yet.</p>
            <p className="mt-2 text-sm text-[#5c4b6e]">
              Click &quot;Write A Review&quot; above to be the first to share your celebration experience!
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((testimonial, index) => (
              <Reveal delay={index * 0.06} key={testimonial.id || index}>
                <LuxuryCard className="flex h-full flex-col p-6">
                  <div className="flex gap-1 text-[#D4AF37]">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, star) => (
                      <Star
                        aria-hidden="true"
                        className="size-4 fill-current"
                        key={star}
                      />
                    ))}
                  </div>
                  <p className="mt-6 flex-1 text-sm leading-7 text-[#5c4b6e]">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <div className="mt-7 border-t border-[#EBDCFB] pt-5">
                    <p className="font-semibold text-[#2D2238]">{testimonial.authorName}</p>
                    <p className="mt-1 text-sm text-[#7d5ea1]">{testimonial.roleOrEvent}</p>
                  </div>
                </LuxuryCard>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

