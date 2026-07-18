import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  readonly href?: string;
  readonly label: string;
}

interface BreadcrumbProps {
  readonly items: readonly BreadcrumbItem[];
}

/** Renders accessible breadcrumbs for showcase pages. */
export function Breadcrumb({ items }: BreadcrumbProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/70">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            aria-label="Home"
            className="inline-flex items-center gap-1 transition hover:text-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
            href="/"
          >
            <Home aria-hidden="true" className="size-4" />
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex items-center gap-2" key={item.label}>
            <ChevronRight aria-hidden="true" className="size-4 text-white/35" />
            {item.href ? (
              <a
                className="transition hover:text-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
