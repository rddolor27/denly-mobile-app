import { View } from 'react-native';

import { Text } from '@/components/ui/text';

import { ProduceTile } from './ProduceTile';

export type TileStackItem = { key: string; abbreviation: string; color: string };

export type TileStackProps = {
  tiles: readonly TileStackItem[];
  /** Tiles shown before "+N" (default 3). */
  max?: number;
};

/** Overlapping small produce tiles for a scan row: up to `max`, then a "+N" tile. Decorative. */
export function TileStack({ tiles, max = 3 }: TileStackProps) {
  const shown = tiles.slice(0, max);
  const more = tiles.length - shown.length;
  return (
    <View
      className="shrink-0 flex-row"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {shown.map((tile, index) => (
        <View key={tile.key} className={index === 0 ? 'rounded-[10px] border-2 border-card' : '-ml-2 rounded-[10px] border-2 border-card'}>
          <ProduceTile abbreviation={tile.abbreviation} color={tile.color} size="sm" />
        </View>
      ))}
      {more > 0 ? (
        <View className="-ml-2 rounded-[10px] border-2 border-card">
          <View className="size-[30px] items-center justify-center rounded-sm bg-muted">
            <Text className="font-display text-caption text-muted-foreground">+{more}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
