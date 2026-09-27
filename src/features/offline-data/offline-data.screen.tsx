import { router } from 'expo-router';
import { Check, Download } from 'lucide-react-native';
import { Fragment, useState } from 'react';
import { View } from 'react-native';

import { EmptyState } from '@/components/denly/EmptyState';
import { Screen } from '@/components/denly/Screen';
import { LargeTitle, ScreenHeader } from '@/components/denly/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { DATA_RELEASE_LABEL, PACK_TIERS, TIERS, type PackTier } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';

import { usePackDownload } from './PackDownloadProvider';
import type { DownloadState } from './use-simulated-download';

function goBack(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/profile');
}

type ProgressCardProps = { download: DownloadState; installedLabel: string | null; onCancel: () => void };

function DownloadProgressCard({ download, installedLabel, onCancel }: ProgressCardProps) {
  const title =
    download.phase === 'verify' ? 'Checking the download…' : `Downloading ${TIERS[download.tier].label}…`;
  return (
    <View className="gap-3 rounded-lg bg-card p-4" accessibilityState={{ busy: true }}>
      <View className="flex-row items-center gap-2.5">
        <Icon as={Download} size={20} className="text-primary" />
        <Text variant="headline" className="flex-1" accessibilityLiveRegion="polite">
          {title}
        </Text>
        <Button variant="link" onPress={onCancel} accessibilityLabel="Cancel download">
          <Text>Cancel</Text>
        </Button>
      </View>
      <Progress value={download.progress} aria-label="Download progress" />
      <Text variant="footnote">
        {installedLabel === null
          ? 'Scans keep working online while this downloads.'
          : `Your ${installedLabel} data stays in use until the new download is checked.`}
      </Text>
    </View>
  );
}

export function OfflineDataScreen() {
  const { online, pack, setPack } = useDemo();
  const toast = useToast();
  const { download, start, cancel } = usePackDownload();
  const [selected, setSelected] = useState<PackTier>(download?.tier ?? (pack === 'none' ? 'medium' : pack));
  const installedLabel = pack === 'none' ? null : TIERS[pack].label;

  function action() {
    if (download) {
      return (
        <DownloadProgressCard
          download={download}
          installedLabel={installedLabel}
          onCancel={() => {
            cancel();
            toast.show('Download cancelled. Nothing changed.');
          }}
        />
      );
    }
    if (selected === pack) return null;
    if (!online) {
      return (
        <EmptyState
          title="You're offline."
          body="Connect to download offline data. Your current data keeps working."
        />
      );
    }
    return (
      <Button onPress={() => start(selected)}>
        <Text>{`Download ${TIERS[selected].label}`}</Text>
      </Button>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} footer={<Toast message={toast.message} />}>
      <ScreenHeader back={{ label: 'Back', onPress: goBack }} />
      <LargeTitle subtitle="Download ingredient data so scans still work without a connection. Offline results don't include the AI summary.">
        Offline data
      </LargeTitle>

      <RadioGroup
        value={selected}
        onValueChange={(value) => {
          const tier = PACK_TIERS.find((t) => t === value);
          if (tier && !download) setSelected(tier);
        }}
        accessibilityLabel="Offline data size"
      >
        {PACK_TIERS.map((id, index) => {
          const tier = TIERS[id];
          const installed = pack === id;
          return (
            <Fragment key={id}>
              {index > 0 ? <Separator className="ml-4 w-auto" /> : null}
              <RadioGroupItem
                value={id}
                disabled={download !== null}
                accessibilityLabel={[
                  tier.label,
                  tier.description,
                  installed ? `Installed, data from ${DATA_RELEASE_LABEL}` : undefined,
                ]
                  .filter(Boolean)
                  .join('. ')}
              >
                <View className="flex-1 gap-[3px]">
                  <Text variant="headline">{tier.label}</Text>
                  <Text variant="subhead">{tier.description}</Text>
                  {installed ? (
                    <View className="mt-1 flex-row items-center gap-1.5">
                      <Icon as={Check} size={16} className="text-primary" />
                      <Text className="text-footnote font-semibold">{`Installed, data from ${DATA_RELEASE_LABEL}`}</Text>
                    </View>
                  ) : null}
                </View>
                <Text variant="subhead">[size] MB</Text>
              </RadioGroupItem>
            </Fragment>
          );
        })}
      </RadioGroup>

      {action()}

      <View className="flex-1" />

      {pack !== 'none' && !download ? (
        <Button
          variant="link"
          className="self-center"
          onPress={() => {
            setPack('none');
            setSelected('medium');
            toast.show('Offline data removed.');
          }}
        >
          <Text className="text-subhead text-muted-foreground">Remove offline data</Text>
        </Button>
      ) : null}

      <Text variant="footnote">
        Downloads use Wi-Fi when available. Sizes are placeholders until the first data release is built.
      </Text>
    </Screen>
  );
}
