import { useCallback, useEffect, useRef, useState } from 'react';

import type { PackTier } from '@/features/demo/demo-data';

/** Percent added per tick. */
export const DOWNLOAD_STEP = 7;
export const DOWNLOAD_TICK_MS = 180;
export const VERIFY_MS = 900;

export type DownloadState = {
  tier: PackTier;
  /** 0 to 100. */
  progress: number;
  phase: 'download' | 'verify';
};

export type SimulatedDownload = {
  download: DownloadState | null;
  start: (tier: PackTier) => void;
  /** Stops without installing anything. */
  cancel: () => void;
};

/**
 * A fake pack download (no network), owned by `PackDownloadProvider`. Timers are cleared on
 * cancel and unmount. The real flow (manifest, SHA-256, atomic swap) replaces this.
 */
export function useSimulatedDownload(onInstalled: (tier: PackTier) => void): SimulatedDownload {
  const [download, setDownload] = useState<DownloadState | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const installed = useRef(onInstalled);

  useEffect(() => {
    installed.current = onInstalled;
  });

  const clearTimers = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    if (timeout.current) clearTimeout(timeout.current);
    interval.current = null;
    timeout.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const start = useCallback(
    (tier: PackTier) => {
      clearTimers();
      let progress = 0;
      setDownload({ tier, progress, phase: 'download' });
      interval.current = setInterval(() => {
        progress = Math.min(100, progress + DOWNLOAD_STEP);
        if (progress < 100) {
          setDownload({ tier, progress, phase: 'download' });
          return;
        }
        clearTimers();
        setDownload({ tier, progress, phase: 'verify' });
        timeout.current = setTimeout(() => {
          timeout.current = null;
          setDownload(null);
          installed.current(tier);
        }, VERIFY_MS);
      }, DOWNLOAD_TICK_MS);
    },
    [clearTimers],
  );

  const cancel = useCallback(() => {
    clearTimers();
    setDownload(null);
  }, [clearTimers]);

  return { download, start, cancel };
}
