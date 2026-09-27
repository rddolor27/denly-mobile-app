import * as LabelPrimitive from '@rn-primitives/label';

import { cn } from '@/lib/utils';

/** React Native Reusables `Label`: a form field label (15pt semibold). */
function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50')}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LabelPrimitive.Text
        className={cn('text-subhead font-semibold text-foreground', className)}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
