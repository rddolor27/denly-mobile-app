import { router } from 'expo-router';
import { Bookmark, Clock, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { ListGroup, ListRow } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { TileStack } from '@/components/denly/TileStack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { IngredientId } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { getIngredient } from '@/features/demo/demo-state';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';

const STACK_IDS: readonly IngredientId[] = ['kangkong', 'tomato', 'onion'];

function IconTile({ icon }: { icon: LucideIcon }) {
  return (
    <View
      className="size-[30px] items-center justify-center rounded-sm bg-primary"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Icon as={icon} size={16} className="text-primary-foreground" />
    </View>
  );
}

/** First launch: what Denly does, then Create account / Log in / Continue without an account. */
export function WelcomeScreen() {
  const { continueAsGuest } = useDemo();
  const toast = useToast();
  const tiles = STACK_IDS.map((id) => {
    const ingredient = getIngredient(id);
    return { key: id, abbreviation: ingredient.abbreviation, color: ingredient.tileColor };
  });

  return (
    <Screen
      edges={['top', 'bottom']}
      contentClassName="gap-[26px] px-6 pb-6 pt-10"
      footer={<Toast message={toast.message} />}
    >
      <Text className="font-display text-title-2 text-primary">Denly</Text>
      <View className="gap-3.5">
        <Text role="heading" className="font-display text-[40px] leading-[44px]">
          Know what&apos;s on your counter.
        </Text>
        <Text className="text-muted-foreground">
          Scan vegetables, fish or meat. Denly names each one in Filipino, English or Bisaya, says how sure it is,
          and suggests what to cook.
        </Text>
      </View>
      <ListGroup>
        <ListRow
          title="Scan in seconds"
          subtitle="Works offline with downloaded data"
          leading={<TileStack tiles={tiles} />}
        />
        <ListRow
          title="Keep your history"
          subtitle="Every scan, on every device you sign in to"
          leading={<IconTile icon={Clock} />}
        />
        <ListRow
          title="Save dishes to cook"
          subtitle="Pinakbet, sinigang, adobo and more"
          leading={<IconTile icon={Bookmark} />}
        />
      </ListGroup>
      <View className="flex-1" />
      <View className="gap-2.5">
        <Button onPress={() => router.push('/(auth)/register')}>
          <Text>Create account</Text>
        </Button>
        <Button variant="outline" onPress={() => router.push('/(auth)/login')}>
          <Text>Log in</Text>
        </Button>
        <Button
          variant="link"
          className="self-center"
          onPress={() => {
            continueAsGuest();
            toast.show('You can create an account any time from Profile.');
            router.replace('/(tabs)');
          }}
        >
          <Text>Continue without an account</Text>
        </Button>
      </View>
    </Screen>
  );
}
