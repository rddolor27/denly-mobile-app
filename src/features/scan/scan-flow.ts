import { router } from 'expo-router';

import type { OfflinePack } from '@/features/demo/demo-data';

/** The scan flow is its own stack, so closing it pops back to whatever opened it (Home when nothing did). */
export function leaveScanFlow(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

export type ProcessingStageKey = 'detect' | 'check' | 'write';
export type ProcessingStage = { key: ProcessingStageKey; label: string };

export function processingStages(context: { online: boolean; pack: OfflinePack }): ProcessingStage[] {
  const stages: ProcessingStage[] = [{ key: 'detect', label: 'Detecting ingredients' }];
  if (context.online) {
    stages.push({ key: 'check', label: 'Checking what they are' });
    stages.push({ key: 'write', label: 'Writing your summary' });
  } else if (context.pack !== 'none') {
    stages.push({ key: 'check', label: 'Checking your offline data' });
  }
  return stages;
}

/** Simulated stage timings, in milliseconds. */
export const PROCESSING_TIMING = {
  firstStage: 1000,
  stage: 900,
  slowCheck: 4200,
  slowNotice: 1800,
} as const;

/** Where a results screen was opened from (search param `from`), for its back label. */
export type ResultsOrigin = 'home' | 'history' | 'saved';

const ORIGIN_LABEL: Readonly<Record<ResultsOrigin, string>> = {
  home: 'Home',
  history: 'History',
  saved: 'Saved',
};

const ORIGIN_ROUTE = {
  home: '/(tabs)',
  history: '/(tabs)/history',
  saved: '/(tabs)/saved',
} as const;

function isResultsOrigin(value: unknown): value is ResultsOrigin {
  return value === 'home' || value === 'history' || value === 'saved';
}

/** Home unless `from` says otherwise; `route` is the fallback when there is nothing to go back to. */
export function resultsBack(from: unknown): { label: string; route: (typeof ORIGIN_ROUTE)[ResultsOrigin] } {
  const origin: ResultsOrigin = isResultsOrigin(from) ? from : 'home';
  return { label: ORIGIN_LABEL[origin], route: ORIGIN_ROUTE[origin] };
}

export function ingredientsFoundTitle(count: number): string {
  return `${count} ${count === 1 ? 'ingredient' : 'ingredients'} found`;
}

export function bandCountsLine(counts: Readonly<Record<'detected' | 'likely' | 'uncertain', number>>): string {
  const parts: string[] = [];
  if (counts.detected) parts.push(`${counts.detected} detected`);
  if (counts.likely) parts.push(`${counts.likely} likely`);
  if (counts.uncertain) parts.push(`${counts.uncertain} uncertain`);
  return parts.join(', ');
}
