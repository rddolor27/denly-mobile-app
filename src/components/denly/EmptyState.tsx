import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type EmptyStateProps = {
  /** "No saved dishes yet." */
  title: string;
  /** What to do next, one sentence. */
  body?: string;
  /** One action at most ("Scan ingredients"). */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** A dashed placeholder card that says what is missing and invites one action. */
export function EmptyState({ title, body, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <View className={cn('gap-2 rounded-lg border border-dashed border-border p-4', className)}>
      <Text variant="headline" role="heading">
        {title}
      </Text>
      {body ? <Text variant="subhead">{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" className="mt-1.5" onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
