import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ProduceTileSize = 'sm' | 'md' | 'lg';

export type ProduceTileProps = {
  /** Two letters, e.g. "Ka" for kangkong. */
  abbreviation: string;
  /** The produce colour (presentation map keyed by ingredient, not a theme token). */
  color: string;
  size?: ProduceTileSize;
  className?: string;
};

const SIZE: Readonly<Record<ProduceTileSize, { box: string; text: string }>> = {
  sm: { box: 'size-[30px] rounded-sm', text: 'text-caption' },
  md: { box: 'size-10 rounded-tile', text: 'text-[14px] leading-[18px]' },
  lg: { box: 'size-16 rounded-sheet', text: 'text-[22px] leading-[26px]' },
};

/**
 * Denly's signature: one coloured square per ingredient with its two-letter abbreviation.
 * Decorative — the ingredient name next to it is what screen readers read.
 */
export function ProduceTile({ abbreviation, color, size = 'md', className }: ProduceTileProps) {
  const s = SIZE[size];
  return (
    <View
      className={cn('shrink-0 items-center justify-center', s.box, className)}
      style={{ backgroundColor: color }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Tile text is white on every produce colour (checked in ProduceTile.spec). */}
      <Text className={cn('font-display text-hero-foreground', s.text)}>{abbreviation}</Text>
    </View>
  );
}
