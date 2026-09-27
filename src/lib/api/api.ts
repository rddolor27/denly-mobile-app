import { config } from '@/lib/config';

import { createApiClient, type ApiClient } from './client';

/** The app-wide client instance. Hooks import this; components never call it directly. */
export const api: ApiClient = createApiClient({
  baseUrl: config.apiUrl,
  timeoutMs: config.apiTimeoutMs,
});
