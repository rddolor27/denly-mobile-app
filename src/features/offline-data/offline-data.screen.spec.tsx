import { act, screen, userEvent } from '@testing-library/react-native';

import { renderWithDemo } from '@/test-utils/render-with-demo';

import { OfflineDataScreen } from './offline-data.screen';
import { DOWNLOAD_TICK_MS, VERIFY_MS } from './use-simulated-download';

// The UI kit's sheets and progress bar animate with Reanimated, which needs its Jest mocks.
jest.mock('react-native-worklets', () => jest.requireActual('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

/** Ticks until progress reaches 100 (7% a tick). */
const FULL_DOWNLOAD_MS = DOWNLOAD_TICK_MS * 15;

describe('OfflineDataScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(async () => {
    await act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  it('marks the installed tier and offers no download for it', async () => {
    await renderWithDemo(<OfflineDataScreen />);

    expect(screen.getByText('Installed, data from 23 Sep 2026')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Download/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove offline data' })).toBeOnTheScreen();
  });

  it('downloads, checks and installs the chosen tier', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderWithDemo(<OfflineDataScreen />);

    await user.press(screen.getByRole('radio', { name: /^Large/ }));
    await user.press(screen.getByRole('button', { name: 'Download Large' }));
    expect(screen.getByText('Downloading Large…')).toBeOnTheScreen();
    expect(screen.getByText('Your Medium data stays in use until the new download is checked.')).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(FULL_DOWNLOAD_MS));
    expect(screen.getByText('Checking the download…')).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(VERIFY_MS));
    expect(screen.getByText('Large offline data installed.')).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: /^Large.*Installed, data from 23 Sep 2026$/ })).toBeOnTheScreen();
    expect(screen.queryByText('Checking the download…')).toBeNull();
  });

  it('cancels a download without changing anything', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderWithDemo(<OfflineDataScreen />);

    await user.press(screen.getByRole('radio', { name: /^Small/ }));
    await user.press(screen.getByRole('button', { name: 'Download Small' }));
    await act(() => jest.advanceTimersByTime(DOWNLOAD_TICK_MS * 3));
    await user.press(screen.getByRole('button', { name: 'Cancel download' }));

    expect(screen.getByText('Download cancelled. Nothing changed.')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(FULL_DOWNLOAD_MS + VERIFY_MS));
    expect(screen.getByRole('radio', { name: /^Medium.*Installed/ })).toBeOnTheScreen();
    expect(screen.queryByText('Small offline data installed.')).toBeNull();
  });

  it('cannot download while offline', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderWithDemo(<OfflineDataScreen />, { online: false });

    await user.press(screen.getByRole('radio', { name: /^Large/ }));

    expect(screen.getByText("You're offline.")).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Download Large' })).toBeNull();
  });

  it('removes offline data', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderWithDemo(<OfflineDataScreen />);

    await user.press(screen.getByRole('button', { name: 'Remove offline data' }));

    expect(screen.getByText('Offline data removed.')).toBeOnTheScreen();
    expect(screen.queryByText(/^Installed/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Download Medium' })).toBeOnTheScreen();
  });
});
