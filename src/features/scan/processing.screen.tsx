import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View, type ViewStyle } from 'react-native';

import { Screen } from '@/components/denly/Screen';
import { StageList } from '@/components/denly/StageList';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { DemoScan } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import type { ScanOutcome } from '@/features/demo/demo-state';

import { ingredientsFoundTitle, leaveScanFlow, PROCESSING_TIMING, processingStages, type ProcessingStage } from './scan-flow';
import { NothingRecognised } from './ScanStateScreens';

/** Presentation-only produce colours, like the viewfinder's. */
const THUMB_SHAPES: readonly ViewStyle[] = [
  { left: 18, top: 44, width: 64, height: 20, backgroundColor: '#4A6A35', transform: [{ rotate: '-12deg' }] },
  { left: 88, top: 62, width: 32, height: 32, backgroundColor: '#8A3A2C' },
  { left: 24, top: 108, width: 34, height: 36, backgroundColor: '#A58D63' },
  { left: 70, top: 128, width: 54, height: 8, borderRadius: 6, backgroundColor: '#5E7A33', transform: [{ rotate: '-9deg' }] },
];

function PhotoThumbnail() {
  return (
    <View
      className="h-[186px] w-[140px] overflow-hidden rounded-lg bg-camera"
      accessible
      role="img"
      accessibilityLabel="Your photo"
    >
      {THUMB_SHAPES.map((shape, index) => (
        <View key={index} className="absolute rounded-full" style={shape} />
      ))}
    </View>
  );
}

function cancelScan(): void {
  router.replace({ pathname: '/scan/camera', params: { notice: 'cancelled' } });
}

type RunProps = {
  onEmpty: () => void;
};

/** A simulated scan run. The connection, outcome and session are read once, when the run starts. */
function ScanRun({ onEmpty }: RunProps) {
  const demo = useDemo();
  const [run] = useState<{ stages: ProcessingStage[]; outcome: ScanOutcome; signedIn: boolean }>(() => ({
    stages: processingStages({ online: demo.online, pack: demo.pack }),
    outcome: demo.nextOutcome,
    signedIn: demo.session?.kind === 'user',
  }));
  const [current, setCurrent] = useState(0);
  const [slow, setSlow] = useState(false);
  const addScanRef = useRef<() => DemoScan | null>(demo.addScan);
  const onEmptyRef = useRef(onEmpty);

  useEffect(() => {
    addScanRef.current = demo.addScan;
    onEmptyRef.current = onEmpty;
  });

  useEffect(() => {
    const { stages, outcome, signedIn } = run;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number): void => {
      timers.push(setTimeout(fn, ms));
    };
    let index = 0;

    function showEmpty(): void {
      AccessibilityInfo.announceForAccessibility('Nothing recognised');
      onEmptyRef.current();
    }

    function finish(): void {
      const scan = addScanRef.current();
      if (!scan) {
        showEmpty();
        return;
      }
      setCurrent(stages.length);
      AccessibilityInfo.announceForAccessibility(
        `Scan complete. ${ingredientsFoundTitle(scan.items.length)}.${signedIn ? ' Added to your history.' : ''}`,
      );
      router.replace({ pathname: '/scan/results/[scanId]', params: { scanId: scan.id } });
    }

    function step(): void {
      index += 1;
      if (index === 1 && outcome === 'empty') {
        showEmpty();
        return;
      }
      if (index >= stages.length) {
        finish();
        return;
      }
      setCurrent(index);
      let wait: number = PROCESSING_TIMING.stage;
      if (outcome === 'slow' && stages[index]?.key === 'check') {
        wait = PROCESSING_TIMING.slowCheck;
        later(() => {
          setSlow(true);
          AccessibilityInfo.announceForAccessibility('Still working');
        }, PROCESSING_TIMING.slowNotice);
      }
      later(step, wait);
    }

    later(step, PROCESSING_TIMING.firstStage);
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return (
    <Screen edges={['top', 'bottom']} contentClassName="gap-6">
      <View className="min-h-11 flex-row">
        <Button variant="link" className="px-2" onPress={cancelScan} accessibilityLabel="Cancel scan">
          <Text>Cancel</Text>
        </Button>
      </View>
      <View className="items-center gap-5 pt-2">
        <PhotoThumbnail />
        <Text variant="title1">Scanning…</Text>
      </View>
      <View accessibilityState={{ busy: true }}>
        <StageList stages={run.stages} currentIndex={current} />
      </View>
      {slow ? (
        <Text variant="subhead" className="text-center" accessibilityLiveRegion="polite">
          Still working… This is taking longer than usual.
        </Text>
      ) : null}
      <View className="flex-1" />
      <View className="flex-row items-center justify-center gap-2 px-2">
        <Icon as={Lock} size={16} className="text-muted-foreground" />
        <Text variant="footnote" className="shrink text-center">
          Your photo stays on this phone. Only the ingredient names are sent.
        </Text>
      </View>
    </Screen>
  );
}

export function ProcessingScreen() {
  const [runId, setRunId] = useState(0);
  const [empty, setEmpty] = useState(false);

  if (empty) {
    return (
      <NothingRecognised
        onClose={leaveScanFlow}
        onRescan={() => router.replace('/scan/camera')}
        onImport={() => {
          setEmpty(false);
          setRunId((id) => id + 1);
        }}
      />
    );
  }
  return <ScanRun key={runId} onEmpty={() => setEmpty(true)} />;
}
