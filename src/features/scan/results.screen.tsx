import { router, useLocalSearchParams } from 'expo-router';
import { Ban, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';

import { BottomActionBar } from '@/components/denly/BottomActionBar';
import { ConfidenceLabel } from '@/components/denly/ConfidenceLabel';
import { DishRow } from '@/components/denly/DishRow';
import { EmptyState } from '@/components/denly/EmptyState';
import { ErrorState } from '@/components/denly/ErrorState';
import { IngredientRow } from '@/components/denly/IngredientRow';
import { ListGroup } from '@/components/denly/ListGroup';
import { OfflineBanner } from '@/components/denly/OfflineBanner';
import { Screen } from '@/components/denly/Screen';
import { ScreenHeader } from '@/components/denly/ScreenHeader';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DATA_RELEASE_LABEL, type ConfidenceBand, type DemoScan, type IngredientId } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import {
  alternateName,
  bandCounts,
  findScan,
  getDish,
  getIngredient,
  hasRichData,
  ingredientName,
} from '@/features/demo/demo-state';

import { bandCountsLine, ingredientsFoundTitle, resultsBack } from './scan-flow';
import { NoteBox, SaveToggle } from './ScanParts';
import { Toast, useToast } from './Toast';

const BANDS: readonly ConfidenceBand[] = ['detected', 'likely', 'uncertain'];

type IngredientListProps = {
  ids: readonly IngredientId[];
  scanId: string;
  /** Offline without data: names only, rows not pressable. */
  namesOnly: boolean;
};

function IngredientList({ ids, scanId, namesOnly }: IngredientListProps) {
  const { nameLanguage } = useDemo();
  return (
    <ListGroup accessibilityRole="list">
      {ids.map((id) => {
        const ingredient = getIngredient(id);
        const name = ingredientName(id, nameLanguage);
        return namesOnly ? (
          <IngredientRow
            key={id}
            name={name}
            abbreviation={ingredient.abbreviation}
            tileColor={ingredient.tileColor}
          />
        ) : (
          <IngredientRow
            key={id}
            name={name}
            alternateName={alternateName(id, nameLanguage)}
            abbreviation={ingredient.abbreviation}
            tileColor={ingredient.tileColor}
            category={ingredient.category}
            onPress={() => router.push({ pathname: '/scan/ingredient/[id]', params: { id, scanId } })}
          />
        );
      })}
    </ListGroup>
  );
}

function BandSection({ scan, band, namesOnly }: { scan: DemoScan; band: ConfidenceBand; namesOnly: boolean }) {
  const [open, setOpen] = useState(false);
  const ids = scan.items.filter((item) => item.band === band).map((item) => item.ingredientId);
  if (ids.length === 0) return null;
  const collapsible = band === 'uncertain';
  const noun = ids.length === 1 ? 'item' : 'items';

  return (
    <View className="gap-2.5">
      <ConfidenceLabel band={band} variant="header" count={ids.length} />
      {collapsible && !open ? (
        <Pressable
          className="min-h-13 flex-row items-center gap-3 rounded-lg border border-dashed border-border px-4 active:bg-accent"
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityState={{ expanded: false }}
        >
          <Text className="flex-1">{`Show ${ids.length} uncertain ${noun}`}</Text>
          <Icon as={ChevronDown} size={16} className="text-muted-foreground" />
        </Pressable>
      ) : (
        <>
          <IngredientList ids={ids} scanId={scan.id} namesOnly={namesOnly} />
          {collapsible ? (
            <Button
              variant="link"
              className="self-center"
              onPress={() => setOpen(false)}
              accessibilityState={{ expanded: true }}
            >
              <Text className="text-subhead">{`Hide uncertain ${noun}`}</Text>
            </Button>
          ) : null}
        </>
      )}
    </View>
  );
}

function SummarySection({ scan }: { scan: DemoScan }) {
  const { online, loadSummary } = useDemo();

  function getSummary(): void {
    loadSummary(scan.id);
    AccessibilityInfo.announceForAccessibility('AI summary ready');
  }

  let body;
  if (scan.summary) {
    body = (
      <View className="gap-2 rounded-lg bg-card p-4">
        <Text>{scan.summary}</Text>
        <Text variant="footnote">Written by AI from the ingredients above. It can be wrong.</Text>
      </View>
    );
  } else if (scan.summaryFailed) {
    body = (
      <ErrorState
        title="Summary unavailable right now."
        body="Your ingredient list is complete."
        onRetry={getSummary}
      />
    );
  } else {
    body = (
      <View className="gap-2 rounded-lg border border-dashed border-border p-4">
        <Text variant="headline" role="heading">
          AI summary needs a connection.
        </Text>
        <Text variant="subhead">
          {online
            ? 'Your ingredient list is complete.'
            : "Your ingredient list is complete. You can get the summary once you're back online."}
        </Text>
        {online && scan.offline ? (
          <Button variant="link" className="self-start" onPress={getSummary}>
            <Text>Get AI summary</Text>
          </Button>
        ) : null}
      </View>
    );
  }

  return (
    <View className="gap-2.5">
      <SectionHeader title="AI summary" variant="small" />
      {body}
    </View>
  );
}

