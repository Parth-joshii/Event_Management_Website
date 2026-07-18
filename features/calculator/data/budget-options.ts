import type { BudgetEstimate } from "@/types/inquiry";

export const calculatorEvents = [
  "Luxury Wedding",
  "Corporate Event",
  "Birthday Party",
  "Private Party",
  "School & College Function",
  "Religious Event"
] as const;

export const calculatorAddOns = [
  "Decoration",
  "Photography",
  "Food",
  "Entertainment",
  "Lighting",
  "SFX",
  "Luxury Entry"
] as const;

export const addOnBasePrices = {
  Decoration: 180_000,
  Entertainment: 120_000,
  Food: 750,
  Lighting: 90_000,
  "Luxury Entry": 150_000,
  Photography: 110_000,
  SFX: 80_000
} as const;

const eventBasePrices = {
  "Birthday Party": 120_000,
  "Corporate Event": 260_000,
  "Luxury Wedding": 600_000,
  "Private Party": 180_000,
  "Religious Event": 160_000,
  "School & College Function": 220_000
} as const;

/** Calculates a practical budget estimate from selected event inputs. */
export function calculateBudgetEstimate(
  eventType: keyof typeof eventBasePrices,
  guests: number,
  selectedAddOns: readonly string[]
): BudgetEstimate {
  const base = eventBasePrices[eventType] ?? 180_000;
  const foodCost = selectedAddOns.includes("Food") ? guests * addOnBasePrices.Food : 0;
  const addOnTotal = selectedAddOns
    .filter((addOn) => addOn !== "Food")
    .reduce((total, addOn) => {
      const key = addOn as keyof typeof addOnBasePrices;
      return total + (addOnBasePrices[key] ?? 0);
    }, 0);
  const guestScale = Math.max(1, guests / 150);
  const estimatedBudget = Math.round((base + addOnTotal) * guestScale + foodCost);
  const lower = Math.round(estimatedBudget * 0.88);
  const upper = Math.round(estimatedBudget * 1.18);

  return {
    budgetRange: `INR ${lower.toLocaleString("en-IN")} - INR ${upper.toLocaleString("en-IN")}`,
    estimatedBudget,
    suggestedPackage:
      estimatedBudget > 2_500_000
        ? "Royal"
        : estimatedBudget > 1_200_000
          ? "Diamond"
          : estimatedBudget > 500_000
            ? "Gold"
            : "Silver",
    suggestedTheme:
      eventType === "Luxury Wedding"
        ? "Royal Palace"
        : eventType === "Corporate Event"
          ? "Modern Luxury"
          : "Pastel",
    suggestedVenue:
      guests > 500
        ? "Palace or Convention Centre"
        : guests > 250
          ? "Banquet or Resort"
          : "Boutique Banquet"
  };
}
