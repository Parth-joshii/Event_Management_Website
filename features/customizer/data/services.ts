export interface ServiceCategory {
  readonly category: string;
  readonly iconName: string;
  readonly options: readonly string[];
}

export const categorizedServices: readonly ServiceCategory[] = [
  {
    category: "Decoration",
    iconName: "Flower2",
    options: [
      "Tent Decoration",
      "Floral Decoration",
      "Stage Decoration",
      "Entrance Decoration",
      "Table Decoration",
      "Mandap Decoration"
    ]
  },
  {
    category: "Lighting",
    iconName: "Sparkles",
    options: [
      "Ambient Lighting",
      "Architectural Lighting",
      "LED Lighting",
      "Fairy Lights",
      "Moving Heads",
      "Laser"
    ]
  },
  {
    category: "Sound & Entertainment",
    iconName: "Music",
    options: [
      "Sound System",
      "DJ",
      "Live Band",
      "SFX",
      "Fireworks",
      "Dance Floor"
    ]
  },
  {
    category: "Photography",
    iconName: "Camera",
    options: [
      "Photography",
      "Cinematic Videography",
      "Drone",
      "Pre-Wedding Shoot",
      "Photo Booth"
    ]
  },
  {
    category: "Hospitality",
    iconName: "Users",
    options: [
      "Anchors",
      "Guest Management",
      "Valet Parking",
      "Hospitality Team"
    ]
  },
  {
    category: "Special Entries",
    iconName: "Crown",
    options: [
      "Ghodi",
      "Vintage Car",
      "Band / Baraat on Wheels",
      "Luxury Entry",
      "Cold Pyro"
    ]
  }
];
