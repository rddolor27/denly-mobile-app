import { CircleAlert } from 'lucide-react-native';
import { useState, type Ref } from 'react';
import { Pressable, View, type TextInput } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Input, type InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

type Props = Omit<InputProps, 'ref' | 'invalid' | 'secureTextEntry' | 'accessibilityLabel'> & {
  /** Visible label, also the input's accessible name. */
  label: string;
  /** Inline error under the field; marks the input invalid. */
  error?: string | undefined;
  /** Help under the field while there is no error ("At least 8 characters."). */
  help?: string;
  /** A password field: hidden text with a Show / Hide button. */
  password?: boolean;
  inputRef?: Ref<TextInput>;
};

/** The error is also the input's accessibility hint, so it is read with the field. */
export function FormField({ label, error, help, password = false, inputRef, ...inputProps }: Props) {
  const [revealed, setRevealed] = useState(false);
  const note = error ?? help;

  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <View className="justify-center">
        <Input
          ref={inputRef}
          invalid={error !== undefined}
          accessibilityLabel={label}
          {...(note ? { accessibilityHint: note } : {})}
          secureTextEntry={password && !revealed}
          {...(password ? { className: 'pr-20' } : {})}
          {...inputProps}
        />
        {password ? (
          <Pressable
            className="absolute right-1 h-11 justify-center px-2.5 active:opacity-60"
            onPress={() => setRevealed((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
          >
            <Text className="text-subhead text-primary">{revealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View className="flex-row items-center gap-1.5">
          <Icon as={CircleAlert} size={14} className="text-destructive" />
          <Text className="flex-1 text-footnote text-destructive">{error}</Text>
        </View>
      ) : help ? (
        <Text variant="footnote">{help}</Text>
      ) : null}
    </View>
  );
}
