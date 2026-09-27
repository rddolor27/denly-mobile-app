/**
 * `GET /health` response. Assumed contract until the backend's OpenAPI output exists:
 * `{ "status": "ok" }`, extra fields ignored. Hand-written guard because the schema-validation
 * library is still an open decision.
 */
export type HealthResponse = { status: 'ok' };

export function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (value as { status?: unknown }).status === 'ok'
  );
}
