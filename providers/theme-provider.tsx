"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/** Provides class-based light and dark theme support. */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
