// Committed on purpose: the generated `expo-env.d.ts` is git-ignored and only appears after
// `expo start`, so a fresh clone (and CI) would not type-check `process.env` without this file.
/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Denly API base URL; see `.env.example` and `src/lib/config.ts`. */
    readonly EXPO_PUBLIC_API_URL?: string;
  }
}
