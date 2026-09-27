import { ChevronRight } from 'lucide-react-native';
import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { Pressable, View, type AccessibilityRole } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ListGroupProps = {
  children: ReactNode;
  className?: string;
  accessibilityLabel?: string;
  /** e.g. `list` for results. */
  accessibilityRole?: AccessibilityRole;
};

/** A grouped list: card surface, 12pt radius, hairlines between rows (never a card in a card). */
export function ListGroup({ children, className, accessibilityLabel, accessibilityRole }: ListGroupProps) {
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <View
      className={cn('overflow-hidden rounded-lg bg-card', className)}
      {...(accessibilityLabel ? { accessibilityLabel } : {})}
      {...(accessibilityRole ? { accessibilityRole } : {})}
    >
      {rows.map((row, index) => (
        <Fragment key={row.key ?? index}>
          {index > 0 ? <Separator className="ml-4 w-auto" /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

export type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Tile, icon or avatar on the left. */
  leading?: ReactNode;
  /** Badge, value or icon before the chevron. */
  trailing?: ReactNode;
  /** Muted value on the right ("Medium", "Not downloaded"). */
  value?: string;
  onPress?: () => void;
  /** Defaults to true when the row is pressable. */
  showChevron?: boolean;
  /** Title colour for action rows ("Log out" = primary, "Delete account" = destructive). */
  tone?: 'default' | 'primary' | 'destructive';
  /** Regular weight title (settings rows) instead of semibold (content rows). */
  plainTitle?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  className?: string;
};

const TONE: Readonly<Record<NonNullable<ListRowProps['tone']>, string>> = {
  default: 'text-foreground',
  primary: 'text-primary',
  destructive: 'text-destructive',
};

/**
 * One row of a `ListGroup`: 60pt minimum, 16pt side padding. Pressable rows are buttons with a
 * chevron; the whole row is the touch target and reads as one sentence to screen readers.
 */
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  value,
  onPress,
  showChevron,
  tone = 'default',
  plainTitle = false,
  accessibilityLabel,
  accessibilityHint,
  className,
}: ListRowProps) {
  const chevron = showChevron ?? onPress !== undefined;
  const label = accessibilityLabel ?? [title, subtitle, value].filter(Boolean).join(', ');
  const content = (
    <>
      {leading}
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          className={cn(plainTitle ? 'font-normal' : 'font-semibold', TONE[tone])}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? <Text variant="subhead">{subtitle}</Text> : null}
      </View>
      {value ? <Text variant="subhead">{value}</Text> : null}
      {trailing}
      {chevron ? <Icon as={ChevronRight} size={16} className="text-muted-foreground" /> : null}
    </>
  );
  const rowClass = cn('min-h-15 flex-row items-center gap-3 px-4 py-2.5', className);

  if (onPress) {
    return (
      <Pressable
        className={cn(rowClass, 'active:bg-accent')}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        {...(accessibilityHint ? { accessibilityHint } : {})}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <View className={rowClass} accessible accessibilityLabel={label}>
      {content}
    </View>
  );
}
