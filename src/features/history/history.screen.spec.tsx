import { screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import { GUEST_STATE, renderWithDemo } from '@/test-utils/render-with-demo';

import { HistoryScreen } from './history.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), navigate: jest.fn(), replace: jest.fn(), back: jest.fn(), setParams: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

describe('HistoryScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('groups every scan by day and says it is synced', async () => {
    await renderWithDemo(<HistoryScreen />);

    expect(screen.getByText('Synced to your account.')).toBeOnTheScreen();
    for (const day of ['Today', 'Yesterday', 'Earlier this week']) {
      expect(screen.getByRole('heading', { name: day })).toBeOnTheScreen();
    }
    expect(screen.getByRole('button', { name: /^Bangus, kalamansi and 2 more, Yesterday, 6:10 PM · offline result/ })).toBeOnTheScreen();
  });

  it('filters to saved scans (s3 only)', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HistoryScreen />);

    await user.press(screen.getByLabelText('Saved'));

    expect(screen.getByRole('button', { name: /^Ampalaya, talong and 2 more.*Saved$/ })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Kangkong/ })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Today' })).toBeNull();
  });

  it('shows the empty state when nothing is saved', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HistoryScreen />, { savedScanIds: [] });

    await user.press(screen.getByLabelText('Saved'));

    expect(screen.getByText('No saved scans yet.')).toBeOnTheScreen();
  });

  it('tells a guest the history stays on the phone', async () => {
    await renderWithDemo(<HistoryScreen />, GUEST_STATE);

    expect(screen.getByText('Stored on this phone only. Log in to keep it on every device.')).toBeOnTheScreen();
  });

  it('opens a scan result', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HistoryScreen />);

    await user.press(screen.getByRole('button', { name: /^Ampalaya/ }));

    expect(router.push).toHaveBeenCalledWith({ pathname: '/scan/results/[scanId]', params: { scanId: 's3', from: 'history' } });
  });
});
