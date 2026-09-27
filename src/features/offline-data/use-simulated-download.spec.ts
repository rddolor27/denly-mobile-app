import { act, renderHook } from '@testing-library/react-native';

import { DOWNLOAD_TICK_MS, useSimulatedDownload, VERIFY_MS } from './use-simulated-download';

const FULL_MS = DOWNLOAD_TICK_MS * 15 + VERIFY_MS;

describe('useSimulatedDownload', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('reaches 100, verifies, then installs once', async () => {
    const onInstalled = jest.fn();
    const { result } = await renderHook(() => useSimulatedDownload(onInstalled));

    await act(() => result.current.start('small'));
    expect(result.current.download).toEqual({ tier: 'small', progress: 0, phase: 'download' });

    await act(() => jest.advanceTimersByTime(DOWNLOAD_TICK_MS * 15));
    expect(result.current.download).toEqual({ tier: 'small', progress: 100, phase: 'verify' });
    expect(onInstalled).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(VERIFY_MS));
    expect(result.current.download).toBeNull();
    expect(onInstalled).toHaveBeenCalledTimes(1);
    expect(onInstalled).toHaveBeenCalledWith('small');
  });

  it('installs nothing after cancel', async () => {
    const onInstalled = jest.fn();
    const { result } = await renderHook(() => useSimulatedDownload(onInstalled));

    await act(() => result.current.start('large'));
    await act(() => result.current.cancel());
    await act(() => jest.advanceTimersByTime(FULL_MS));

    expect(result.current.download).toBeNull();
    expect(onInstalled).not.toHaveBeenCalled();
  });

  it('clears its timers on unmount', async () => {
    const onInstalled = jest.fn();
    const { result, unmount } = await renderHook(() => useSimulatedDownload(onInstalled));

    await act(() => result.current.start('medium'));
    await act(() => unmount());

    jest.advanceTimersByTime(FULL_MS);
    expect(onInstalled).not.toHaveBeenCalled();
  });
});
