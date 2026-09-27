import '../global.css';

// Per-weight imports so only the two weights Denly uses are bundled (the package index pulls all 8).
import { BricolageGrotesque_500Medium } from '@expo-google-fonts/bricolage-grotesque/500Medium';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DemoProvider } from '@/features/demo/demo-provider';
import { PackDownloadProvider } from '@/features/offline-data/PackDownloadProvider';
import { ToastProvider } from '@/features/toast/ToastProvider';
import { logger } from '@/lib/logger';
import { queryClient, wireQueryFocusToAppState } from '@/lib/query-client';
import { NAV_THEME, THEME } from '@/lib/theme';
import { initAppearance, useAppearance } from '@/lib/use-appearance';

// Before the first frame: the stored System/Light/Dark choice, and the splash stays up until
// the display font is ready.
initAppearance();
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ BricolageGrotesque_500Medium, BricolageGrotesque_700Bold });
  const { colorScheme } = useAppearance();
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    wireQueryFocusToAppState();
  }, []);

  useEffect(() => {
    // Root view colour behind screens (visible during transitions and keyboard animations).
    void SystemUI.setBackgroundColorAsync(THEME[colorScheme].background);
  }, [colorScheme]);

  useEffect(() => {
    if (fontError) logger.warn('Display font failed to load; using the system font', { error: fontError.message });
    if (ready) void SplashScreen.hideAsync();
  }, [ready, fontError]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <DemoProvider>
          <ToastProvider>
            <PackDownloadProvider>
              <ThemeProvider value={NAV_THEME[colorScheme]}>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" options={{ animation: 'none' }} />
                  <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                  <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                  <Stack.Screen name="scan" options={{ animation: 'slide_from_bottom' }} />
                </Stack>
                <PortalHost />
              </ThemeProvider>
            </PackDownloadProvider>
          </ToastProvider>
        </DemoProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
