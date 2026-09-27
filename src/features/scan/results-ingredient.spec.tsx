import { screen, userEvent } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { INITIAL_HISTORY, kitchenScan } from '@/features/demo/demo-data';
import { demoProbe, renderScreen } from '@/test/render-screen';

import { IngredientScreen } from './ingredient.screen';
import { ResultsScreen } from './results.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn(),
}));

function params(value: Record<string, string>): void {
  jest.mocked(useLocalSearchParams).mockReturnValue(value);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ResultsScreen', () => {
  it('shows the title, bands with counts and the AI summary', async () => {
    params({ scanId: 's1' });
    await renderScreen(<ResultsScreen />);

    expect(screen.getByRole('heading', { name: '5 ingredients found' })).toBeOnTheScreen();
    expect(screen.getByText('3 detected, 1 likely, 1 uncertain. Today, 7:42 AM.')).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Detected, 3' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Likely, 1' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Uncertain, 1' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'AI summary' })).toBeOnTheScreen();
    expect(screen.getByText('Written by AI from the ingredients above. It can be wrong.')).toBeOnTheScreen();
    expect(screen.getByText("Couldn't identify 1 item")).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back to Home' })).toBeOnTheScreen();
  });

  it('keeps the uncertain item collapsed until asked', async () => {
    params({ scanId: 's1' });
    const user = userEvent.setup();
    await renderScreen(<ResultsScreen />);

    const show = screen.getByRole('button', { name: 'Show 1 uncertain item' });
    expect(show).not.toBeExpanded();
    expect(screen.queryByText('Siling haba')).toBeNull();

    await user.press(show);

    expect(screen.getByText('Siling haba')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Hide uncertain item' })).toBeExpanded();
  });

  it('opens an ingredient with the scan id and rescans from the bottom bar', async () => {
    params({ scanId: 's1' });
    const user = userEvent.setup();
    await renderScreen(<ResultsScreen />);

    await user.press(screen.getByRole('button', { name: 'Kangkong, Water spinach, Leafy green' }));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/scan/ingredient/[id]',
      params: { id: 'kangkong', scanId: 's1' },
    });

    await user.press(screen.getByRole('button', { name: 'Rescan' }));
    expect(router.replace).toHaveBeenCalledWith('/scan/camera');
  });

  it('saves the scan and a dish', async () => {
    params({ scanId: 's1' });
    const user = userEvent.setup();
    await renderScreen(<ResultsScreen />);

    await user.press(screen.getByRole('button', { name: 'Save scan' }));
    expect(screen.getByRole('button', { name: 'Remove scan from saved' })).toBeSelected();
    expect(demoProbe.current?.savedScanIds).toContain('s1');

    await user.press(screen.getByRole('button', { name: 'Save Sinigang na baboy' }));
    expect(demoProbe.current?.savedDishIds).toContain('sinigang_baboy');
  });

  it('offers Try again when the summary failed', async () => {
    params({ scanId: 'f1' });
    const failed = { ...kitchenScan('f1', 'Just now', false), summary: null, summaryFailed: true };
    const user = userEvent.setup();
    await renderScreen(<ResultsScreen />, { history: [failed, ...INITIAL_HISTORY] });

    expect(screen.getByText('Summary unavailable right now.')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByText('Written by AI from the ingredients above. It can be wrong.')).toBeOnTheScreen();
  });

  it('offers Get AI summary for an offline result once online', async () => {
    params({ scanId: 's2', from: 'history' });
    const user = userEvent.setup();
    await renderScreen(<ResultsScreen />);

    expect(screen.getByText('Offline result, data from 23 Sep 2026')).toBeOnTheScreen();
    expect(screen.getByText('AI summary needs a connection.')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back to History' })).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Get AI summary' }));

    expect(screen.getByText('Written by AI from the ingredients above. It can be wrong.')).toBeOnTheScreen();
  });

  it('shows names only when offline without data', async () => {
    params({ scanId: 's2' });
    await renderScreen(<ResultsScreen />, { online: false, pack: 'none' });

    expect(screen.getByText("You're offline with no offline data, so only names are shown.")).toBeOnTheScreen();
    expect(screen.getByLabelText('Bangus')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /Bangus/ })).toBeNull();
    expect(screen.queryByText('Milkfish')).toBeNull();
    expect(screen.getByRole('heading', { name: 'See details offline' })).toBeOnTheScreen();
    expect(screen.queryByText('You could cook')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Get AI summary' })).toBeNull();
  });

  it('says so when the scan does not exist', async () => {
    params({ scanId: 'missing' });
    await renderScreen(<ResultsScreen />);

    expect(screen.getByRole('heading', { name: "This scan isn't here anymore." })).toBeOnTheScreen();
  });
});

describe('IngredientScreen', () => {
  it('shows names, the band in this scan, details and the online source', async () => {
    params({ id: 'kangkong', scanId: 's1' });
    await renderScreen(<IngredientScreen />);

    expect(screen.getByRole('heading', { name: 'Kangkong' })).toBeOnTheScreen();
    expect(screen.getAllByText('Water spinach')).toHaveLength(2); // alternate name + English row
    expect(screen.getByLabelText('Detected in this scan')).toBeOnTheScreen();
    expect(screen.getByLabelText('Bisaya, Tangkong')).toBeOnTheScreen();
    expect(screen.getByLabelText('Cooked in, Sinigang, adobong kangkong, ginisang kangkong')).toBeOnTheScreen();
    expect(screen.getByText(/Cook the stems a minute or two/)).toBeOnTheScreen();
    expect(screen.getByText("From Denly's ingredient data, updated 23 Sep 2026")).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Remove from saved' })).toBeSelected();
  });

  it('flags an uncertain ingredient', async () => {
    params({ id: 'chili', scanId: 's1' });
    await renderScreen(<IngredientScreen />);

    expect(screen.getByLabelText('Uncertain in this scan')).toBeOnTheScreen();
    expect(screen.getByText('Uncertain. Rescan closer to confirm it.')).toBeOnTheScreen();
  });

  it('shows less detail with the Small offline data', async () => {
    params({ id: 'garlic' });
    const user = userEvent.setup();
    await renderScreen(<IngredientScreen />, { online: false, pack: 'small' });

    expect(screen.queryByText(/in this scan/)).toBeNull();
    expect(screen.queryByLabelText(/Cooked in/)).toBeNull();
    expect(
      screen.getByText("More detail comes with Medium or Large offline data, or when you're online."),
    ).toBeOnTheScreen();
    expect(screen.getByText('From your Small offline data, 23 Sep 2026')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Save ingredient' }));
    expect(demoProbe.current?.savedIngredientIds).toContain('garlic');
  });

  it('handles an unknown ingredient id', async () => {
    params({ id: 'durian' });
    await renderScreen(<IngredientScreen />);

    expect(screen.getByRole('heading', { name: "We don't have this ingredient." })).toBeOnTheScreen();
  });
});
