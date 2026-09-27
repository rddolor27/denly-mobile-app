import { Circle, CircleCheck } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/lib/use-theme-colors';
import { cn } from '@/lib/utils';

import { ListGroup } from './ListGroup';

export type Stage = { key: string; label: string };

export type StageListProps = {
  /** "Detecting ingredients", "Checking what they are", "Writing your summary". */
  stages: readonly Stage[];
  /** Index of the running stage; earlier ones are done. `stages.length` = all done. */
  currentIndex: number;
};

type StageStatus = 'done' | 'current' | 'waiting';

const STATUS_WORD: Readonly<Record<StageStatus, string>> = {
  done: 'done',
  current: 'in progress',
  waiting: 'waiting',
};

/**
 * Processing progress as named stages (never a bare spinner): done ones get a check and "Done",
 * the running one a native spinner and "…", later ones an empty ring.
 */
export function StageList({ stages, currentIndex }: StageListProps) {
  const { colors } = useThemeColors();
  return (
    <ListGroup accessibilityLabel="Scan progress" accessibilityRole="list">
      {stages.map((stage, index) => {
        const status: StageStatus = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'waiting';
        return (
          <View
            key={stage.key}
            className="min-h-14 flex-row items-center gap-3 px-4"
            accessible
            accessibilityLabel={`${stage.label}, ${STATUS_WORD[status]}`}
            accessibilityState={{ busy: status === 'current' }}
          >
            {status === 'done' ? <Icon as={CircleCheck} size={22} className="text-detected" /> : null}
            {status === 'current' ? <ActivityIndicator size="small" color={colors.primary} /> : null}
            {status === 'waiting' ? <Icon as={Circle} size={22} className="text-muted-foreground" /> : null}
            <Text
              className={cn(
                'flex-1',
                status === 'current' && 'font-semibold',
                status === 'waiting' && 'text-muted-foreground',
              )}
            >
              {status === 'current' ? `${stage.label}…` : stage.label}
            </Text>
            {status === 'done' ? <Text variant="subhead">Done</Text> : null}
          </View>
        );
      })}
    </ListGroup>
  );
}
