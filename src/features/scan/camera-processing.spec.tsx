import { act, screen, userEvent } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

import { demoProbe, renderScreen } from '@/test/render-screen';

import { CameraScreen, SCAN_CANCELLED_MESSAGE } from './camera.screen';
import { ProcessingScreen } from './processing.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn(),
}));

async function advance(ms: number): Promise<void> {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.mocked(useLocalSearchParams).mockReturnValue({});
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CameraScreen', () => {
  it('looks for food, then shows the live detections in the chosen language', async () => {
    await renderScreen(<CameraScreen />, { nameLanguage: 'en' });

    expect(screen.getByText('Looking for food…')).toBeOnTheScreen();
    expect(screen.queryByText('Water spinach', { includeHiddenElements: true })).toBeNull();

    await advance(450);

    expect(screen.getByText('4 items in view')).toBeOnTheScreen();
    expect(screen.getByText('Water spinach', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Long chili?', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('toggles the torch and says what the button will do', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen(<CameraScreen />);

    await user.press(screen.getByRole('button', { name: 'Turn on torch' }));

    expect(screen.getByRole('button', { name: 'Turn off torch' })).toBeSelected();
  });

  it('shows the offline banner when offline', async () => {
    await renderScreen(<CameraScreen />, { online: false, pack: 'none' });

    expect(screen.getByText('Offline. Only ingredient names will show.')).toBeOnTheScreen();
  });

  it('captures, then opens processing', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen(<CameraScreen />);

    await user.press(screen.getByRole('button', { name: 'Take photo and scan' }));
    await advance(200);

    expect(router.replace).toHaveBeenCalledWith('/scan/processing');
  });

  it('confirms a cancelled scan', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ notice: 'cancelled' });
    await renderScreen(<CameraScreen />);

    expect(screen.getByText(SCAN_CANCELLED_MESSAGE)).toBeOnTheScreen();
    await advance(3000);
    expect(screen.queryByText(SCAN_CANCELLED_MESSAGE)).toBeNull();
  });

  it('shows "Camera access is off" with a way to Settings and to import', async () => {
    const openSettings = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined);
    jest.mocked(useLocalSearchParams).mockReturnValue({ state: 'denied' });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen(<CameraScreen />);

    expect(screen.getByRole('heading', { name: 'Camera access is off.' })).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Open Settings' }));
    expect(openSettings).toHaveBeenCalled();
    await user.press(screen.getByRole('button', { name: 'Import photo' }));
    expect(router.replace).toHaveBeenCalledWith('/scan/processing');
  });
});

describe('ProcessingScreen', () => {
  it('runs the online stages, adds the scan and opens its results', async () => {
    await renderScreen(<ProcessingScreen />);

    expect(screen.getByLabelText('Detecting ingredients, in progress')).toBeOnTheScreen();
    expect(screen.getByLabelText('Writing your summary, waiting')).toBeOnTheScreen();

    await advance(1000);
    expect(screen.getByLabelText('Detecting ingredients, done')).toBeOnTheScreen();
    expect(screen.getByLabelText('Checking what they are, in progress')).toBeOnTheScreen();

    await advance(900);
    await advance(900);

    const newest = demoProbe.current?.history[0];
    expect(demoProbe.current?.history).toHaveLength(4);
    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/scan/results/[scanId]',
      params: { scanId: newest?.id },
    });
  });

  it('detects only when offline without data', async () => {
    await renderScreen(<ProcessingScreen />, { online: false, pack: 'none' });

    expect(screen.queryByLabelText(/Checking/)).toBeNull();
    await advance(1000);

    expect(demoProbe.current?.history[0]).toMatchObject({ offline: true, summary: null });
    expect(router.replace).toHaveBeenCalledTimes(1);
  });

  it('shows "Nothing recognised" when the scan finds nothing', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen(<ProcessingScreen />, { nextOutcome: 'empty' });

    await advance(1000);

    expect(screen.getByRole('heading', { name: 'Nothing recognised.' })).toBeOnTheScreen();
    expect(screen.getByText('Move closer so the food fills the frame')).toBeOnTheScreen();
    expect(demoProbe.current?.history).toHaveLength(3);
    await user.press(screen.getByRole('button', { name: 'Rescan' }));
    expect(router.replace).toHaveBeenCalledWith('/scan/camera');
  });

  it('says it is still working on a slow scan', async () => {
    await renderScreen(<ProcessingScreen />, { nextOutcome: 'slow' });

    await advance(1000);
    expect(screen.queryByText('Still working… This is taking longer than usual.')).toBeNull();
    await advance(1800);

    expect(screen.getByText('Still working… This is taking longer than usual.')).toBeOnTheScreen();
  });

  it('cancels back to the camera and stops the run', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen(<ProcessingScreen />);

    await user.press(screen.getByRole('button', { name: 'Cancel scan' }));

    expect(router.replace).toHaveBeenCalledWith({ pathname: '/scan/camera', params: { notice: 'cancelled' } });
    expect(screen.getByText('Your photo stays on this phone. Only the ingredient names are sent.')).toBeOnTheScreen();
  });
});
