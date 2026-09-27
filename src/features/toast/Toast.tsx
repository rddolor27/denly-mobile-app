import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ToastProps = {
  message: string | null;
  className?: string;
};

/**
 * The toast from the prototype: an inverted pill pinned above the bottom of the screen (above
 * the tab bar on tab screens). It never takes touches, so it cannot block the content under it.
 */
export function Toast({ message, className }: ToastProps) {
  if (message === null) return null;
  return (
    <View
      className={cn('absolute bottom-4 left-4 right-4 items-center', className)}
      pointerEvents="none"
    >
      <View
        className="rounded-lg bg-foreground px-4 py-3"
        accessibilityLiveRegion="polite"
        role="status"
        accessible
        accessibilityLabel={message}
      >
        <Text className="text-center text-subhead text-background">{message}</Text>
      </View>
    </View>
  );
}
