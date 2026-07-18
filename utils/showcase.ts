export interface PaginationResult<TItem> {
  readonly items: readonly TItem[];
  readonly page: number;
  readonly pageCount: number;
  readonly total: number;
}

/** Filters items by a search term across selected fields. */
export function searchItems<TItem>(
  items: readonly TItem[],
  query: string,
  getSearchableText: (item: TItem) => string
): readonly TItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(normalizedQuery)
  );
}

/** Returns a stable page slice for showcase collections. */
export function paginateItems<TItem>(
  items: readonly TItem[],
  page: number,
  perPage: number
): PaginationResult<TItem> {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    pageCount,
    total: items.length
  };
}

/** Normalizes route search parameters that may be absent or array-like. */
export function readSearchParam(
  value: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}
