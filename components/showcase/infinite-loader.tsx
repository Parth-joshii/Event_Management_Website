import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfiniteLoaderProps {
  readonly href?: string;
  readonly label?: string;
}

/** Renders a progressive pagination control that can become infinite scroll later. */
export function InfiniteLoader({
  href,
  label = "Load More"
}: InfiniteLoaderProps): React.ReactElement | null {
  if (!href) {
    return null;
  }

  return (
    <div className="mt-10 flex justify-center">
      <Button asChild variant="outline">
        <a href={href}>
          {label}
          <ChevronRight aria-hidden="true" className="size-4" />
        </a>
      </Button>
    </div>
  );
}
