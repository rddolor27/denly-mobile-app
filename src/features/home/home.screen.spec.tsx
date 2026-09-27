import { screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import { GUEST_STATE, renderWithDemo } from '@/test-utils/render-with-demo';

import { HomeScreen } from './home.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), navigate: jest.fn(), replace: jest.fn(), back: jest.fn(), setParams: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

describe('HomeScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('greets the signed-in person and shows the counter card and the two latest scans', async () => {
    await renderWithDemo(<HomeScreen />);

    expect(screen.getByText('Rica')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeOnTheScreen();
    expect(screen.getByText("What's on your counter?")).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Kangkong, kamatis and 3 more/ })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Bangus, kalamansi and 2 more/ })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Ampalaya/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Medium offline data is ready/ })).toBeOnTheScreen();
    expect(screen.queryByText('Keep your scans on every device')).toBeNull();
  });

  it('opens the camera, a scan result and the full lists', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HomeScreen />);

    await user.press(screen.getByRole('button', { name: 'Scan ingredients' }));
    expect(router.push).toHaveBeenCalledWith('/scan/camera');

    await user.press(screen.getByRole('button', { name: /^Kangkong, kamatis and 3 more/ }));
    expect(router.push).toHaveBeenCalledWith({ pathname: '/scan/results/[scanId]', params: { scanId: 's1', from: 'home' } });

    await user.press(screen.getByRole('button', { name: 'See all: Saved dishes' }));
    expect(router.navigate).toHaveBeenCalledWith({ pathname: '/saved', params: { tab: 'dishes' } });
  });

  it('welcomes a guest with Log in and the create-account card', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HomeScreen />, GUEST_STATE);

    expect(screen.getByText('Welcome to Denly')).toBeOnTheScreen();
    expect(screen.getByText('Keep your scans on every device')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Log in' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/login');
    await user.press(screen.getByRole('button', { name: 'Create account' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/register');
  });

  it('says scans show names only when offline without offline data', async () => {
    await renderWithDemo(<HomeScreen />, { online: false, pack: 'none' });

    expect(
      screen.getByRole('button', { name: "You're offline with no offline data. Scans show names only." }),
    ).toBeOnTheScreen();
  });

  it('offers offline data when online without it', async () => {
    await renderWithDemo(<HomeScreen />, { pack: 'none' });

    expect(screen.getByRole('button', { name: /Scan without a connection/ })).toBeOnTheScreen();
  });

  it('unsaves a dish and confirms it', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<HomeScreen />);

    await user.press(screen.getByRole('button', { name: 'Remove Pinakbet from saved' }));

    expect(screen.queryByText('Pinakbet')).toBeNull();
    expect(screen.getByText('Removed from saved.')).toBeOnTheScreen();
  });

  it('shows the empty card when no dishes are saved', async () => {
    await renderWithDemo(<HomeScreen />, { savedDishIds: [] });

    expect(screen.getByText('Dishes you save from a scan show up here.')).toBeOnTheScreen();
  });
});
