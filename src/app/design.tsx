import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BottomActionBar } from '@/components/denly/BottomActionBar';
import { CategoryBadge } from '@/components/denly/CategoryBadge';
import { ConfidenceLabel } from '@/components/denly/ConfidenceLabel';
import { DishRow } from '@/components/denly/DishRow';
import { EmptyState } from '@/components/denly/EmptyState';
import { ErrorState } from '@/components/denly/ErrorState';
import { HeroCounterCard } from '@/components/denly/HeroCounterCard';
import { IngredientRow } from '@/components/denly/IngredientRow';
import { ListGroup, ListRow } from '@/components/denly/ListGroup';
import { OfflineBanner } from '@/components/denly/OfflineBanner';
import { ProduceTile } from '@/components/denly/ProduceTile';
import { ScanRow } from '@/components/denly/ScanRow';
import { Screen } from '@/components/denly/Screen';
import { LargeTitle, ScreenHeader } from '@/components/denly/ScreenHeader';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { StageList } from '@/components/denly/StageList';
import { TabBar, type TabKey } from '@/components/denly/TabBar';
import { TileStack } from '@/components/denly/TileStack';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DISHES, INGREDIENTS, PACK_TIERS, TIERS, type PackTier } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { alternateName, ingredientName, initials, scanTitle } from '@/features/demo/demo-state';
import { isAppearancePreference } from '@/lib/appearance';
import { useAppearance } from '@/lib/use-appearance';

/**
 * Dev kitchen sink: every UI kit and Denly component with demo data, in the current appearance
 * (switch it at the top). Reachable from Profile's demo controls; not part of the product flow.
 */
