import * as AvatarPrimitive from '@rn-primitives/avatar';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * React Native Reusables `Avatar`, restyled to Denly: 64pt circle (use `size-10` for the small
 * header avatar), tinted pink fallback with display-face initials.
 */
function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative size-16 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <TextClassContext.Provider value="font-display text-secondary-foreground">
      <AvatarPrimitive.Fallback
        className={cn(
          'size-full flex-row items-center justify-center rounded-full bg-secondary',
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
