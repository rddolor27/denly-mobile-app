import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Text as RNText, type Role } from 'react-native';

import { cn } from '@/lib/utils';

/**
 * React Native Reusables `Text`, restyled to Denly's type roles (iOS text styles; the display face
 * only for titles). Body text uses the system font so it follows the user's font size setting.
 * Parents such as `Button` pass text classes down through `TextClassContext`.
 */
const textVariants = cva('text-body text-foreground', {
  variants: {
    variant: {
      default: '',
      largeTitle: 'font-display text-large-title',
      title1: 'font-display text-title-1',
      title2: 'font-display text-title-2',
      title3: 'text-title-3 font-semibold',
      headline: 'font-semibold',
      callout: 'text-callout',
      subhead: 'text-subhead text-muted-foreground',
      footnote: 'text-footnote text-muted-foreground',
      caption: 'text-caption text-muted-foreground',
      /** Small grouped-list heading ("Preferences", "Today"). */
      sectionTitle: 'text-subhead font-semibold text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;
type TextVariant = NonNullable<TextVariantProps['variant']>;

const HEADING_VARIANTS: ReadonlySet<TextVariant> = new Set([
  'largeTitle',
  'title1',
  'title2',
  'title3',
  'sectionTitle',
]);

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = React.ComponentProps<typeof RNText> &
  React.RefAttributes<RNText> &
  TextVariantProps & {
    asChild?: boolean;
  };

function Text({ className, asChild = false, variant = 'default', ...props }: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  const role: Role | undefined =
    variant !== null && HEADING_VARIANTS.has(variant) ? 'heading' : undefined;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      {...(role ? { role } : {})}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
export type { TextProps };
