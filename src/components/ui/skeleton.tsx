import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

/**
 * React Native Reusables `Skeleton`: a placeholder block that mirrors the geometry of what is
 * loading. Decorative (hidden from screen readers) — the loading container carries
 * `accessibilityState={{ busy: true }}` and a label. No pulse when Reduce Motion is on.
 */
function Skeleton({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const reduceMotion = useReducedMotion();
  return (
    <View
      className={cn('rounded-lg bg-accent', !reduceMotion && 'animate-pulse', className)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  );
}

export { Skeleton };
