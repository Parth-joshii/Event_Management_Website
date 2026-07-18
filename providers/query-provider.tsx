"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";

interface QueryProviderProps {
  readonly children: React.ReactNode;
}

/** Provides a stable TanStack Query client for all client features. */
export function QueryProvider({ children }: QueryProviderProps): React.ReactElement {
  const [queryClient] = React.useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
