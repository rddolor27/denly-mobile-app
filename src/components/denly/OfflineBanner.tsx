import { ChevronRight, CloudOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type OfflineBannerProps = {
  /** "You're offline. Results use your offline data." */
  message: string;
  /** Makes the banner a button with a chevron (e.g. to Offline data). */
  onPress?: () => void;
  /**
   * `info` on normal screens; `camera` is the dark glass version over the viewfinder
   * (same in both modes).
   */
  tone?: 'info' | 'camera';
  className?: string;
};

/** The offline banner: cloud-off icon + one sentence saying what still works. Announced politely. */
export function OfflineBanner({ message, onPress, tone = 'info', className }: OfflineBannerProps) {
  const box = cn(
    'flex-row items-center gap-2.5 rounded-lg px-3.5 py-2.5',
    tone === 'info' ? 'bg-info-soft' : 'bg-camera/75',
    className,
  );
  const text = tone === 'info' ? 'text-info' : 'text-camera-foreground';
  const content = (
    <>
      <Icon as={CloudOff} size={18} className={text} />
      <Text className={cn('flex-1 text-subhead', text)}>{message}</Text>
      {onPress ? <Icon as={ChevronRight} size={16} className={text} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        className={cn(box, 'min-h-11 active:opacity-80')}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={message}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <View className={box} accessible accessibilityLabel={message} accessibilityLiveRegion="polite" role="status">
      {content}
    </View>
  );
}
