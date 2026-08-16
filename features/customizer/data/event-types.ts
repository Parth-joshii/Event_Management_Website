export interface EventTypeOption {
  readonly description: string;
  readonly iconName: string;
  readonly id: string;
  readonly imageSrc: string;
  readonly title: string;
}

export const eventTypesData: readonly EventTypeOption[] = [
  {
    id: "wedding",
    title: "Luxury Weddings",
    description: "Royal destination weddings, grand mandaps, sangeet galas & reception nights.",
    imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    iconName: "Crown"
  },
  {
    id: "corporate",
    title: "Corporate Events",
    description: "Conferences, product launches, award nights & annual meets executed to perfection.",
    imageSrc: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    iconName: "Briefcase"
  },
  {
    id: "birthday",
    title: "Birthday Parties",
    description: "Milestone birthdays, theme celebrations, surprise parties & luxury dinner galas.",
    imageSrc: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    iconName: "Cake"
  },
  {
    id: "private",
    title: "Private Parties",
    description: "Anniversaries, cocktail nights, family reunions & exclusive villa celebrations.",
    imageSrc: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    iconName: "Sparkles"
  },
  {
    id: "school",
    title: "School & College Functions",
    description: "Freshers, farewells, fests, graduation ceremonies & annual cultural galas.",
    imageSrc: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    iconName: "GraduationCap"
  },
  {
    id: "religious",
    title: "Religious Events",
    description: "Divine pooja setups, bhajan sandhyas, jagrans, kathas & spiritual galas.",
    imageSrc: "https://images.unsplash.com/photo-1609102026400-340363e79491?auto=format&fit=crop&w=800&q=80",
    iconName: "Flame"
  },
  {
    id: "others",
    title: "Others",
    description: "Custom bespoke event concepts tailored specifically to your unique vision.",
    imageSrc: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    iconName: "Wand2"
  }
];
