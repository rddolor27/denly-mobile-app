import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * React Native Reusables `Button`, restyled to Denly: 52pt pill buttons, one primary per
 * screen. Variants: `default` = primary (pink), `secondary` = tinted (Rescan), `outline` = card
 * with border (Log in), `destructive` = Delete account, `ghost` = pressed-row look, `link` = text
 * button (44pt tall, pink text). Press feedback is a colour change only (no scale), so it stays
 * Reduce Motion safe.
 */
const buttonVariants = cva('group shrink-0 flex-row items-center justify-center gap-2.5', {
  variants: {
    variant: {
      default: 'bg-primary active:bg-primary/90',
      secondary: 'bg-secondary active:bg-secondary/80',
      outline: 'border border-border bg-card active:bg-accent',
      destructive: 'bg-destructive active:bg-destructive/90',
      ghost: 'active:bg-accent',
      link: '',
    },
    size: {
      default: 'h-13 rounded-full px-6',
      sm: 'h-10 rounded-full px-4',
      icon: 'h-11 w-11 rounded-full',
    },
  },
  compoundVariants: [{ variant: 'link', className: 'h-11 px-0' }],
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('text-body font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      destructive: 'text-destructive-foreground',
      ghost: 'text-foreground',
      link: 'font-normal text-primary',
    },
    size: {
      default: '',
      sm: 'text-subhead',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  ButtonVariantProps;

/** Extra hit area so the 40pt small button still gives a 44pt touch target. */
const SMALL_HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 } as const;

function Button({ className, variant, size, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled === true;
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(isDisabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        hitSlop={size === 'sm' ? SMALL_HIT_SLOP : undefined}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps, ButtonVariantProps };
