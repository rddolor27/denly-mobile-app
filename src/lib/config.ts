/**
 * The one place the app reads its environment. Values are validated when this module loads, so a
 * missing or malformed variable stops the app at boot with a clear message instead of failing at
 * first use. Only `EXPO_PUBLIC_*` variables exist in the bundle and every one of them is public —
 * never put a secret here.
 */

export type AppConfig = {
  /** Base URL of the Denly API, without a trailing slash. */
  apiUrl: string;
  /** Per-request timeout for API calls. */
  apiTimeoutMs: number;
};

export type RawEnv = {
  EXPO_PUBLIC_API_URL: string | undefined;
};

export class ConfigError extends Error {
  readonly code = 'CONFIG_INVALID';

  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const API_TIMEOUT_MS = 10_000;

function parseApiUrl(raw: string | undefined, allowInsecure: boolean): string {
  const value = raw?.trim();
  if (!value) {
    throw new ConfigError(
      'EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set the Denly API base URL.',
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigError(`EXPO_PUBLIC_API_URL is not a valid URL: "${value}".`);
  }

  const secure = url.protocol === 'https:';
  const insecureAllowed = url.protocol === 'http:' && allowInsecure;
  if (!secure && !insecureAllowed) {
    throw new ConfigError(
      allowInsecure
        ? `EXPO_PUBLIC_API_URL must use http or https, got "${url.protocol}".`
        : 'EXPO_PUBLIC_API_URL must use https outside development builds.',
    );
  }

  return value.replace(/\/+$/, '');
}

/** Pure parser so the rules are testable; `isDev` allows plain http for a local backend. */
export function parseConfig(env: RawEnv, isDev: boolean): AppConfig {
  return {
    apiUrl: parseApiUrl(env.EXPO_PUBLIC_API_URL, isDev),
    apiTimeoutMs: API_TIMEOUT_MS,
  };
}

// Each variable must be read as a literal `process.env.EXPO_PUBLIC_*` member so Expo inlines it.
export const config: AppConfig = parseConfig(
  { EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL },
  __DEV__,
);
