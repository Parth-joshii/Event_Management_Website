import { SearchX } from "lucide-react";

interface EmptyStateProps {
  readonly description: string;
  readonly title: string;
}

/** Renders a polished empty state for filtered showcase pages. */
export function EmptyState({
  description,
  title
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="rounded-lg border border-dashed border-[#BFA2DB] bg-white/70 px-6 py-14 text-center">
      <SearchX aria-hidden="true" className="mx-auto size-9 text-[#7d5ea1]" />
      <h2 className="mt-5 text-xl font-semibold text-[#2D2238]">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#5c4b6e]">
        {description}
      </p>
    </div>
  );
}
