import { CategoryBadge } from './CategoryBadge';
import { ListRow } from './ListGroup';
import { ProduceTile } from './ProduceTile';

export type IngredientRowProps = {
  /** Name in the user's chosen language. */
  name: string;
  /** The other name under it (English, or Filipino when English is chosen). */
  alternateName?: string;
  abbreviation: string;
  tileColor: string;
  /** Shown as a coloured badge when present (online or with an offline pack). */
  category?: string;
  /** Opens the ingredient detail. Omit for "names only" results (offline without a pack). */
  onPress?: () => void;
};

/** A results / saved ingredient row: produce tile, names, category badge, chevron. */
export function IngredientRow({ name, alternateName, abbreviation, tileColor, category, onPress }: IngredientRowProps) {
  return (
    <ListRow
      title={name}
      {...(alternateName ? { subtitle: alternateName } : {})}
      leading={<ProduceTile abbreviation={abbreviation} color={tileColor} />}
      trailing={category ? <CategoryBadge category={category} /> : undefined}
      accessibilityLabel={[name, alternateName, category].filter(Boolean).join(', ')}
      {...(onPress ? { onPress, accessibilityHint: 'Opens ingredient details' } : {})}
    />
  );
}
