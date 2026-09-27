import * as ProgressPrimitive from '@rn-primitives/progress';
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
};

/**
 * React Native Reusables `Progress`, restyled to Denly's download bar: 6pt, tinted track, pink
 * fill. The fill eases (200ms linear, like the prototype) and jumps when Reduce Motion is on.
 * Give it an `aria-label` ("Download progress").
 */
function Progress({ className, value, indicatorClassName, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}
      value={value}
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} />
    </ProgressPrimitive.Root>
  );
}

function Indicator({ value, className }: { value: number | null | undefined; className?: string | undefined }) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    const percent = interpolate(progress.value, [0, 100], [0, 100], Extrapolation.CLAMP);
    return {
      width: withTiming(`${percent}%`, { duration: 200, reduceMotion: ReduceMotion.System }),
    };
  }, [value]);

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View style={indicator} className={cn('h-full rounded-full bg-primary', className)} />
    </ProgressPrimitive.Indicator>
  );
}

export { Progress };
export type { ProgressProps };
