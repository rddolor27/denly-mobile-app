/**
 * The only error shape hooks and screens see from the API client. `code` mirrors the backend's
 * stable UPPER_SNAKE codes (`{ statusCode, code, message, details?, requestId, timestamp }`);
 * transport failures get client-side codes and `status: 0`.
 */
export type ClientErrorCode = 'NETWORK_ERROR' | 'TIMEOUT' | 'INVALID_RESPONSE' | 'HTTP_ERROR';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;

  constructor(params: { status: number; code: string; message: string; requestId?: string }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.requestId = params.requestId;
  }

  /** 4xx: retrying the same request will not help. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /** No usable answer from the server: offline, unreachable or too slow. */
  get isConnectivityError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }
}

type BackendErrorBody = { code: string; message: string; requestId?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Type guard for the backend's documented error response. */
export function isBackendErrorBody(value: unknown): value is BackendErrorBody {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.message === 'string' &&
    (value.requestId === undefined || typeof value.requestId === 'string')
  );
}
