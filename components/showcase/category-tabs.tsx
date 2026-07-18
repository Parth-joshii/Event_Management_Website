import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  readonly activeCategory: string;
  readonly basePath: string;
  readonly categories: readonly string[];
}

/** Renders category filter tabs with query-string navigation. */
export function CategoryTabs({
  activeCategory,
  basePath,
  categories
}: CategoryTabsProps): React.ReactElement {
  const allCategories = ["All", ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="list">
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        const href =
          category === "All"
            ? basePath
            : `${basePath}?category=${encodeURIComponent(category)}`;

        return (
          <a
            className={cn(
              "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none",
              isActive
                ? "border-[#D4AF37] bg-[#2D2238] text-white"
                : "border-white/70 bg-white/70 text-[#5c4b6e] hover:border-[#D4AF37]/70 hover:text-[#2D2238]"
            )}
            href={href}
            key={category}
            role="listitem"
          >
            {category}
          </a>
        );
      })}
    </div>
  );
}
