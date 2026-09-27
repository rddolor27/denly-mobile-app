import { render, screen, userEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabBar } from './TabBar';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderBar(ui: ReactElement): Promise<void> {
  await render(<SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>{ui}</SafeAreaProvider>);
}

describe('TabBar', () => {
  it('labels every tab and marks only the active one selected', async () => {
    await renderBar(<TabBar activeTab="history" onTabPress={jest.fn()} onScanPress={jest.fn()} />);

    for (const name of ['Home', 'History', 'Saved', 'Profile']) {
      expect(screen.getByRole('tab', { name })).toBeOnTheScreen();
    }
    expect(screen.getByRole('tab', { name: 'History', selected: true })).toBeOnTheScreen();
    expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1);
  });

  it('shows Scan as a button, not a tab, and opens the camera', async () => {
    const onScanPress = jest.fn();
    const onTabPress = jest.fn();
    const user = userEvent.setup();
    await renderBar(<TabBar activeTab="index" onTabPress={onTabPress} onScanPress={onScanPress} />);

    expect(screen.queryByRole('tab', { name: 'Scan' })).toBeNull();
    await user.press(screen.getByRole('button', { name: 'Scan' }));

    expect(onScanPress).toHaveBeenCalledTimes(1);
    expect(onTabPress).not.toHaveBeenCalled();
  });

  it('reports the pressed tab', async () => {
    const onTabPress = jest.fn();
    const user = userEvent.setup();
    await renderBar(<TabBar activeTab="index" onTabPress={onTabPress} onScanPress={jest.fn()} />);

    await user.press(screen.getByRole('tab', { name: 'Saved' }));

    expect(onTabPress).toHaveBeenCalledWith('saved');
  });
});
