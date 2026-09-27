import { router, useLocalSearchParams } from 'expo-router';
import { CircleQuestionMark } from 'lucide-react-native';
import { View } from 'react-native';

import { ConfidenceLabel } from '@/components/denly/ConfidenceLabel';
import { EmptyState } from '@/components/denly/EmptyState';
import { ProduceTile } from '@/components/denly/ProduceTile';
import { Screen } from '@/components/denly/Screen';
import { ScreenHeader } from '@/components/denly/ScreenHeader';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DATA_RELEASE_LABEL, TIERS, type IngredientId } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import {
  alternateName,
  findScan,
  getIngredient,
  hasFullDetail,
  ingredientName,
  isIngredientId,
} from '@/features/demo/demo-state';

import { DefinitionList, NoteBox, SaveToggle, type Definition } from './ScanParts';
import { Toast, useToast } from './Toast';

function goBack(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

function IngredientNotFound() {
  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader back={{ label: 'Back', onPress: goBack }} />
      <EmptyState title="We don't have this ingredient." body="Go back and pick another one." />
    </Screen>
  );
}

function IngredientDetail({ id, scanId }: { id: IngredientId; scanId: string | undefined }) {
  const demo = useDemo();
  const toast = useToast();
  const ingredient = getIngredient(id);
  const name = ingredientName(id, demo.nameLanguage);
  const saved = demo.savedIngredientIds.includes(id);
  const band = scanId ? findScan(demo, scanId)?.items.find((item) => item.ingredientId === id)?.band : undefined;
  const fullDetail = hasFullDetail(demo);

  const about: Definition[] = [{ term: 'Category', value: ingredient.category }];
  if (fullDetail) about.push({ term: 'Cooked in', value: ingredient.cookedIn });

  let source: string;
  if (demo.online) source = `From Denly's ingredient data, updated ${DATA_RELEASE_LABEL}`;
  else if (demo.pack === 'none') source = "You're offline with no offline data.";
  else source = `From your ${TIERS[demo.pack].label} offline data, ${DATA_RELEASE_LABEL}`;

  function toggleSave(): void {
    demo.toggleSaveIngredient(id);
    toast.show(saved ? 'Removed from saved.' : `${name} saved.`);
  }

  return (
    <View className="flex-1">
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader
          back={{ label: 'Back', onPress: goBack }}
          right={
            <SaveToggle saved={saved} saveLabel="Save ingredient" removeLabel="Remove from saved" onPress={toggleSave} />
          }
        />
        <View className="flex-row items-center gap-4">
          <ProduceTile abbreviation={ingredient.abbreviation} color={ingredient.tileColor} size="lg" />
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="largeTitle">{name}</Text>
            <Text className="text-muted-foreground">{alternateName(id, demo.nameLanguage)}</Text>
          </View>
        </View>
        {band ? <ConfidenceLabel band={band} variant="pill" suffix="in this scan" /> : null}
        {band === 'uncertain' ? (
          <NoteBox className="items-center py-2.5">
            <Icon as={CircleQuestionMark} size={18} className="text-muted-foreground" />
            <Text className="flex-1 text-subhead">Uncertain. Rescan closer to confirm it.</Text>
          </NoteBox>
        ) : null}
        <View className="gap-2.5">
          <SectionHeader title="Also called" variant="small" />
          <DefinitionList
            rows={[
              { term: 'Filipino', value: ingredient.names.tl },
              { term: 'Bisaya', value: ingredient.names.ceb },
              { term: 'English', value: ingredient.names.en },
            ]}
          />
        </View>
        <View className="gap-2.5">
          <SectionHeader title="About" variant="small" />
          <DefinitionList rows={about} />
        </View>
        {fullDetail ? (
          <NoteBox>
            <Text className="flex-1 text-subhead text-foreground">{ingredient.tip}</Text>
          </NoteBox>
        ) : (
          <Text variant="subhead">
            More detail comes with Medium or Large offline data, or when you&apos;re online.
          </Text>
        )}
        <View className="flex-1" />
        <Text variant="footnote" className="text-center">
          {source}
        </Text>
      </Screen>
      <Toast message={toast.message} className="bottom-12" />
    </View>
  );
}

/** Ingredient detail. `scanId` (optional search param) adds the band pill for that scan. */
export function IngredientScreen() {
  const params = useLocalSearchParams<{ id: string; scanId?: string }>();
  const id = typeof params.id === 'string' && isIngredientId(params.id) ? params.id : undefined;
  if (!id) return <IngredientNotFound />;
  return <IngredientDetail id={id} scanId={typeof params.scanId === 'string' ? params.scanId : undefined} />;
}
