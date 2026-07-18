const inrFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency"
});

/** Formats numeric values as Indian Rupees for quotations and budgets. */
export function formatCurrency(value: number): string {
  return inrFormatter.format(value);
}
