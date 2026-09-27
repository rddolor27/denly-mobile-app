import { router } from 'expo-router';
import { CircleCheck, Download } from 'lucide-react-native';

import { ListGroup, ListRow } from '@/components/denly/ListGroup';
import { OfflineBanner } from '@/components/denly/OfflineBanner';
import { Icon } from '@/components/ui/icon';
import { TIERS } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';

function openOfflineData(): void {
  router.push('/settings/offline-data');
}

export function HomeOfflineStatus() {
  const { online, pack } = useDemo();

  if (pack === 'none') {
    if (!online) {
      return (
        <OfflineBanner
          message="You're offline with no offline data. Scans show names only."
          onPress={openOfflineData}
        />
      );
    }
    return (
      <ListGroup>
        <ListRow
          title="Scan without a connection"
          subtitle="Download offline data"
          leading={<Icon as={Download} size={20} className="text-muted-foreground" />}
          onPress={openOfflineData}
        />
      </ListGroup>
    );
  }
  if (!online) {
    return <OfflineBanner message={`You're offline. Scans use your ${TIERS[pack].label} offline data.`} />;
  }
  return (
    <ListGroup>
      <ListRow
        title={`${TIERS[pack].label} offline data is ready`}
        plainTitle
        leading={<Icon as={CircleCheck} size={20} className="text-primary" />}
        onPress={openOfflineData}
        accessibilityHint="Opens offline data settings"
      />
    </ListGroup>
  );
}
