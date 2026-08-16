export interface PriceItem {
  readonly category: string;
  readonly baseCost: number;
}

export const categoryBaseCosts: Record<string, number> = {
  Decoration: 180000,
  Photography: 75000,
  Lighting: 45000,
  Sound: 35000,
  Entertainment: 50000,
  Hospitality: 40000,
  "Special Entries": 35000
};

export const guestMultiplierRules = [
  { maxGuests: 100, multiplier: 1.0 },
  { maxGuests: 300, multiplier: 1.25 },
  { maxGuests: 500, multiplier: 1.5 },
  { maxGuests: 1000, multiplier: 1.85 },
  { maxGuests: 5000, multiplier: 2.3 }
] as const;

export interface DetailedEstimate {
  readonly breakdown: Record<string, number>;
  readonly estimatedMax: number;
  readonly estimatedMin: number;
  readonly recommendedPackage: string;
  readonly recommendedServices: readonly string[];
  readonly recommendedTheme: string;
  readonly totalEstimate: number;
}

export function calculateIndicativeEstimate(
  selectedServices: readonly string[],
  guests: number,
  theme: string = "Royal Palace"
): DetailedEstimate {
  const guestRule =
    guestMultiplierRules.find((rule) => guests <= rule.maxGuests) ??
    guestMultiplierRules[guestMultiplierRules.length - 1];

  const multiplier = guestRule?.multiplier ?? 1;
  const breakdown: Record<string, number> = {};
  let totalEstimate = 0;

  if (selectedServices.length === 0) {
    breakdown["Decoration"] = Math.round(150000 * multiplier);
    breakdown["Photography"] = Math.round(60000 * multiplier);
    breakdown["Lighting"] = Math.round(40000 * multiplier);
    totalEstimate = 250000 * multiplier;
  } else {
    selectedServices.forEach((service) => {
      let cost = 30000;
      if (service.includes("Decoration")) cost = 80000;
      else if (service.includes("Photography") || service.includes("Videography")) cost = 50000;
      else if (service.includes("Lighting")) cost = 30000;
      else if (service.includes("Sound") || service.includes("DJ")) cost = 25000;
      else if (service.includes("Band") || service.includes("Anchor")) cost = 35000;
      else if (service.includes("Entry") || service.includes("Car")) cost = 25000;

      const categoryName = service.includes("Decoration")
        ? "Decoration"
        : service.includes("Photography") || service.includes("Videography") || service.includes("Drone")
        ? "Photography"
        : service.includes("Lighting")
        ? "Lighting"
        : service.includes("Sound") || service.includes("DJ")
        ? "Sound"
        : service.includes("Band") || service.includes("Fireworks") || service.includes("SFX")
        ? "Entertainment"
        : "Other Services";

      const finalServiceCost = Math.round(cost * multiplier);
      breakdown[categoryName] = (breakdown[categoryName] || 0) + finalServiceCost;
      totalEstimate += finalServiceCost;
    });
  }

  const estimatedMin = Math.round(totalEstimate * 0.85);
  const estimatedMax = Math.round(totalEstimate * 1.2);

  let recommendedPackage = "Silver Celebration";
  if (totalEstimate > 1000000) recommendedPackage = "Royal Imperial";
  else if (totalEstimate > 500000) recommendedPackage = "Diamond Grandeur";
  else if (totalEstimate > 250000) recommendedPackage = "Gold Elegance";

  return {
    breakdown,
    estimatedMax,
    estimatedMin,
    recommendedPackage,
    recommendedServices: ["Decoration", "Photography", "Lighting", "Sound"],
    recommendedTheme: theme || "Royal Palace",
    totalEstimate
  };
}