function ScanNotFound() {
  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader back={{ label: 'Home', onPress: () => router.replace('/(tabs)') }} />
      <EmptyState
        title="This scan isn't here anymore."
        body="Start a new scan to see what's on your counter."
        actionLabel="Scan ingredients"
        onAction={() => router.replace('/scan/camera')}
      />
    </Screen>
  );
}

/** Results: ingredients by confidence, AI summary, dishes, unknowns, Rescan. */
export function ResultsScreen() {
  const params = useLocalSearchParams<{ scanId: string; from?: string }>();
  const demo = useDemo();
  const toast = useToast();
  const scan = typeof params.scanId === 'string' ? findScan(demo, params.scanId) : undefined;

  if (!scan) return <ScanNotFound />;

  const back = resultsBack(params.from);
  const saved = demo.savedScanIds.includes(scan.id);
  const namesOnly = scan.offline && !hasRichData(demo);
  const counts = bandCounts(scan);

  function toggleSave(): void {
    if (!scan) return;
    demo.toggleSaveScan(scan.id);
    toast.show(saved ? 'Removed from saved.' : 'Scan saved.');
  }

  return (
    <View className="flex-1">
      <Screen
        footer={
          <BottomActionBar>
            <Button variant="secondary" onPress={() => router.replace('/scan/camera')}>
              <Text>Rescan</Text>
            </Button>
          </BottomActionBar>
        }
      >
        <ScreenHeader
          back={{
            label: back.label,
            onPress: () => (router.canGoBack() ? router.back() : router.replace(back.route)),
          }}
          right={
            <SaveToggle saved={saved} saveLabel="Save scan" removeLabel="Remove scan from saved" onPress={toggleSave} />
          }
        />
        {demo.online ? null : (
          <OfflineBanner
            message={
              namesOnly
                ? "You're offline with no offline data, so only names are shown."
                : "You're offline. Results use your offline data."
            }
          />
        )}
        <View className="gap-2">
          <Text variant="title1" className="text-[30px] leading-[34px]">
            {ingredientsFoundTitle(scan.items.length)}
          </Text>
          {scan.offline ? (
            <View className="self-start rounded-sm bg-muted px-2.5 py-1">
              <Text className="text-footnote font-semibold text-muted-foreground">
                {`Offline result, data from ${DATA_RELEASE_LABEL}`}
              </Text>
            </View>
          ) : null}
          <Text variant="subhead">{`${bandCountsLine(counts)}. ${scan.when}.`}</Text>
        </View>

        {BANDS.map((band) => (
          <BandSection key={band} scan={scan} band={band} namesOnly={namesOnly} />
        ))}

        <SummarySection scan={scan} />

        {namesOnly ? (
          <View className="gap-2 rounded-lg bg-card p-4">
            <Text variant="headline" role="heading">
              See details offline
            </Text>
            <Text variant="subhead">
              Download offline data when you&apos;re connected to get categories, local names and dishes without a
              connection.
            </Text>
            <Button variant="secondary" className="mt-1.5" onPress={() => router.push('/settings/offline-data')}>
              <Text>Offline data</Text>
            </Button>
          </View>
        ) : (
          <View className="gap-1">
            <SectionHeader title="You could cook" />
            <ListGroup>
              {scan.dishIds.map((dishId) => {
                const dish = getDish(dishId);
                const dishSaved = demo.savedDishIds.includes(dishId);
                return (
                  <DishRow
                    key={dishId}
                    name={dish.name}
                    need={dish.need}
                    saved={dishSaved}
                    onPress={() => toast.show(`${dish.name} recipes arrive with the recipe data.`)}
                    onToggleSave={() => {
                      demo.toggleSaveDish(dishId);
                      toast.show(dishSaved ? 'Removed from saved.' : `${dish.name} saved.`);
                    }}
                  />
                );
              })}
            </ListGroup>
          </View>
        )}

        {scan.unknownCount > 0 ? (
          <NoteBox>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="pt-0.5">
              <Icon as={Ban} size={20} className="text-muted-foreground" />
            </View>
            <View className="flex-1 gap-0.5" accessible>
              <Text variant="headline">
                {`Couldn't identify ${scan.unknownCount} ${scan.unknownCount === 1 ? 'item' : 'items'}`}
              </Text>
              <Text variant="subhead">A closer photo of it usually works.</Text>
            </View>
          </NoteBox>
        ) : null}
      </Screen>
      <Toast message={toast.message} className="bottom-[110px]" />
    </View>
  );
}
