export interface ThemeOption {
  readonly colors: readonly string[];
  readonly description: string;
  readonly id: string;
  readonly imageSrc: string;
  readonly name: string;
}

export const themesData: readonly ThemeOption[] = [
  {
    id: "royal-palace",
    name: "Royal Palace",
    description: "Imperial Rajasthani heritage aesthetic with gold arches, velvet drapes & crystal chandeliers.",
    imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    colors: ["#D4AF37", "#2D2238", "#8B0000"]
  },
  {
    id: "modern-luxury",
    name: "Modern Luxury",
    description: "Sleek geometric structures, mirror pathways, neon accents & warm champagne glow.",
    imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    colors: ["#FFFFFF", "#D4AF37", "#1A1A1A"]
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Vibrant marigold mandaps, brass bells, earthen diyas & authentic Indian heritage art.",
    imageSrc: "https://images.unsplash.com/photo-1609102026400-340363e79491?auto=format&fit=crop&w=800&q=80",
    colors: ["#FF9933", "#FFD700", "#800020"]
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean aesthetic lines, subtle foliage, soft ivory linens & architectural simplicity.",
    imageSrc: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    colors: ["#F5F5DC", "#808080", "#2F4F4F"]
  },
  {
    id: "white-floral",
    name: "White Floral",
    description: "Dreamy white roses, baby's breath, cascading orchids & crystal glass light mirrors.",
    imageSrc: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    colors: ["#FFFFFF", "#F8F8FF", "#D4AF37"]
  },
  {
    id: "garden",
    name: "Garden",
    description: "Lush green botanical arches, open-air fairy light canopies & natural floral pathways.",
    imageSrc: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    colors: ["#2E8B57", "#FFFFFF", "#FFD700"]
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Nostalgic retro charm with Edison warm bulbs, antique furniture & rustic wooden stages.",
    imageSrc: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    colors: ["#8B4513", "#D2B48C", "#FFF8DC"]
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    description: "Opulent metallic gold columns, gilded stages & grand shimmering sequin backdrops.",
    imageSrc: "https://images.unsplash.com/photo-1546032996-6dfc12f11821?auto=format&fit=crop&w=800&q=80",
    colors: ["#FFD700", "#DAA520", "#000000"]
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Soft blush pinks, lilac hues, mint tones & romantic fairytale floral ceiling installs.",
    imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    colors: ["#FFB6C1", "#E6E6FA", "#F0FFF0"]
  },
  {
    id: "boho",
    name: "Boho",
    description: "Pampas grass installations, macrame backdrops, rattan accents & warm earthy tones.",
    imageSrc: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
    colors: ["#C2B280", "#8F8170", "#DEB887"]
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "State-of-the-art kinetic light displays, 3D mapped backdrops & avant-garde structures.",
    imageSrc: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80",
    colors: ["#4B0082", "#9932CC", "#D4AF37"]
  },
  {
    id: "grand-indian",
    name: "Grand Indian",
    description: "Regal Indian wedding splendor featuring carved temple pillars, marigold domes & royal red carpets.",
    imageSrc: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    colors: ["#DC143C", "#FFD700", "#2D2238"]
  }
];

export const colorPreferenceOptions = [
  { label: "White", hex: "#FFFFFF", border: true },
  { label: "Gold", hex: "#D4AF37" },
  { label: "Lavender", hex: "#EBDCFB" },
  { label: "Pink", hex: "#FFB6C1" },
  { label: "Red", hex: "#E53E3E" },
  { label: "Maroon", hex: "#800020" },
  { label: "Peach", hex: "#FFDAB9" },
  { label: "Green", hex: "#38A169" },
  { label: "Blue", hex: "#3182CE" },
  { label: "Pastel", hex: "#FAF7FF" },
  { label: "Custom", hex: "rainbow" }
] as const;
