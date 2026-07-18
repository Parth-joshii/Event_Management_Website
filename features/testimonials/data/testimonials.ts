import type { Testimonial } from "@/types/testimonial";

export const testimonials = [
  {
    event: "Wedding Reception",
    name: "Riya Sharma",
    rating: 5,
    review:
      "The decor, lighting, and complete management were absolutely beautiful. Shree Velora Event's made our reception look royal and stress-free."
  },
  {
    event: "Corporate Annual Meet",
    name: "Aman Mehta",
    rating: 5,
    review:
      "The team handled our corporate event with complete professionalism, from stage setup to sound and guest coordination."
  },
  {
    event: "Birthday Celebration",
    name: "Neha Jain",
    rating: 5,
    review:
      "The theme decoration and event flow were amazing. Everything looked premium and perfectly planned."
  }
] as const satisfies readonly Testimonial[];
