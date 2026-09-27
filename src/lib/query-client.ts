import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';

import { ApiError } from '@/lib/api/api-error';

const MAX_QUERY_RETRIES = 2;

/** Never retry a 4xx: the same request will fail the same way. */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.isClientError) return false;
  return failureCount < MAX_QUERY_RETRIES;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: shouldRetryQuery,
        // Opt in per query; focus is driven by AppState below, not by a browser window.
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

export const queryClient = createQueryClient();

/**
 * Tells TanStack Query when the app comes to the foreground. Call once from the root layout.
 * `onlineManager` stays on its default until a connectivity library is chosen.
 */
export function wireQueryFocusToAppState(): void {
  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      setFocused(status === 'active');
    });
    return () => subscription.remove();
  });
}
