import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ErrorStateProps = {
  /** What went wrong, plainly: "Summary unavailable right now." */
  title: string;
  /** What still works or how to fix it. */
  body?: string;
  /** Retry label, default "Try again". */
  retryLabel?: string;
  onRetry?: () => void;
  /** Disables the retry and shows "Trying again…". */
  retrying?: boolean;
  /** A secondary text action. */
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
};

/** An error card that owns the problem and offers a retry. Announced as an alert. */
export function ErrorState({
  title,
  body,
  retryLabel = 'Try again',
  onRetry,
  retrying = false,
  secondaryLabel,
  onSecondary,
  className,
}: ErrorStateProps) {
  return (
    <View
      className={cn('gap-1.5 rounded-lg border border-dashed border-dash p-4', className)}
      role="alert"
      accessibilityLiveRegion="polite"
    >
      <Text variant="headline" role="heading">
        {title}
      </Text>
      {body ? <Text variant="subhead">{body}</Text> : null}
      {onRetry ? (
        <Button
          variant="link"
          className="self-start"
          onPress={onRetry}
          disabled={retrying}
          accessibilityState={{ disabled: retrying, busy: retrying }}
        >
          <Text>{retrying ? 'Trying again…' : retryLabel}</Text>
        </Button>
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button variant="link" className="self-start" onPress={onSecondary}>
          <Text>{secondaryLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
