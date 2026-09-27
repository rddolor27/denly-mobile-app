import { screen, userEvent } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { renderWithDemo } from '@/test-utils/render-with-demo';

import { SavedScreen } from './saved.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), navigate: jest.fn(), replace: jest.fn(), back: jest.fn(), setParams: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

const params = useLocalSearchParams as jest.Mock;

describe('SavedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    params.mockReturnValue({});
  });

  it('opens on saved dishes', async () => {
    await renderWithDemo(<SavedScreen />);

    expect(screen.getByText('Pinakbet')).toBeOnTheScreen();
    expect(screen.getByText('Adobong kangkong')).toBeOnTheScreen();
  });

  it('opens the segment named by the tab param, then clears the param', async () => {
    params.mockReturnValue({ tab: 'ingredients' });
    await renderWithDemo(<SavedScreen />);

    expect(screen.getByRole('button', { name: 'Kangkong, Water spinach, Leafy green' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Kalamansi, Calamansi, Citrus' })).toBeOnTheScreen();
    expect(router.setParams).toHaveBeenCalledWith({ tab: undefined });
  });

  it('opens an ingredient', async () => {
    const user = userEvent.setup();
    params.mockReturnValue({ tab: 'ingredients' });
    await renderWithDemo(<SavedScreen />);

    await user.press(screen.getByRole('button', { name: /^Kangkong/ }));

    expect(router.push).toHaveBeenCalledWith({ pathname: '/scan/ingredient/[id]', params: { id: 'kangkong' } });
  });

  it('shows the ingredient category even offline with no pack', async () => {
    params.mockReturnValue({ tab: 'ingredients' });
    await renderWithDemo(<SavedScreen />, { online: false, pack: 'none' });

    expect(screen.getByRole('button', { name: 'Kangkong, Water spinach, Leafy green' })).toBeOnTheScreen();
  });

  it('lists saved scans', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<SavedScreen />);

    await user.press(screen.getByLabelText('Scans'));

    expect(screen.getByRole('button', { name: /^Ampalaya, talong and 2 more/ })).toBeOnTheScreen();
  });

  it('shows an empty state with a way to scan', async () => {
    const user = userEvent.setup();
    await renderWithDemo(<SavedScreen />, { savedIngredientIds: [] });

    await user.press(screen.getByLabelText('Ingredients'));
    expect(screen.getByText('No saved ingredients yet.')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Scan ingredients' }));
    expect(router.push).toHaveBeenCalledWith('/scan/camera');
  });
});
