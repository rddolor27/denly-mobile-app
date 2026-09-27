import { Camera } from 'lucide-react-native';
import { View, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

/**
 * Produce shapes on the counter (kangkong leaves, tomato, onion, chili): presentation-only
 * colours, fixed in both modes like the card itself.
 */
const SHAPES: readonly ViewStyle[] = [
  { right: -10, top: 14, width: 150, height: 40, backgroundColor: '#3F5A2E', transform: [{ rotate: '-16deg' }] },
  { right: 18, top: 44, width: 132, height: 34, backgroundColor: '#4A6A35', transform: [{ rotate: '6deg' }] },
  { right: 128, top: 26, width: 54, height: 54, backgroundColor: '#8A3A2C' },
  { right: 74, top: 92, width: 48, height: 50, backgroundColor: '#A58D63' },
  {
    right: 6,
    top: 108,
    width: 84,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#5E7A33',
    transform: [{ rotate: '-10deg' }],
  },
];

export type HeroCounterCardProps = {
  onScan: () => void;
  /** Default "What's on your counter?". */
  title?: string;
};

/** Home's black hero card: produce shapes, the question, and the Scan button. */
export function HeroCounterCard({ onScan, title = "What's on your counter?" }: HeroCounterCardProps) {
  return (
    <View className="min-h-[208px] justify-end gap-3.5 overflow-hidden rounded-hero bg-hero p-5">
      <View
        className="absolute inset-0"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        {SHAPES.map((shape, index) => (
          <View key={index} className="absolute rounded-full" style={shape} />
        ))}
      </View>
      <Text role="heading" className="max-w-[62%] font-display text-[28px] leading-[30px] text-hero-foreground">
        {title}
      </Text>
      <Button className="h-12 self-start px-[22px]" onPress={onScan} accessibilityLabel="Scan ingredients">
        <Icon as={Camera} size={20} />
        <Text>Scan ingredients</Text>
      </Button>
    </View>
  );
}
