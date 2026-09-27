import { render, screen } from '@testing-library/react-native';

import { CONFIDENCE_BANDS, ConfidenceLabel, type ConfidenceBand } from './ConfidenceLabel';

const BANDS: readonly [ConfidenceBand, string][] = [
  ['detected', 'Detected'],
  ['likely', 'Likely'],
  ['uncertain', 'Uncertain'],
  ['unknown', "Couldn't identify"],
];

describe('ConfidenceLabel', () => {
  describe.each(['inline', 'pill', 'header'] as const)('%s variant', (variant) => {
    it.each(BANDS)('shows the %s word and its icon', async (band, word) => {
      await render(<ConfidenceLabel band={band} variant={variant} />);

      expect(screen.getByText(word)).toBeOnTheScreen();
      expect(screen.getByTestId(`confidence-icon-${band}`, { includeHiddenElements: true })).toBeOnTheScreen();
      expect(screen.getByLabelText(word)).toBeOnTheScreen();
    });
  });

  it('gives every band its own icon', () => {
    const icons = new Set(Object.values(CONFIDENCE_BANDS).map((b) => b.icon));
    expect(icons.size).toBe(Object.keys(CONFIDENCE_BANDS).length);
  });

  it('reads a suffix and a header count', async () => {
    await render(
      <>
        <ConfidenceLabel band="detected" variant="pill" suffix="in this scan" />
        <ConfidenceLabel band="likely" variant="header" count={2} />
      </>,
    );

    expect(screen.getByLabelText('Detected in this scan')).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Likely, 2' })).toBeOnTheScreen();
  });
});
