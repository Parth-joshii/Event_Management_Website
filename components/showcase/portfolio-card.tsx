import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveImage } from "@/components/ui/responsive-image";

interface PortfolioCardProps {
  readonly badge?: string;
  readonly description: string;
  readonly fallbackClassName: string;
  readonly href?: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly meta?: readonly string[];
  readonly title: string;
}

/** Renders a premium card for portfolio-style collections. */
export function PortfolioCard({
  badge,
  description,
  fallbackClassName,
  href,
  imageAlt,
  imageSrc,
  meta = [],
  title
}: PortfolioCardProps): React.ReactElement {
  const content = (
    <article className="group h-full overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70">
      <ResponsiveImage
        alt={imageAlt}
        className="h-64"
        fallbackClassName={fallbackClassName}
        imageClassName="transition duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 33vw, 100vw"
        src={imageSrc}
        title={title}
      />
      <div className="p-6">
        {badge ? <Badge className="bg-[#EBDCFB] text-[#2D2238]">{badge}</Badge> : null}
        <h3 className="mt-4 text-xl font-semibold text-[#2D2238]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">{description}</p>
        {meta.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[#7d5ea1]">
            {meta.map((item) => (
              <span className="rounded-full bg-[#FAF7FF] px-3 py-1" key={item}>
                {item}
              </span>
            ))}
          </div>
        ) : null}
        {href ? (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2D2238]">
            View Story
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <a
      className="block h-full rounded-lg focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
      href={href}
    >
      {content}
    </a>
  ) : (
    content
  );
}
