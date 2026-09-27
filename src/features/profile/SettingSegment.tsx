import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type SettingOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** Visible label, also the group's accessibility label. */
  label: string;
  /** One line under the label. */
  description?: string;
  options: readonly SettingOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** A labelled segmented setting (Appearance, Ingredient names, the demo controls). */
export function SettingSegment<T extends string>({ label, description, options, value, onChange }: Props<T>) {
  return (
    <View className="gap-3">
      <View className="gap-0.5">
        <Text variant="headline">{label}</Text>
        {description ? <Text variant="subhead">{description}</Text> : null}
      </View>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          const option = options.find((o) => o.value === next);
          if (option) onChange(option.value);
        }}
        accessibilityLabel={label}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} accessibilityLabel={option.label}>
            <Text>{option.label}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </View>
  );
}
