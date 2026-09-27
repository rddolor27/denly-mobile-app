import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ScreenHeaderProps = {
  /** Back button: a chevron and where it goes ("Home", "Back"). */
  back?: { label: string; onPress: () => void };
  /** Right side: an icon button (save), "Cancel", … */
  right?: ReactNode;
  className?: string;
};

/** The 44pt navigation row at the top of a screen (Denly draws its own; native headers are off). */
export function ScreenHeader({ back, right, className }: ScreenHeaderProps) {
  return (
    <View className={cn('min-h-11 flex-row items-center justify-between gap-2', className)}>
      {back ? (
        <Pressable
          className="h-11 flex-row items-center gap-0.5 pr-2 active:opacity-60"
          onPress={back.onPress}
          accessibilityRole="button"
          accessibilityLabel={back.label === 'Back' ? 'Back' : `Back to ${back.label}`}
          hitSlop={{ left: 8 }}
        >
          <Icon as={ChevronLeft} size={22} className="text-primary" />
          <Text className="text-primary">{back.label}</Text>
        </Pressable>
      ) : (
        <View />
      )}
      {right}
    </View>
  );
}

export type LargeTitleProps = {
  children: string;
  /** One line under the title in muted text. */
  subtitle?: string;
  className?: string;
};

/** The screen title (34pt display face) with an optional subtitle. The screen's first heading. */
export function LargeTitle({ children, subtitle, className }: LargeTitleProps) {
  return (
    <View className={cn('gap-2 pt-2', className)}>
      <Text variant="largeTitle">{children}</Text>
      {subtitle ? <Text variant="subhead">{subtitle}</Text> : null}
    </View>
  );
}
