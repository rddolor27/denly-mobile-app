import { render } from '@testing-library/react-native';
import { useEffect, type ReactElement } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DemoProvider, useDemo, type DemoContextValue } from '@/features/demo/demo-provider';
import { INITIAL_DEMO_STATE, type DemoState } from '@/features/demo/demo-state';
import { PackDownloadProvider } from '@/features/offline-data/PackDownloadProvider';
import { ToastProvider } from '@/features/toast/ToastProvider';
import { useToast } from '@/features/toast/use-toast';

/** iPhone 13 metrics, so safe-area-aware components render as on the floor device. */
const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** The latest demo context value seen by the probe (read it in assertions). */
export const demoProbe: { current: DemoContextValue | null } = { current: null };

/** The toast message on screen now, even when the screen under test doesn't render a Toast. */
export const toastProbe: { current: string | null } = { current: null };

function DemoProbe() {
  const value = useDemo();
  const { message } = useToast();
  useEffect(() => {
    demoProbe.current = value;
    toastProbe.current = message;
  });
  return <Text testID="demo-probe" />;
}

/** Renders a screen inside the providers the root layout gives it, from a demo state override. */
export async function renderScreen(ui: ReactElement, state: Partial<DemoState> = {}): Promise<void> {
  demoProbe.current = null;
  toastProbe.current = null;
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <DemoProvider initialState={{ ...INITIAL_DEMO_STATE, ...state }}>
        <ToastProvider>
          <PackDownloadProvider>
            {ui}
            <DemoProbe />
          </PackDownloadProvider>
        </ToastProvider>
      </DemoProvider>
    </SafeAreaProvider>,
  );
}
