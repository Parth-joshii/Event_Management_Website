import { CheckCircle2, Download } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import type { EventPackage } from "@/types/package";

interface PackageCardProps {
  readonly eventPackage: EventPackage;
}

/** Renders a premium event package card. */
export function PackageCard({ eventPackage }: PackageCardProps): React.ReactElement {
  return (
    <article className="flex h-full flex-col rounded-lg border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(45,34,56,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
        {eventPackage.name}
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-[#2D2238]">
        {eventPackage.price}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">
        {eventPackage.description}
      </p>
      <p className="mt-4 text-sm font-semibold text-[#2D2238]">
        {eventPackage.recommendedFor}
      </p>
      <ul className="mt-6 grid flex-1 gap-3 text-sm text-[#5c4b6e]">
        {eventPackage.includedServices.map((service) => (
          <li className="flex gap-2" key={service}>
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#D4AF37]"
            />
            {service}
          </li>
        ))}
      </ul>
      <div className="mt-7 grid gap-3">
        <GradientButton asChild>
          <a href="#contact">Book Package</a>
        </GradientButton>
        <GradientButton asChild tone="light">
          <a download href={eventPackage.brochurePath}>
            <Download aria-hidden="true" className="size-4" />
            Download Brochure
          </a>
        </GradientButton>
      </div>
    </article>
  );
}
