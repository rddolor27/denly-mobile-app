import { Bookmark } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ListGroup } from '@/components/denly/ListGroup';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SaveToggleProps = {
  saved: boolean;
  /** "Save scan" / "Save ingredient". */
  saveLabel: string;
  /** "Remove scan from saved" / "Remove from saved". */
  removeLabel: string;
  onPress: () => void;
};

/** The bookmark toggle in a screen header: filled and tinted when saved, labelled by its action. */
export function SaveToggle({ saved, saveLabel, removeLabel, onPress }: SaveToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={saved ? 'bg-secondary' : 'bg-muted'}
      onPress={onPress}
      accessibilityLabel={saved ? removeLabel : saveLabel}
      accessibilityState={{ selected: saved }}
    >
      <Icon
        as={Bookmark}
        size={20}
        className={saved ? 'text-primary' : 'text-foreground'}
        fill={saved ? 'currentColor' : 'none'}
      />
    </Button>
  );
}

export type Definition = { term: string; value: string };

/** Term / value rows in a grouped list ("Filipino · Kangkong", "Category · Leafy green"). */
export function DefinitionList({ rows, className }: { rows: readonly Definition[]; className?: string }) {
  return (
    <ListGroup {...(className ? { className } : {})}>
      {rows.map((row) => (
        <View
          key={row.term}
          className="min-h-12 flex-row items-start gap-3 px-4 py-3"
          accessible
          accessibilityLabel={`${row.term}, ${row.value}`}
        >
          <Text className="w-[88px] shrink-0 pt-px text-subhead text-muted-foreground">{row.term}</Text>
          <Text className="flex-1">{row.value}</Text>
        </View>
      ))}
    </ListGroup>
  );
}

/** A soft grey note box (tips, "Couldn't identify"). */
export function NoteBox({ children, className }: { children: ReactNode; className?: string }) {
  return <View className={cn('flex-row gap-3 rounded-lg bg-muted px-4 py-3.5', className)}>{children}</View>;
}
