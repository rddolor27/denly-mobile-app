import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

export type BottomActionBarProps = {
  /** One primary action (and at most a text button under it). */
  children: ReactNode;
  className?: string;
};

/** Actions pinned above the home indicator / navigation bar, with a hairline on top. */
export function BottomActionBar({ children, className }: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('gap-1.5 border-t border-border bg-background px-4 pt-3', className)}
      style={{ paddingBottom: Math.max(insets.bottom, 12) + 4 }}
    >
      {children}
    </View>
  );
}
