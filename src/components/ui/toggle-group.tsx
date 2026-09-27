import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import * as React from 'react';

import { Icon } from '@/components/ui/icon';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * React Native Reusables `ToggleGroup`, restyled as Denly's segmented control (history filter,
 * Saved tabs, name language, appearance): a pressed-grey track, equal-width segments, the
 * selected one lifted onto the card colour. Segments are 44pt tall (the prototype's 36pt was
 * raised to the touch-target minimum). Use `type="single"` for segmented choices; the primitive
 * exposes them as radio buttons to screen readers.
 */
function ToggleGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn('flex-row items-stretch gap-0.5 rounded-[10px] bg-accent p-0.5', className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { value } = ToggleGroupPrimitive.useRootContext();
  const selected = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);

  return (
    <TextClassContext.Provider
      value={cn(
        'text-subhead text-center',
        selected ? 'font-semibold text-foreground' : 'text-muted-foreground',
      )}
    >
      <ToggleGroupPrimitive.Item
        className={cn(
          'min-h-11 flex-1 flex-row items-center justify-center gap-1.5 rounded-sm px-2',
          selected && 'bg-card shadow-sm shadow-black/10',
          props.disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn('size-4 shrink-0', textClass, className)} {...props} />;
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