export default function DesignScreen() {
  const { preference, setPreference } = useAppearance();
  const demo = useDemo();
  const [tab, setTab] = useState<TabKey>('index');
  const [tier, setTier] = useState<PackTier>('medium');
  const [segment, setSegment] = useState('all');
  const lang = demo.nameLanguage;
  const tilesOf = (ids: readonly (keyof typeof INGREDIENTS)[]) =>
    ids.map((id) => ({ key: id, abbreviation: INGREDIENTS[id].abbreviation, color: INGREDIENTS[id].tileColor }));

  return (
    <Screen edges={['top']} footer={
      <BottomActionBar>
        <Button variant="secondary" onPress={() => router.back()}>
          <Text>Close design kit</Text>
        </Button>
      </BottomActionBar>
    }>
      <ScreenHeader back={{ label: 'Back', onPress: () => router.back() }} />
      <LargeTitle subtitle="Every component, current appearance.">Design kit</LargeTitle>

      <ToggleGroup
        type="single"
        value={preference}
        onValueChange={(value) => {
          if (value !== undefined && isAppearancePreference(value)) setPreference(value);
        }}
        accessibilityLabel="Appearance"
      >
        <ToggleGroupItem value="system" accessibilityLabel="System"><Text>System</Text></ToggleGroupItem>
        <ToggleGroupItem value="light" accessibilityLabel="Light"><Text>Light</Text></ToggleGroupItem>
        <ToggleGroupItem value="dark" accessibilityLabel="Dark"><Text>Dark</Text></ToggleGroupItem>
      </ToggleGroup>

      <SectionHeader title="Type" />
      <View className="gap-1">
        <Text variant="largeTitle">Large title</Text>
        <Text variant="title1">Title 1</Text>
        <Text variant="title2">Title 2</Text>
        <Text variant="title3">Title 3</Text>
        <Text variant="headline">Headline</Text>
        <Text>Body: Scan vegetables, fish or meat.</Text>
        <Text variant="subhead">Subhead in muted text.</Text>
        <Text variant="footnote">Footnote.</Text>
      </View>

      <SectionHeader title="Buttons" />
      <View className="gap-2.5">
        <Button><Text>Create account</Text></Button>
        <Button variant="secondary"><Text>Rescan</Text></Button>
        <Button variant="outline"><Text>Log in</Text></Button>
        <Button variant="destructive"><Text>Delete account</Text></Button>
        <Button variant="link"><Text>Continue without an account</Text></Button>
        <Button disabled><Text>Disabled</Text></Button>
        <View className="flex-row gap-2">
          <Button size="sm" variant="secondary"><Text>Log in</Text></Button>
          <Button size="icon" variant="ghost" accessibilityLabel="Example icon button">
            <Text>•</Text>
          </Button>
        </View>
      </View>

      <SectionHeader title="Fields" />
      <View className="gap-1.5">
        <Label nativeID="design-email">Email</Label>
        <Input aria-labelledby="design-email" placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
      </View>
      <View className="gap-1.5">
        <Label nativeID="design-bad">Password</Label>
        <Input aria-labelledby="design-bad" invalid secureTextEntry placeholder="At least 8 characters" />
        <Text className="text-footnote text-destructive">Use at least 8 characters.</Text>
      </View>

      <SectionHeader title="Chips and labels" />
      <View className="flex-row flex-wrap gap-2">
        <Badge><Text>Aromatic</Text></Badge>
        <Badge variant="secondary"><Text>Secondary</Text></Badge>
        <CategoryBadge category="Leafy green" />
        <CategoryBadge category="Citrus" />
        <CategoryBadge category="Fish" />
        <CategoryBadge category="Vegetable" />
        <CategoryBadge category="Aromatic" />
      </View>
      <View className="gap-2">
        <ConfidenceLabel band="detected" />
        <ConfidenceLabel band="likely" />
        <ConfidenceLabel band="uncertain" />
        <ConfidenceLabel band="unknown" />
        <ConfidenceLabel band="detected" variant="pill" suffix="in this scan" />
        <ConfidenceLabel band="detected" variant="header" count={3} />
      </View>

      <SectionHeader title="Tiles and avatar" />
      <View className="flex-row items-center gap-3">
        <ProduceTile abbreviation="Ka" color={INGREDIENTS.kangkong.tileColor} size="sm" />
        <ProduceTile abbreviation="Km" color={INGREDIENTS.tomato.tileColor} />
        <ProduceTile abbreviation="Bg" color={INGREDIENTS.bangus.tileColor} size="lg" />
        <TileStack tiles={tilesOf(['kangkong', 'tomato', 'onion', 'garlic', 'chili'])} />
        <Avatar alt="Rica Dela Cruz"><AvatarFallback><Text className="text-[24px]">{initials('Rica Dela Cruz')}</Text></AvatarFallback></Avatar>
      </View>

      <HeroCounterCard onScan={() => router.push('/scan/camera')} />
      <OfflineBanner message="You're offline. Scans use your Medium offline data." />
      <OfflineBanner message="You're offline with no offline data. Scans show names only." onPress={() => router.push('/settings/offline-data')} />

      <SectionHeader title="Recent scans" actionLabel="See all" onAction={() => undefined} />
      <ListGroup>
        {demo.history.slice(0, 2).map((scan) => (
          <ScanRow
            key={scan.id}
            title={scanTitle(scan, lang)}
            when={scan.when}
            offline={scan.offline}
            saved={demo.savedScanIds.includes(scan.id)}
            tiles={tilesOf(scan.items.map((i) => i.ingredientId))}
            onPress={() => router.push({ pathname: '/scan/results/[scanId]', params: { scanId: scan.id } })}
          />
        ))}
      </ListGroup>

      <SectionHeader title="Detected" variant="small" />
      <ListGroup>
        {(['kangkong', 'bangus', 'onion'] as const).map((id) => (
          <IngredientRow
            key={id}
            name={ingredientName(id, lang)}
            alternateName={alternateName(id, lang)}
            abbreviation={INGREDIENTS[id].abbreviation}
            tileColor={INGREDIENTS[id].tileColor}
            category={INGREDIENTS[id].category}
            onPress={() => router.push({ pathname: '/scan/ingredient/[id]', params: { id } })}
          />
        ))}
        <IngredientRow name="Siling haba" abbreviation="Sh" tileColor={INGREDIENTS.chili.tileColor} />
      </ListGroup>

      <SectionHeader title="You could cook" />
      <ListGroup>
        {(['adobo_kangkong', 'pinakbet'] as const).map((id) => (
          <DishRow
            key={id}
            name={DISHES[id].name}
            need={DISHES[id].need}
            saved={demo.savedDishIds.includes(id)}
            onToggleSave={() => demo.toggleSaveDish(id)}
          />
        ))}
      </ListGroup>

      <SectionHeader title="Settings rows" variant="small" />
      <ListGroup>
        <ListRow title="Offline data" value="Medium" plainTitle onPress={() => undefined} />
        <ListRow title="Log out" tone="primary" plainTitle onPress={() => undefined} showChevron={false} />
        <ListRow title="Delete account" tone="destructive" plainTitle onPress={() => undefined} showChevron={false} />
      </ListGroup>

      <SectionHeader title="Segmented control" variant="small" />
      <ToggleGroup
        type="single"
        value={segment}
        onValueChange={(value) => {
          if (value !== undefined) setSegment(value);
        }}
        accessibilityLabel="Filter history"
      >
        <ToggleGroupItem value="all" accessibilityLabel="All scans"><Text>All scans</Text></ToggleGroupItem>
        <ToggleGroupItem value="saved" accessibilityLabel="Saved"><Text>Saved</Text></ToggleGroupItem>
      </ToggleGroup>

      <SectionHeader title="Offline tiers" variant="small" />
      <RadioGroup
        value={tier}
        onValueChange={(value) => {
          const next = PACK_TIERS.find((t) => t === value);
          if (next) setTier(next);
        }}
        accessibilityLabel="Offline data size"
      >
        {PACK_TIERS.map((id, index) => (
          <View key={id}>
            {index > 0 ? <Separator className="ml-4 w-auto" /> : null}
            <RadioGroupItem value={id} accessibilityLabel={`${TIERS[id].label}. ${TIERS[id].description}`}>
              <View className="flex-1 gap-[3px]">
                <Text className="font-semibold">{TIERS[id].label}</Text>
                <Text variant="subhead">{TIERS[id].description}</Text>
              </View>
            </RadioGroupItem>
          </View>
        ))}
      </RadioGroup>
      <Progress value={42} aria-label="Download progress" />

      <SectionHeader title="Processing" variant="small" />
      <StageList
        stages={[
          { key: 'detect', label: 'Detecting ingredients' },
          { key: 'check', label: 'Checking what they are' },
          { key: 'write', label: 'Writing your summary' },
        ]}
        currentIndex={1}
      />

      <SectionHeader title="States" variant="small" />
      <View accessibilityLabel="Loading" accessibilityState={{ busy: true }} className="gap-2">
        <Skeleton className="h-15" />
        <Skeleton className="h-15" />
      </View>
      <EmptyState
        title="No saved dishes yet."
        body="Save a dish from your scan results to cook it later."
        actionLabel="Scan ingredients"
        onAction={() => router.push('/scan/camera')}
      />
      <ErrorState title="Summary unavailable right now." body="Your ingredient list is complete." onRetry={() => undefined} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"><Text>Open the delete sheet</Text></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your history and saved items from Denly. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="destructive"><Text>Delete account</Text></AlertDialogAction>
            <AlertDialogCancel><Text>Cancel</Text></AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SectionHeader title="Tab bar" variant="small" />
      <View className="overflow-hidden rounded-lg pt-6">
        <TabBar activeTab={tab} onTabPress={setTab} onScanPress={() => router.push('/scan/camera')} />
      </View>
    </Screen>
  );
}
