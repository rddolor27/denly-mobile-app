import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/denly/EmptyState';
import { IngredientRow } from '@/components/denly/IngredientRow';
import { ListGroup } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { LargeTitle } from '@/components/denly/ScreenHeader';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDemo } from '@/features/demo/demo-provider';
import { alternateName, getIngredient, hasRichData, ingredientName } from '@/features/demo/demo-state';
import { HistoryScanRow } from '@/features/history/HistoryScanRow';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';

import { SavedDishRow } from './SavedDishRow';

export type SavedTab = 'dishes' | 'ingredients' | 'scans';

const TABS: readonly { id: SavedTab; label: string }[] = [
  { id: 'dishes', label: 'Dishes' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'scans', label: 'Scans' },
];

export function isSavedTab(value: unknown): value is SavedTab {
  return value === 'dishes' || value === 'ingredients' || value === 'scans';
}

function openCamera(): void {
  router.push('/scan/camera');
}

/**
 * Saved (prototype `saved`): dishes, ingredients and scans the person kept. An optional `tab`
 * search param picks the segment (Home's "See all" opens Dishes); it is cleared once applied so
 * the same link works again after the person switches segments.
 */
export function SavedScreen() {
  const demo = useDemo();
  const toast = useToast();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<SavedTab>(isSavedTab(tabParam) ? tabParam : 'dishes');
  const [appliedParam, setAppliedParam] = useState(tabParam);

  // Adjust state while rendering when a new `tab` param arrives (the tab screen stays mounted).
  if (tabParam !== appliedParam) {
    setAppliedParam(tabParam);
    if (isSavedTab(tabParam)) setTab(tabParam);
  }

  useEffect(() => {
    if (tabParam !== undefined) router.setParams({ tab: undefined });
  }, [tabParam]);

  const rich = hasRichData(demo);
  const savedScans = demo.history.filter((scan) => demo.savedScanIds.includes(scan.id));

  function body() {
    if (tab === 'dishes') {
      return demo.savedDishIds.length > 0 ? (
        <ListGroup accessibilityLabel="Saved dishes">
          {demo.savedDishIds.map((dishId) => (
            <SavedDishRow key={dishId} dishId={dishId} onMessage={toast.show} />
          ))}
        </ListGroup>
      ) : (
        <EmptyState
          title="No saved dishes yet."
          body="Save a dish from your scan results to cook it later."
          actionLabel="Scan ingredients"
          onAction={openCamera}
        />
      );
    }
    if (tab === 'ingredients') {
      return demo.savedIngredientIds.length > 0 ? (
        <ListGroup accessibilityLabel="Saved ingredients">
          {demo.savedIngredientIds.map((id) => {
            const ingredient = getIngredient(id);
            return (
              <IngredientRow
                key={id}
                name={ingredientName(id, demo.nameLanguage)}
                alternateName={alternateName(id, demo.nameLanguage)}
                abbreviation={ingredient.abbreviation}
                tileColor={ingredient.tileColor}
                {...(rich ? { category: ingredient.category } : {})}
                onPress={() => router.push({ pathname: '/scan/ingredient/[id]', params: { id } })}
              />
            );
          })}
        </ListGroup>
      ) : (
        <EmptyState
          title="No saved ingredients yet."
          body="Open an ingredient and tap the bookmark to keep it here."
          actionLabel="Scan ingredients"
          onAction={openCamera}
        />
      );
    }
    return savedScans.length > 0 ? (
      <ListGroup accessibilityLabel="Saved scans">
        {savedScans.map((scan) => (
          <HistoryScanRow key={scan.id} scan={scan} from="saved" />
        ))}
      </ListGroup>
    ) : (
      <EmptyState
        title="No saved scans yet."
        body="Tap the bookmark on a result to keep it here."
        actionLabel="Scan ingredients"
        onAction={openCamera}
      />
    );
  }

  return (
    <Screen footer={<Toast message={toast.message} />}>
      <LargeTitle>Saved</LargeTitle>
      <ToggleGroup
        type="single"
        value={tab}
        onValueChange={(value) => {
          if (isSavedTab(value)) setTab(value);
        }}
        accessibilityLabel="Saved type"
      >
        {TABS.map((item) => (
          <ToggleGroupItem key={item.id} value={item.id} accessibilityLabel={item.label}>
            <Text>{item.label}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {body()}
    </Screen>
  );
}
