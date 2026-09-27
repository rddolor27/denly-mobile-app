import { Bookmark, Camera, Clock, House, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Route names of the tab screens in `src/app/(tabs)/`. */
export type TabKey = 'index' | 'history' | 'saved' | 'profile';

type TabMeta = { key: TabKey; label: string; icon: LucideIcon };

const LEFT_TABS: readonly TabMeta[] = [
  { key: 'index', label: 'Home', icon: House },
  { key: 'history', label: 'History', icon: Clock },
];
const RIGHT_TABS: readonly TabMeta[] = [
  { key: 'saved', label: 'Saved', icon: Bookmark },
  { key: 'profile', label: 'Profile', icon: User },
];

export const TAB_KEYS: readonly TabKey[] = ['index', 'history', 'saved', 'profile'];

export function isTabKey(value: string): value is TabKey {
  return (TAB_KEYS as readonly string[]).includes(value);
}

export type TabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  /** The raised centre button: opens the camera (not a tab). */
  onScanPress: () => void;
};

function TabButton({ tab, selected, onPress }: { tab: TabMeta; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      className="min-h-12 flex-1 items-center gap-[3px] pt-1"
      onPress={onPress}
      role="tab"
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected }}
    >
      <Icon
        as={tab.icon}
        size={24}
        className={selected ? 'text-primary' : 'text-muted-foreground'}
        fill={selected && tab.key === 'saved' ? 'currentColor' : 'none'}
      />
      <Text className={cn('text-caption-2 font-medium', selected ? 'text-primary' : 'text-muted-foreground')}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

/**
 * Denly's bottom tab bar: Home · History · [Scan] · Saved · Profile. Scan is a raised pink
 * button that opens the camera, not a tab. Selected tabs are pink with the word always visible
 * (colour is never the only signal); inactive tabs use the muted text colour (the prototype's
 * fainter grey fails 4.5:1).
 */
export function TabBar({ activeTab, onTabPress, onScanPress }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-start border-t border-border bg-background/95 px-2 pt-1.5"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      role="tablist"
      accessibilityRole="tablist"
    >
      {LEFT_TABS.map((tab) => (
        <TabButton key={tab.key} tab={tab} selected={activeTab === tab.key} onPress={() => onTabPress(tab.key)} />
      ))}
      <Pressable
        className="-mt-[22px] flex-1 items-center gap-[3px]"
        onPress={onScanPress}
        accessibilityRole="button"
        accessibilityLabel="Scan"
        accessibilityHint="Opens the camera"
      >
        <View className="size-[58px] items-center justify-center rounded-full border-4 border-background bg-primary shadow-md shadow-black/30">
          <Icon as={Camera} size={26} className="text-primary-foreground" />
        </View>
        <Text className="text-caption-2 font-semibold text-foreground">Scan</Text>
      </Pressable>
      {RIGHT_TABS.map((tab) => (
        <TabButton key={tab.key} tab={tab} selected={activeTab === tab.key} onPress={() => onTabPress(tab.key)} />
      ))}
    </View>
  );
}
