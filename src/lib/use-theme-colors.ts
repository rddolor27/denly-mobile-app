import { useColorScheme } from 'nativewind';

import { THEME, type ColorScheme, type ThemeColors } from '@/lib/theme';

/**
 * Token hex values for the scheme on screen, for the few props a `className` cannot reach
 * (ActivityIndicator `color`, SVG fills, navigation options). Prefer classes everywhere else.
 */
export function useThemeColors(): { scheme: ColorScheme; colors: Readonly<ThemeColors> } {
  const { colorScheme } = useColorScheme();
  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
  return { scheme, colors: THEME[scheme] };
}
