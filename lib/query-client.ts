import { QueryClient } from "@tanstack/react-query";

/** Creates a TanStack Query client with production-friendly defaults. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: 0
      },
      queries: {
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 60 * 1000
      }
    }
  });
}
