import Storage from 'expo-sqlite/kv-store';
import { colorScheme } from 'nativewind';

import { logger } from '@/lib/logger';

/**
 * Appearance preference (plan 0003 §3): System · Light · Dark, default System, kept on the phone
 * in `expo-sqlite/kv-store` (not secret). Reads and writes are synchronous so the stored choice is
 * applied before the first frame. A storage failure falls back to System and never blocks the UI.
 */
export type AppearancePreference = 'system' | 'light' | 'dark';

export const APPEARANCE_PREFERENCES: readonly AppearancePreference[] = ['system', 'light', 'dark'];

export const APPEARANCE_STORAGE_KEY = 'denly.appearance';

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function loadAppearance(): AppearancePreference {
  try {
    const stored = Storage.getItemSync(APPEARANCE_STORAGE_KEY);
    return isAppearancePreference(stored) ? stored : 'system';
  } catch (error) {
    logger.warn('Could not read the appearance preference', { error: String(error) });
    return 'system';
  }
}

export function saveAppearance(preference: AppearancePreference): void {
  try {
    Storage.setItemSync(APPEARANCE_STORAGE_KEY, preference);
  } catch (error) {
    logger.warn('Could not save the appearance preference', { error: String(error) });
  }
}

/** Tells NativeWind (and through it the native appearance) which scheme to use. */
export function applyAppearance(preference: AppearancePreference): void {
  colorScheme.set(preference);
}
