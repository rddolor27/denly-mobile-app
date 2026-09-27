import { ApiError, isBackendErrorBody } from './api-error';
import { isHealthResponse, type HealthResponse } from './health';

export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type ApiClientOptions = {
  baseUrl: string;
  timeoutMs: number;
  fetchFn?: FetchFn;
};

export type ApiClient = {
  health(): Promise<HealthResponse>;
};

type Guard<T> = (value: unknown) => value is T;

function createRequestId(): string {
  // Correlation id for logs on both sides — not a secret, so Math.random is enough.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * The single typed HTTP client for the Denly API. JSON only (images never leave the phone);
 * every response is checked by a type guard before it is returned, and every failure becomes an
 * `ApiError`.
 */
export function createApiClient({ baseUrl, timeoutMs, fetchFn = fetch }: ApiClientOptions): ApiClient {
  async function getJson<T>(path: string, guard: Guard<T>): Promise<T> {
    const requestId = createRequestId();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}${path}`, {
        method: 'GET',
        headers: { Accept: 'application/json', 'x-request-id': requestId },
        signal: controller.signal,
      });
    } catch {
      const timedOut = controller.signal.aborted;
      throw new ApiError({
        status: 0,
        code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: timedOut ? 'The Denly API did not answer in time.' : 'The Denly API could not be reached.',
        requestId,
      });
    } finally {
      clearTimeout(timer);
    }

    const body = await readJson(response);

    if (!response.ok) {
      if (isBackendErrorBody(body)) {
        throw new ApiError({
          status: response.status,
          code: body.code,
          message: body.message,
          requestId: body.requestId ?? requestId,
        });
      }
      throw new ApiError({
        status: response.status,
        code: 'HTTP_ERROR',
        message: `The Denly API answered with status ${response.status}.`,
        requestId,
      });
    }

    if (!guard(body)) {
      throw new ApiError({
        status: response.status,
        code: 'INVALID_RESPONSE',
        message: `Unexpected response shape from ${path}.`,
        requestId,
      });
    }
    return body;
  }

  return {
    health: () => getJson('/health', isHealthResponse),
  };
}
