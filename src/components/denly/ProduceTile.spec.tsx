import { render, screen } from '@testing-library/react-native';

import { INGREDIENTS } from '@/features/demo/demo-data';
import { contrastRatio } from '@/lib/color';
import { THEME } from '@/lib/theme';

import { ProduceTile } from './ProduceTile';

describe('ProduceTile', () => {
  it.each(Object.values(INGREDIENTS).map((i) => [i.id, i.tileColor] as const))(
    'white tile text on %s (%s) is at least 4.5:1',
    (_id, color) => {
      expect(contrastRatio(THEME.light.heroForeground, color)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('is hidden from screen readers (the name next to it is read instead)', async () => {
    await render(<ProduceTile abbreviation="Ka" color="#3F6B2E" />);

    expect(screen.queryByText('Ka')).toBeNull();
    expect(screen.getByText('Ka', { includeHiddenElements: true })).toBeOnTheScreen();
  });
});
