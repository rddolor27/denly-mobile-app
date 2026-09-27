import { CameraOff, LayoutGrid, Scan, X, Zap, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { ListGroup } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

function CloseRow({ onClose }: { onClose: () => void }) {
  return (
    <View className="min-h-11 flex-row">
      <Button variant="ghost" size="icon" className="bg-muted" onPress={onClose} accessibilityLabel="Close">
        <Icon as={X} size={18} />
      </Button>
    </View>
  );
}

type Actions = {
  onClose: () => void;
  onImport: () => void;
};

/** Camera permission denied: say so, deep-link to Settings, and offer Import photo instead. */
export function CameraDenied({ onClose, onImport, onOpenSettings }: Actions & { onOpenSettings: () => void }) {
  return (
    <Screen scroll={false} edges={['top', 'bottom']} contentClassName="gap-5 px-6 pb-6 pt-2">
      <CloseRow onClose={onClose} />
      <View className="flex-1 justify-center gap-5">
        <View
          className="size-16 items-center justify-center rounded-sheet bg-secondary"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Icon as={CameraOff} size={30} className="text-primary" />
        </View>
        <Text variant="title1" className="text-[32px] leading-9">
          Camera access is off.
        </Text>
        <Text className="text-muted-foreground">
          Turn it on in Settings to scan. You can still import a photo from your library.
        </Text>
      </View>
      <View className="gap-1.5">
        <Button onPress={onOpenSettings}>
          <Text>Open Settings</Text>
        </Button>
        <Button variant="link" className="self-center" onPress={onImport}>
          <Text>Import photo</Text>
        </Button>
      </View>
    </Screen>
  );
}

function TipRow({ icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <View className="min-h-14 flex-row items-center gap-3.5 px-4 py-2.5" accessible accessibilityLabel={text}>
      <Icon as={icon} size={22} className="text-muted-foreground" />
      <Text className="flex-1">{text}</Text>
    </View>
  );
}

/** "Nothing recognised": what usually fixes it, then Rescan (primary) or Import photo. */
export function NothingRecognised({ onClose, onImport, onRescan }: Actions & { onRescan: () => void }) {
  return (
    <Screen edges={['top', 'bottom']} contentClassName="gap-6">
      <CloseRow onClose={onClose} />
      <View className="gap-2.5 pt-6">
        <Text variant="title1" className="text-[32px] leading-9">
          Nothing recognised.
        </Text>
        <Text className="text-muted-foreground">
          This photo didn&apos;t give Denly enough to go on. One of these usually fixes it.
        </Text>
      </View>
      <ListGroup accessibilityRole="list" accessibilityLabel="Tips">
        <TipRow icon={Scan} text="Move closer so the food fills the frame" />
        <TipRow icon={Zap} text="Use more light, or turn on the torch" />
        <TipRow icon={LayoutGrid} text="Spread items out so they don't overlap" />
      </ListGroup>
      <View className="flex-1" />
      <View className="gap-1.5">
        <Button onPress={onRescan}>
          <Text>Rescan</Text>
        </Button>
        <Button variant="link" className="self-center" onPress={onImport}>
          <Text>Import photo</Text>
        </Button>
      </View>
    </Screen>
  );
}
