export const eventTypes = [
  "Luxury Wedding",
  "Corporate Event",
  "Birthday Party",
  "Private Party",
  "School & College Function",
  "Religious Event",
  "Others"
] as const;

export const weddingFunctions = [
  "Haldi",
  "Mehndi",
  "Mayra",
  "Engagement",
  "Sangeet",
  "Wedding",
  "Reception",
  "Destination Wedding"
] as const;

export const eventThemesForCustomizer = [
  "Royal Palace",
  "Modern Luxury",
  "Minimal",
  "Traditional",
  "White Floral",
  "Garden",
  "Vintage",
  "Luxury Gold",
  "Boho",
  "Pastel"
] as const;

export const eventServices = [
  "Lighting Effects",
  "Sound System",
  "Photography",
  "Videography",
  "Drone",
  "Tent Decoration",
  "Floral Decoration",
  "Stage Decoration",
  "LED Wall",
  "Dance Floor",
  "DJ",
  "Live Band",
  "Anchor",
  "SFX",
  "Fireworks",
  "Ghodi",
  "Vintage Car",
  "Baraat Band",
  "Makeup Artist",
  "Catering",
  "Hospitality",
  "Valet Parking",
  "Security",
  "Generator Backup"
] as const;

export const guestMarks = [50, 100, 200, 300, 500, 1000] as const;

export const venuePreferences = [
  "Indoor",
  "Outdoor",
  "Banquet",
  "Hotel",
  "Resort",
  "Farmhouse",
  "Palace",
  "Destination",
  "No Preference"
] as const;

export const budgetRange = {
  max: 50_000_000,
  min: 50_000,
  step: 50_000
} as const;
