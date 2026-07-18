import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchBar } from "@/components/showcase/search-bar";

export interface FilterOptionGroup {
  readonly label: string;
  readonly name: string;
  readonly options: readonly string[];
  readonly value?: string;
}

interface FilterSidebarProps {
  readonly action: string;
  readonly groups: readonly FilterOptionGroup[];
  readonly query?: string;
  readonly searchPlaceholder: string;
  readonly sortOptions?: readonly string[];
  readonly sortValue?: string;
}

/** Renders a reusable search, sort, and filter panel. */
export function FilterSidebar({
  action,
  groups,
  query,
  searchPlaceholder,
  sortOptions = [],
  sortValue
}: FilterSidebarProps): React.ReactElement {
  return (
    <form
      action={action}
      className="rounded-lg border border-white/70 bg-white/78 p-5 shadow-[0_22px_70px_rgba(45,34,56,0.08)] backdrop-blur"
    >
      <div className="flex items-center gap-2 text-[#2D2238]">
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        <p className="font-semibold">Filters</p>
      </div>
      <div className="mt-5">
        <SearchBar defaultValue={query} placeholder={searchPlaceholder} />
      </div>
      {sortOptions.length > 0 ? (
        <div className="mt-5 grid gap-2">
          <Label htmlFor="sort">Sort By</Label>
          <select
            className="h-11 rounded-md border border-[#e4d6f2] bg-white px-3 text-sm text-[#2D2238] shadow-sm focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
            defaultValue={sortValue}
            id="sort"
            name="sort"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="mt-5 grid gap-4">
        {groups.map((group) => (
          <div className="grid gap-2" key={group.name}>
            <Label htmlFor={group.name}>{group.label}</Label>
            <select
              className="h-11 rounded-md border border-[#e4d6f2] bg-white px-3 text-sm text-[#2D2238] shadow-sm focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:outline-none"
              defaultValue={group.value ?? ""}
              id={group.name}
              name={group.name}
            >
              <option value="">All</option>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <Button className="mt-6 w-full" type="submit">
        Apply Filters
      </Button>
    </form>
  );
}
