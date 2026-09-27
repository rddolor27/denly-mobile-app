import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Flashlight, FlashlightOff, Image as ImageIcon, X } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/denly/OfflineBanner';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useDemo } from '@/features/demo/demo-provider';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

import { leaveScanFlow } from './scan-flow';
import { CameraDenied } from './ScanStateScreens';
import { useReduceMotion } from './use-reduce-motion';
import { LIVE_DETECTIONS, Viewfinder } from './Viewfinder';

/** How long the simulated detector takes before live boxes appear. */
export const WARM_UP_MS = 450;
const FLASH_MS = 180;

export const SCAN_CANCELLED_MESSAGE = 'Scan cancelled. The photo was discarded.';

function goToProcessing(): void {
  router.replace('/scan/processing');
}

function openSettings(): void {
  Linking.openSettings().catch((error: unknown) => {
    logger.warn('Could not open the app settings', { error: error instanceof Error ? error.message : 'unknown' });
  });
}

function GlassButton({
  label,
  onPress,
  selected,
  children,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <Pressable
      className={cn(
        'size-11 items-center justify-center rounded-full active:opacity-70',
        selected ? 'bg-secondary' : 'bg-camera/65',
      )}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...(selected === undefined ? {} : { accessibilityState: { selected } })}
    >
      {children}
    </Pressable>
  );
}

function LiveCamera({ notice }: { notice: string | undefined }) {
  const { online, pack, nameLanguage } = useDemo();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const toast = useToast();
  const [warmed, setWarmed] = useState(false);
  const [torch, setTorch] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [flash] = useState(() => new Animated.Value(0));
  const captureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { show } = toast;

  useEffect(() => {
    const timer = setTimeout(() => setWarmed(true), WARM_UP_MS);
    return () => {
      clearTimeout(timer);
      if (captureTimer.current) clearTimeout(captureTimer.current);
    };
  }, []);

  useEffect(() => {
    if (notice === 'cancelled') show(SCAN_CANCELLED_MESSAGE);
  }, [notice, show]);

  function capture(): void {
    if (capturing) return;
    setCapturing(true);
    if (reduceMotion) {
      goToProcessing();
      return;
    }
    flash.setValue(0.85);
    Animated.timing(flash, { toValue: 0, duration: FLASH_MS, useNativeDriver: true }).start();
    captureTimer.current = setTimeout(goToProcessing, FLASH_MS);
  }

  const inView = warmed ? `${LIVE_DETECTIONS.length} items in view` : 'Looking for food…';

  return (
    <View className="flex-1 bg-camera">
      <StatusBar style="light" />
      <Viewfinder language={nameLanguage} showDetections={warmed} reduceMotion={reduceMotion} torch={torch} />

      <View className="absolute left-4 right-4 flex-row items-center justify-between gap-2" style={{ top: insets.top + 4 }}>
        <GlassButton label="Close camera" onPress={leaveScanFlow}>
          <Icon as={X} size={18} className="text-camera-foreground" />
        </GlassButton>
        <View className="shrink rounded-full bg-camera/65 px-3.5 py-2">
          <Text role="heading" className="text-subhead text-camera-foreground" numberOfLines={1}>
            Fill the frame with the food
          </Text>
        </View>
        <GlassButton
          label={torch ? 'Turn off torch' : 'Turn on torch'}
          selected={torch}
          onPress={() => setTorch((value) => !value)}
        >
          <Icon as={torch ? Flashlight : FlashlightOff} size={20} className={torch ? 'text-primary' : 'text-camera-foreground'} />
        </GlassButton>
      </View>

      {online ? null : (
        <View className="absolute left-4 right-4" style={{ top: insets.top + 60 }}>
          <OfflineBanner
            tone="camera"
            message={pack === 'none' ? 'Offline. Only ingredient names will show.' : 'Offline. Results use your offline data.'}
          />
        </View>
      )}

      <View className="absolute left-0 right-0 top-[75%] items-center" pointerEvents="none">
        <View className="rounded-full bg-camera/65 px-3.5 py-2" accessibilityLiveRegion="polite">
          <Text className="text-subhead text-camera-foreground">{inView}</Text>
        </View>
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 min-h-[154px] flex-row items-center justify-between bg-camera/85 px-8 pt-[18px]"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 18 }}
      >
        <Pressable
          className="w-16 items-center gap-1.5 active:opacity-70"
          onPress={goToProcessing}
          accessibilityRole="button"
          accessibilityLabel="Import photo"
        >
          <View className="size-12 items-center justify-center rounded-lg bg-camera-foreground/15">
            <Icon as={ImageIcon} size={22} className="text-camera-foreground" />
          </View>
          <Text className="text-caption text-camera-foreground">Import</Text>
        </Pressable>
        <Pressable
          className="size-20 items-center justify-center rounded-full border-4 border-camera-foreground"
          onPress={capture}
          disabled={capturing}
          accessibilityRole="button"
          accessibilityLabel="Take photo and scan"
          accessibilityState={{ disabled: capturing }}
        >
          {({ pressed }) => (
            <View className={cn('size-16 rounded-full bg-camera-foreground', pressed && 'opacity-80')} />
          )}
        </Pressable>
        <View className="w-16" />
      </View>

      <Animated.View
        className="absolute inset-0 bg-camera-foreground"
        style={{ opacity: flash }}
        pointerEvents="none"
      />
      <Toast message={toast.message} className="bottom-[170px]" />
    </View>
  );
}

/** `?state=denied` shows "Camera access is off"; `?notice=cancelled` confirms a cancelled scan. */
export function CameraScreen() {
  const params = useLocalSearchParams<{ state?: string; notice?: string }>();
  if (params.state === 'denied') {
    return <CameraDenied onClose={leaveScanFlow} onImport={goToProcessing} onOpenSettings={openSettings} />;
  }
  return <LiveCamera notice={typeof params.notice === 'string' ? params.notice : undefined} />;
}
