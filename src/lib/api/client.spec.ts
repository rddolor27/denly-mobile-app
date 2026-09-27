import { ApiError } from './api-error';
import { createApiClient, type FetchFn } from './client';
import { isHealthResponse } from './health';

const BASE_URL = 'https://api.test.denly.invalid';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function clientWith(fetchFn: FetchFn, timeoutMs = 1_000) {
  return createApiClient({ baseUrl: BASE_URL, timeoutMs, fetchFn });
}

async function captureError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
  throw new Error('expected the promise to reject');
}

describe('isHealthResponse', () => {
  it('accepts { status: "ok" } and ignores extra fields', () => {
    expect(isHealthResponse({ status: 'ok' })).toBe(true);
    expect(isHealthResponse({ status: 'ok', uptime: 12 })).toBe(true);
  });

  it.each([null, undefined, 'ok', [], {}, { status: 'down' }, { status: true }])(
    'rejects %p',
    (value) => {
      expect(isHealthResponse(value)).toBe(false);
    },
  );
});

describe('createApiClient().health', () => {
  it('calls GET /health with JSON and a request id, and returns the validated body', async () => {
    const fetchFn = jest.fn<Promise<Response>, Parameters<FetchFn>>(async () =>
      jsonResponse(200, { status: 'ok' }),
    );

    await expect(clientWith(fetchFn).health()).resolves.toEqual({ status: 'ok' });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] ?? [];
    expect(url).toBe(`${BASE_URL}/health`);
    expect(init?.method).toBe('GET');
    const headers = init?.headers as Record<string, string>;
    expect(headers.Accept).toBe('application/json');
    expect(headers['x-request-id']).toEqual(expect.any(String));
  });

  it('rejects a 200 whose body does not match the contract', async () => {
    const error = await captureError(
      clientWith(async () => jsonResponse(200, { status: 'down' })).health(),
    );

    expect(error.code).toBe('INVALID_RESPONSE');
    expect(error.status).toBe(200);
  });

  it('rejects a 200 whose body is not JSON', async () => {
    const error = await captureError(
      clientWith(async () => new Response('<html>', { status: 200 })).health(),
    );

    expect(error.code).toBe('INVALID_RESPONSE');
  });

  it('maps the backend error body to ApiError', async () => {
    const error = await captureError(
      clientWith(async () =>
        jsonResponse(503, {
          statusCode: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: 'Database unavailable',
          requestId: 'req-123',
          timestamp: '2026-09-23T00:00:00.000Z',
        }),
      ).health(),
    );

    expect(error).toMatchObject({ status: 503, code: 'SERVICE_UNAVAILABLE', requestId: 'req-123' });
    expect(error.isClientError).toBe(false);
  });

  it('maps an unexpected error body to HTTP_ERROR', async () => {
    const error = await captureError(clientWith(async () => jsonResponse(404, 'nope')).health());

    expect(error).toMatchObject({ status: 404, code: 'HTTP_ERROR' });
    expect(error.isClientError).toBe(true);
  });

  it('maps a network failure to NETWORK_ERROR', async () => {
    const error = await captureError(
      clientWith(async () => {
        throw new TypeError('Network request failed');
      }).health(),
    );

    expect(error).toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
    expect(error.isConnectivityError).toBe(true);
  });

  it('aborts and maps a slow response to TIMEOUT', async () => {
    const neverAnswers: FetchFn = (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });

    const error = await captureError(clientWith(neverAnswers, 10).health());

    expect(error).toMatchObject({ status: 0, code: 'TIMEOUT' });
  });
});
