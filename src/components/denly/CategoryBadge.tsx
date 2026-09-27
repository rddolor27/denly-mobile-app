import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Category colours are Denly's "extra colours" (plan 0003 §2): leafy greens and citrus teal,
 * fish blue, vegetables the warm dish orange. Other categories (Aromatic, …) stay neutral.
 * Confidence colours (green/amber) are never used here.
 */
const CATEGORY_STYLE: Readonly<Record<string, { box: string; text: string }>> = {
  'Leafy green': { box: 'bg-leafy-soft', text: 'text-leafy' },
  Citrus: { box: 'bg-leafy-soft', text: 'text-leafy' },
  Fish: { box: 'bg-fish-soft', text: 'text-fish' },
  Vegetable: { box: 'bg-dish-soft', text: 'text-dish' },
};

const NEUTRAL = { box: 'bg-muted', text: 'text-muted-foreground' };

export type CategoryBadgeProps = {
  category: string;
  className?: string;
};

/** A category chip ("Leafy green", "Fish") in its category colour; the word is always shown. */
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const style = CATEGORY_STYLE[category] ?? NEUTRAL;
  return (
    <View className={cn('shrink-0 self-center rounded-sm px-2 py-[3px]', style.box, className)}>
      <Text className={cn('text-footnote font-semibold', style.text)} numberOfLines={1}>
        {category}
      </Text>
    </View>
  );
}
