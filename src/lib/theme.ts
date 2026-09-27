import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

/**
 * Denly colour tokens as hex, mirroring the HSL variables in `src/global.css` (plan 0003 §2,
 * ADR 0009). Use Tailwind classes (`bg-primary`, `text-detected`) in components; read these only
 * where a class cannot reach: navigation theme, status bar, icon `color` props, SVG fills.
 * `theme-sync.spec.ts` fails when this file and `global.css` drift; `theme-contrast.spec.ts`
 * guards every text/surface pair in both modes.
 */
export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  /** Black "What's on your counter?" card. */
  hero: string;
  heroForeground: string;
  /** Viewfinder and its overlays: dark in both modes. */
  camera: string;
  cameraForeground: string;
  /** Confidence band Detected (reserved: never a category colour). */
  detected: string;
  detectedSoft: string;
  /** Confidence band Likely (reserved). */
  likely: string;
  /** Offline banner. */
  info: string;
  infoSoft: string;
  /** Dish pot tile. */
  dish: string;
  dishSoft: string;
  /** Leafy green and citrus badges. */
  leafy: string;
  leafySoft: string;
  /** Fish badges. */
  fish: string;
  fishSoft: string;
};

export const THEME: Readonly<Record<ColorScheme, Readonly<ThemeColors>>> = {
  light: {
    background: '#F4F5F0',
    foreground: '#1B2018',
    card: '#FFFFFF',
    cardForeground: '#1B2018',
    popover: '#FFFFFF',
    popoverForeground: '#1B2018',
    primary: '#A1305A',
    primaryForeground: '#FFFFFF',
    secondary: '#F6E4EC',
    secondaryForeground: '#7E2446',
    muted: '#EEF0E9',
    mutedForeground: '#596055',
    accent: '#E8EAE3',
    accentForeground: '#1B2018',
    destructive: '#B42318',
    destructiveForeground: '#FFFFFF',
    border: '#DCE0D5',
    input: '#DCE0D5',
    ring: '#A1305A',
    hero: '#1E211B',
    heroForeground: '#FFFFFF',
    camera: '#1E211B',
    cameraForeground: '#FFFFFF',
    detected: '#2D6A39',
    detectedSoft: '#E3EFE2',
    likely: '#875800',
    info: '#1F4870',
    infoSoft: '#E4ECF5',
    dish: '#9A4507',
    dishSoft: '#FBEBDC',
    leafy: '#0E6B63',
    leafySoft: '#DDF0EC',
    fish: '#1D5E8C',
    fishSoft: '#E2EDF6',
  },
  dark: {
    background: '#111410',
    foreground: '#ECEFE7',
    card: '#1B1F19',
    cardForeground: '#ECEFE7',
    popover: '#1B1F19',
    popoverForeground: '#ECEFE7',
    primary: '#F09AB9',
    primaryForeground: '#2A0A17',
    secondary: '#3A1627',
    secondaryForeground: '#F4A7C3',
    muted: '#262B23',
    mutedForeground: '#A2A99C',
    accent: '#242922',
    accentForeground: '#ECEFE7',
    destructive: '#F08A80',
    destructiveForeground: '#2A0906',
    border: '#2F352B',
    input: '#2F352B',
    ring: '#F09AB9',
    hero: '#262A22',
    heroForeground: '#FFFFFF',
    camera: '#1E211B',
    cameraForeground: '#FFFFFF',
    detected: '#8FCC97',
    detectedSoft: '#1F3322',
    likely: '#E5B65A',
    info: '#A9C8E8',
    infoSoft: '#1A2733',
    dish: '#F5A25B',
    dishSoft: '#3A2410',
    leafy: '#6FD1C4',
    leafySoft: '#12302C',
    fish: '#8CC4EE',
    fishSoft: '#15283A',
  },
};

/** Navigation container theme per scheme (screen backgrounds, headers, native chrome). */
export const NAV_THEME: Readonly<Record<ColorScheme, Theme>> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
