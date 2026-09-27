import { render, screen, userEvent } from '@testing-library/react-native';

import { DishRow } from './DishRow';

describe('DishRow', () => {
  it('names the save toggle by what it will do and reports its state', async () => {
    const onToggleSave = jest.fn();
    const user = userEvent.setup();
    await render(<DishRow name="Pinakbet" need="Add squash, okra and bagoong" saved={false} onToggleSave={onToggleSave} />);

    const toggle = screen.getByRole('button', { name: 'Save Pinakbet' });
    expect(toggle).not.toBeSelected();
    await user.press(toggle);
    expect(onToggleSave).toHaveBeenCalledTimes(1);
  });

  it('offers to remove a saved dish', async () => {
    await render(<DishRow name="Pinakbet" need="Add squash, okra and bagoong" saved onToggleSave={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Remove Pinakbet from saved' })).toBeSelected();
  });

  it('has no toggle without a save handler', async () => {
    await render(<DishRow name="Pinakbet" need="Add squash, okra and bagoong" />);

    expect(screen.getByLabelText('Pinakbet, Add squash, okra and bagoong')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
