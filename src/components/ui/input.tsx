import { TextInput } from 'react-native';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    /** Shows the error border; pair with an error message linked by the field. */
    invalid?: boolean;
  };

/**
 * React Native Reusables `Input`, restyled to Denly fields: 52pt tall, 12pt radius, card surface,
 * pink border on focus, destructive border when invalid.
 */
function Input({ className, invalid = false, editable, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'h-13 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 text-body text-foreground',
        'placeholder:text-muted-foreground focus:border-primary',
        invalid && 'border-destructive focus:border-destructive',
        editable === false && 'opacity-50',
        className,
      )}
      aria-invalid={invalid}
      editable={editable}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
