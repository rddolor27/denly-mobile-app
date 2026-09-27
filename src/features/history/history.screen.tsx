import { useState } from 'react';
import { View } from 'react-native';

import { EmptyState } from '@/components/denly/EmptyState';
import { ListGroup } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { LargeTitle } from '@/components/denly/ScreenHeader';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDemo } from '@/features/demo/demo-provider';
import { groupScansByDay } from '@/features/demo/demo-state';

import { HistoryScanRow } from './HistoryScanRow';

type HistoryFilter = 'all' | 'saved';

/** History (prototype `history`): every scan grouped by day, or only the saved ones. */
export function HistoryScreen() {
  const { session, history, savedScanIds } = useDemo();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const scans = filter === 'all' ? history : history.filter((scan) => savedScanIds.includes(scan.id));
  const groups = groupScansByDay(scans);

  return (
    <Screen>
      <LargeTitle
        subtitle={
          session?.kind === 'user'
            ? 'Synced to your account.'
            : 'Stored on this phone only. Log in to keep it on every device.'
        }
      >
        History
      </LargeTitle>

      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={(value) => {
          if (value === 'all' || value === 'saved') setFilter(value);
        }}
        accessibilityLabel="Filter history"
      >
        <ToggleGroupItem value="all" accessibilityLabel="All scans">
          <Text>All scans</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="saved" accessibilityLabel="Saved">
          <Text>Saved</Text>
        </ToggleGroupItem>
      </ToggleGroup>

      {groups.length > 0 ? (
        groups.map((group) => (
          <View key={group.day} className="gap-2">
            <SectionHeader title={group.day} variant="small" />
            <ListGroup accessibilityLabel={group.day}>
              {group.scans.map((scan) => (
                <HistoryScanRow key={scan.id} scan={scan} from="history" />
              ))}
            </ListGroup>
          </View>
        ))
      ) : filter === 'saved' ? (
        <EmptyState title="No saved scans yet." body="Tap the bookmark on a result to keep it here." />
      ) : (
        <EmptyState title="No scans yet." body="Scan what's on your counter to start your history." />
      )}
    </Screen>
  );
}
