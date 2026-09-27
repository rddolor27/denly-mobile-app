import { screen, userEvent, within } from '@testing-library/react-native';
import { router } from 'expo-router';

import { GUEST_STATE, renderWithDemo } from '@/test-utils/render-with-demo';

import { ProfileScreen } from './profile.screen';

// The UI kit's sheets and progress bar animate with Reanimated, which needs its Jest mocks.
jest.mock('react-native-worklets', () => jest.requireActual('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), navigate: jest.fn(), replace: jest.fn(), back: jest.fn(), setParams: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

const mockSetPreference = jest.fn();
jest.mock('@/lib/use-appearance', () => ({
  useAppearance: () => ({ preference: 'system', colorScheme: 'light', setPreference: mockSetPreference }),
}));

describe('ProfileScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the account and the offline data tier', async () => {
    await renderWithDemo(<ProfileScreen />);

    expect(screen.getByText('Rica Dela Cruz')).toBeOnTheScreen();
    expect(screen.getByText('rica.delacruz@example.com')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Offline data, Medium' })).toBeOnTheScreen();
    expect(screen.getByText('Denly 0.1.0 prototype')).toBeOnTheScreen();
  });

  it('changes the appearance', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);

    await user.press(screen.getByLabelText('Dark'));

    expect(mockSetPreference).toHaveBeenCalledWith('dark');
  });

  it('switches ingredient names and updates the example', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);
    expect(screen.getByText('Example: Kangkong, bawang, sibuyas')).toBeOnTheScreen();

    await user.press(screen.getByLabelText('English'));

    expect(screen.getByText('Example: Water spinach, garlic, onion')).toBeOnTheScreen();
  });

  it('logs out to the guest card', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);

    await user.press(screen.getByRole('button', { name: 'Log out' }));

    expect(screen.getByText("You're using Denly without an account")).toBeOnTheScreen();
    expect(screen.getByText('Logged out. Scans on this phone stay here.')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Delete account' })).toBeNull();
  });

  it('deletes the account after confirmation and goes to Welcome', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);

    await user.press(screen.getByRole('button', { name: 'Delete account' }));
    const title = await screen.findByText('Delete your account?');
    expect(title).toBeOnTheScreen();

    const buttons = screen.getAllByRole('button', { name: 'Delete account' });
    const confirm = buttons[buttons.length - 1];
    if (!confirm) throw new Error('No confirm button');
    await user.press(confirm);

    expect(router.replace).toHaveBeenCalledWith('/(auth)/welcome');
    expect(screen.queryByText('Rica Dela Cruz')).toBeNull();
  });

  it('keeps the account when the deletion is cancelled', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);

    await user.press(screen.getByRole('button', { name: 'Delete account' }));
    await user.press(await screen.findByRole('button', { name: 'Cancel' }));

    expect(router.replace).not.toHaveBeenCalled();
    expect(screen.getByText('Rica Dela Cruz')).toBeOnTheScreen();
  });

  it('offers a guest to create an account or log in', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />, GUEST_STATE);

    await user.press(screen.getByRole('button', { name: 'Create account' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/register');
    await user.press(screen.getByRole('button', { name: 'Log in' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/login');
  });

  it('drives the demo state from the demo controls', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<ProfileScreen />);

    const packs = screen.getByLabelText('Offline data on the phone');
    await user.press(within(packs).getByLabelText('None'));
    expect(screen.getByRole('button', { name: 'Offline data, Not downloaded' })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Camera off screen' }));
    expect(router.push).toHaveBeenCalledWith({ pathname: '/scan/camera', params: { state: 'denied' } });
    await user.press(screen.getByRole('button', { name: 'Design kit' }));
    expect(router.push).toHaveBeenCalledWith('/design');
  });
});
