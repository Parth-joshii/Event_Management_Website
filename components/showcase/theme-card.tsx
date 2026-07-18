import Link from "next/link";
import { Palette } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { EventTheme } from "@/types/theme";

interface ThemeCardProps {
  readonly theme: EventTheme;
}

/** Renders a luxury theme collection card. */
export function ThemeCard({ theme }: ThemeCardProps): React.ReactElement {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70">
      <ResponsiveImage
        alt={`${theme.title} event theme`}
        className="h-64"
        fallbackClassName={theme.fallbackClassName}
        imageClassName="transition duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 33vw, 100vw"
        src={theme.heroImage}
        title={theme.title}
      />
      <div className="p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
          {theme.category}
        </p>
        <h3 className="mt-3 text-xl font-semibold text-[#2D2238]">{theme.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">{theme.description}</p>
        <div className="mt-5 flex gap-2">
          {theme.colorPalette.map((color) => (
            <span
              aria-label={`Color ${color}`}
              className="size-7 rounded-full border border-white shadow-sm"
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <GradientButton asChild>
            <Link href="#contact">
              <Palette aria-hidden="true" className="size-4" />
              Book This Theme
            </Link>
          </GradientButton>
        </div>
      </div>
    </article>
  );
}
