import { PortalHost } from '@rn-primitives/portal';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DemoProvider } from '@/features/demo/demo-provider';
import { INITIAL_DEMO_STATE, type DemoState } from '@/features/demo/demo-state';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** A signed-in demo state (the prototype's default account). */
export const SIGNED_IN_STATE: DemoState = {
  ...INITIAL_DEMO_STATE,
  session: { kind: 'user', name: 'Rica Dela Cruz', email: 'rica.delacruz@example.com' },
};

export const GUEST_STATE: DemoState = { ...INITIAL_DEMO_STATE, session: { kind: 'guest' } };

/**
 * Renders a screen the way the root layout mounts it: safe areas, the demo state (signed in
 * unless `state` says otherwise) and a portal host for sheets.
 */
export async function renderWithDemo(ui: ReactElement, state: Partial<DemoState> = {}): Promise<void> {
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <DemoProvider initialState={{ ...SIGNED_IN_STATE, ...state }}>
        {ui}
        <PortalHost />
      </DemoProvider>
    </SafeAreaProvider>,
  );
}
