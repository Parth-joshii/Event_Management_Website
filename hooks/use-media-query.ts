"use client";

import * as React from "react";

/** Returns whether the current viewport matches a media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();
    mediaQueryList.addEventListener("change", updateMatch);

    return () => {
      mediaQueryList.removeEventListener("change", updateMatch);
    };
  }, [query]);

  return matches;
}
