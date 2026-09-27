import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

export type ScreenEdge = 'top' | 'bottom';

export type ScreenProps = {
  children: ReactNode;
  /** Scrolls by default; `false` for full-height layouts (welcome, processing). */
  scroll?: boolean;
  /**
   * Safe-area edges to pad. Tab screens use the default `['top']` (the tab bar pads the
   * bottom); stack screens without a BottomActionBar pass `['top', 'bottom']`.
   */
  edges?: readonly ScreenEdge[];
  /** Pinned under the content, e.g. a `BottomActionBar` (pads the bottom itself). */
  footer?: ReactNode;
  /** Classes for the content column (default: 16pt gutter, 22pt gap). */
  contentClassName?: string;
};

/** The screen shell: page background, safe areas, 16pt gutter, vertical rhythm. */
export function Screen({ children, scroll = true, edges = ['top'], footer, contentClassName }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  };
  const content = cn('gap-[22px] px-4 pb-6 pt-1', contentClassName);
  return (
    <View className="flex-1 bg-background" style={padding}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn('grow', content)}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn('flex-1', content)}>{children}</View>
      )}
      {footer}
    </View>
  );
}
