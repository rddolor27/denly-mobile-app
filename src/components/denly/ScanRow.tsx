import { Bookmark } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';

import { ListRow } from './ListGroup';
import { TileStack, type TileStackItem } from './TileStack';

export type ScanRowProps = {
  /** "Kangkong, kamatis and 3 more". */
  title: string;
  /** "Today, 7:42 AM". */
  when: string;
  /** Adds "· offline result". */
  offline?: boolean;
  saved?: boolean;
  tiles: readonly TileStackItem[];
  onPress: () => void;
};

/** A history / recent-scan row: tile stack, title, time, saved mark, chevron. */
export function ScanRow({ title, when, offline = false, saved = false, tiles, onPress }: ScanRowProps) {
  const subtitle = offline ? `${when} · offline result` : when;
  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      leading={<TileStack tiles={tiles} />}
      trailing={
        saved ? <Icon as={Bookmark} size={18} className="text-primary" fill="currentColor" /> : undefined
      }
      onPress={onPress}
      accessibilityLabel={[title, subtitle, saved ? 'Saved' : undefined].filter(Boolean).join(', ')}
      accessibilityHint="Opens the scan result"
    />
  );
}
