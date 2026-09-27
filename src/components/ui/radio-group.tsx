import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import * as React from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

/**
 * React Native Reusables `RadioGroup`, restyled to Denly's tier rows: the whole row is the radio
 * (a 22pt ring on the left; checked thickens the ring to a 7px primary border, no inner dot), so
 * the touch target is the row, not the ring. Rows sit inside a card list; `RadioGroupItem` renders
 * the ring and then its children.
 */
const RadioValueContext = React.createContext<string | undefined>(undefined);

function RadioGroup({
  className,
  value,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioValueContext.Provider value={value}>
      <RadioGroupPrimitive.Root
        className={cn('overflow-hidden rounded-lg bg-card', className)}
        value={value}
        {...props}
      />
    </RadioValueContext.Provider>
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> & {
  children?: React.ReactNode;
}) {
  const selected = React.useContext(RadioValueContext) === props.value;
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'min-h-11 flex-row items-start gap-3 px-4 py-3.5 active:bg-accent',
        props.disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <View
        className={cn(
          'mt-px size-[22px] shrink-0 rounded-full',
          selected ? 'border-[7px] border-primary' : 'border-2 border-muted-foreground',
        )}
      />
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
