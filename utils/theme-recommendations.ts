import { eventThemes } from "@/features/themes/data/themes";
import type { EventTheme } from "@/types/theme";

/** Recommends similar themes from curated static relationships. */
export function recommendThemes(themeSlug: string): readonly EventTheme[] {
  const themes: readonly EventTheme[] = eventThemes;
  const selectedTheme = themes.find((theme) => theme.slug === themeSlug);

  if (!selectedTheme) {
    return themes.slice(0, 3);
  }

  return selectedTheme.recommendedThemeSlugs
    .map((slug) => themes.find((theme) => theme.slug === slug))
    .filter((theme): theme is EventTheme => Boolean(theme));
}
