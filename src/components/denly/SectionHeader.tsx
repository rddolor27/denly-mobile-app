import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type SectionHeaderProps = {
  title: string;
  /**
   * `display`: 21pt display face with an optional link on the right ("Recent scans · See all").
   * `small`: 15pt muted heading over a grouped list ("Preferences", "Today").
   */
  variant?: 'display' | 'small';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** A section heading, optionally with a text action ("See all"). */
export function SectionHeader({ title, variant = 'display', actionLabel, onAction, className }: SectionHeaderProps) {
  if (variant === 'small') {
    return (
      <Text variant="sectionTitle" className={cn('px-1', className)}>
        {title}
      </Text>
    );
  }
  return (
    <View className={cn('min-h-11 flex-row items-center justify-between px-1', className)}>
      <Text variant="title2" className="text-[21px]">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Button variant="link" onPress={onAction} accessibilityLabel={`${actionLabel}: ${title}`}>
          <Text className="text-subhead">{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
