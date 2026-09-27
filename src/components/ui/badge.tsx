import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * React Native Reusables `Badge`, restyled to Denly chips: 8pt radius, 13pt text. `default` is
 * the neutral chip (muted); category colours live in `CategoryBadge`, confidence in
 * `ConfidenceLabel` — never here.
 */
const badgeVariants = cva('shrink-0 flex-row items-center gap-1 self-start rounded-sm px-2 py-[3px]', {
  variants: {
    variant: {
      default: 'bg-muted',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      outline: 'border border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('text-footnote', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
