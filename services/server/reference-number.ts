/** Generates a readable inquiry reference number for customers and the team. */
export function createReferenceNumber(date = new Date()): string {
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SV-${datePart}-${randomPart}`;
}
