import { router } from 'expo-router';
import { View } from 'react-native';

import { ListGroup, ListRow } from '@/components/denly/ListGroup';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Text } from '@/components/ui/text';
import type { OfflinePack } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import type { ScanOutcome } from '@/features/demo/demo-state';

import { SettingSegment, type SettingOption } from './SettingSegment';

const CONNECTION: readonly SettingOption<'online' | 'offline'>[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const PACKS: readonly SettingOption<OfflinePack>[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const OUTCOMES: readonly SettingOption<ScanOutcome>[] = [
  { value: 'found', label: 'Ingredients' },
  { value: 'empty', label: 'Nothing' },
  { value: 'nosummary', label: 'AI summary fails' },
  { value: 'slow', label: 'Slow' },
];

/**
 * The prototype's side panel, inside the app: switches the example data so every state can be
 * reached on a phone. Not part of the product; removed with the demo provider.
 */
export function DemoControls() {
  const { online, pack, nextOutcome, setOnline, setPack, setNextOutcome } = useDemo();
  return (
    <View className="gap-2">
      <SectionHeader title="Demo controls (example data)" variant="small" />
      <View className="gap-5 rounded-lg bg-card p-4">
        <SettingSegment
          label="Connection"
          options={CONNECTION}
          value={online ? 'online' : 'offline'}
          onChange={(value) => setOnline(value === 'online')}
        />
        <SettingSegment label="Offline data on the phone" options={PACKS} value={pack} onChange={setPack} />
        <SettingSegment
          label="What the next scan finds"
          options={OUTCOMES}
          value={nextOutcome}
          onChange={setNextOutcome}
        />
      </View>
      <ListGroup>
        <ListRow
          title="Camera off screen"
          plainTitle
          onPress={() => router.push({ pathname: '/scan/camera', params: { state: 'denied' } })}
        />
        <ListRow title="Design kit" plainTitle onPress={() => router.push('/design')} />
      </ListGroup>
      <Text variant="footnote" className="px-1">
        These change the example data only. They are not part of Denly.
      </Text>
    </View>
  );
}
