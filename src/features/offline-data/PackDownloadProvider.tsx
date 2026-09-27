import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { TIERS } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { useToast } from '@/features/toast/use-toast';

import { useSimulatedDownload, type SimulatedDownload } from './use-simulated-download';

const PackDownloadContext = createContext<SimulatedDownload | null>(null);

/** Above the navigators so a download keeps going (and installs) after leaving Offline data. */
export function PackDownloadProvider({ children }: { children: ReactNode }) {
  const { setPack } = useDemo();
  const toast = useToast();
  const { download, start, cancel } = useSimulatedDownload((tier) => {
    setPack(tier);
    toast.show(`${TIERS[tier].label} offline data installed.`);
  });

  const value = useMemo<SimulatedDownload>(() => ({ download, start, cancel }), [download, start, cancel]);

  return <PackDownloadContext.Provider value={value}>{children}</PackDownloadContext.Provider>;
}

export function usePackDownload(): SimulatedDownload {
  const value = useContext(PackDownloadContext);
  if (value === null) throw new Error('usePackDownload() must be used inside <PackDownloadProvider>');
  return value;
}
