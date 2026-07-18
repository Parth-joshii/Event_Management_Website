import { Check, Minus } from "lucide-react";
import type { EventPackage } from "@/types/package";

const comparisonRows = [
  ["photography", "Photography"],
  ["drone", "Drone"],
  ["food", "Food"],
  ["decoration", "Decoration"],
  ["led", "LED"],
  ["band", "Band"],
  ["flowers", "Flowers"],
  ["lighting", "Lighting"],
  ["anchor", "Anchor"],
  ["accommodation", "Accommodation"],
  ["luxuryEntry", "Luxury Entry"],
  ["fireworks", "Fireworks"]
] as const;

interface ComparisonTableProps {
  readonly packages: readonly EventPackage[];
}

/** Renders a horizontally scrollable package comparison table. */
export function ComparisonTable({
  packages
}: ComparisonTableProps): React.ReactElement {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-[#2D2238] text-white">
          <tr>
            <th className="px-4 py-4 text-left">Included</th>
            {packages.map((eventPackage) => (
              <th className="px-4 py-4 text-center" key={eventPackage.name}>
                {eventPackage.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map(([key, label]) => (
            <tr className="border-t border-[#EBDCFB]" key={key}>
              <th className="px-4 py-4 text-left font-semibold text-[#2D2238]">
                {label}
              </th>
              {packages.map((eventPackage) => {
                const enabled = eventPackage.services[key];
                return (
                  <td className="px-4 py-4 text-center" key={eventPackage.name}>
                    {enabled ? (
                      <Check
                        aria-label="Included"
                        className="mx-auto size-5 text-[#D4AF37]"
                      />
                    ) : (
                      <Minus
                        aria-label="Not included"
                        className="mx-auto size-5 text-[#b8a9c5]"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
