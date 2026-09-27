import { DishRow } from '@/components/denly/DishRow';
import type { DishId } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { getDish } from '@/features/demo/demo-state';

type Props = {
  dishId: DishId;
  /** Where the screen shows its toast ("Pinakbet saved.", "Removed from saved."). */
  onMessage: (message: string) => void;
};

/**
 * A `DishRow` wired to the demo state: the bookmark toggles the saved dish. Recipes are not in
 * the data yet, so opening a dish says so (the prototype's toast).
 */
export function SavedDishRow({ dishId, onMessage }: Props) {
  const { savedDishIds, toggleSaveDish } = useDemo();
  const dish = getDish(dishId);
  const saved = savedDishIds.includes(dishId);
  return (
    <DishRow
      name={dish.name}
      need={dish.need}
      saved={saved}
      onToggleSave={() => {
        toggleSaveDish(dishId);
        onMessage(saved ? 'Removed from saved.' : `${dish.name} saved.`);
      }}
      onPress={() => onMessage(`${dish.name} recipes arrive with the recipe data.`)}
    />
  );
}
