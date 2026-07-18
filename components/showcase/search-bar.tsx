import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  readonly defaultValue?: string;
  readonly name?: string;
  readonly placeholder: string;
}

/** Renders a reusable showcase search input. */
export function SearchBar({
  defaultValue,
  name = "q",
  placeholder
}: SearchBarProps): React.ReactElement {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7d5ea1]"
      />
      <Input
        className="h-12 border-white/70 bg-white/80 pl-10 text-[#2D2238] shadow-sm"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}
