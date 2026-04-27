"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query provider — wraps the app with a QueryClient.
 *
 * We create the client inside useState so each server render gets
 * a fresh client (avoids cross-request data leaks in SSR).
 *
 * Config rationale:
 * - staleTime: 2min — menu data doesn't change often
 * - gcTime: 10min — keep unused queries in cache
 * - retry: 1 — one retry on network error is enough for a food app
 * - refetchOnWindowFocus: false — avoids jarring refetches mid-order
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
