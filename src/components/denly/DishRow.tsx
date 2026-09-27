import { Bookmark, CookingPot } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type DishRowProps = {
  name: string;
  /** What is still missing: "Add soy sauce and vinegar". */
  need: string;
  /** Shows the save toggle when set. */
  saved?: boolean;
  onToggleSave?: () => void;
  onPress?: () => void;
};

/** The dish pot tile: the warm "dish" extra colour. */
export function DishTile() {
  return (
    <View
      className="size-10 shrink-0 items-center justify-center rounded-tile bg-dish-soft"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Icon as={CookingPot} size={20} className="text-dish" />
    </View>
  );
}

/** A dish suggestion / saved dish: pot tile, name, what to add, and a bookmark toggle. */
export function DishRow({ name, need, saved, onToggleSave, onPress }: DishRowProps) {
  const body = (
    <>
      <DishTile />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="font-semibold" numberOfLines={2}>
          {name}
        </Text>
        <Text variant="subhead">{need}</Text>
      </View>
    </>
  );
  const bodyClass = 'min-h-15 flex-1 flex-row items-center gap-3 py-2.5 pl-4';

  return (
    <View className="flex-row items-center">
      {onPress ? (
        <Pressable
          className={cn(bodyClass, 'active:bg-accent', !onToggleSave && 'pr-4')}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${name}, ${need}`}
        >
          {body}
        </Pressable>
      ) : (
        <View className={cn(bodyClass, !onToggleSave && 'pr-4')} accessible accessibilityLabel={`${name}, ${need}`}>
          {body}
        </View>
      )}
      {onToggleSave ? (
        <Pressable
          className="mr-1.5 size-11 items-center justify-center rounded-full active:bg-accent"
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Remove ${name} from saved` : `Save ${name}`}
          accessibilityState={{ selected: saved === true }}
        >
          <Icon
            as={Bookmark}
            size={22}
            className={saved ? 'text-primary' : 'text-muted-foreground'}
            fill={saved ? 'currentColor' : 'none'}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
