import { useColorScheme } from 'nativewind';
import { useCallback, useSyncExternalStore } from 'react';

import {
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type AppearancePreference,
} from '@/lib/appearance';
import type { ColorScheme } from '@/lib/theme';

/** One in-memory copy of the preference, shared by every `useAppearance()` caller. */
let current: AppearancePreference | null = null;
const listeners = new Set<() => void>();

function getPreference(): AppearancePreference {
  current ??= loadAppearance();
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Applies the stored preference. Call once at startup, before the first render. */
export function initAppearance(): void {
  applyAppearance(getPreference());
}

/** Test hook: forget the in-memory copy so the next read goes back to storage. */
export function resetAppearanceForTests(): void {
  current = null;
  listeners.clear();
}

export type Appearance = {
  /** What the user picked in Profile → Appearance. */
  preference: AppearancePreference;
  /** The scheme on screen now (System resolved against the phone setting). */
  colorScheme: ColorScheme;
  setPreference: (next: AppearancePreference) => void;
};

/** The appearance preference and the resolved colour scheme; `setPreference` persists it. */
export function useAppearance(): Appearance {
  const preference = useSyncExternalStore(subscribe, getPreference, getPreference);
  const { colorScheme } = useColorScheme();

  const setPreference = useCallback((next: AppearancePreference) => {
    current = next;
    saveAppearance(next);
    applyAppearance(next);
    listeners.forEach((listener) => listener());
  }, []);

  return { preference, colorScheme: colorScheme === 'dark' ? 'dark' : 'light', setPreference };
}
