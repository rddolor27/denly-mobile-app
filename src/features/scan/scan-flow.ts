import { router } from 'expo-router';

import type { OfflinePack } from '@/features/demo/demo-data';

/**
 * Scan-flow helpers shared by the camera, processing, results and ingredient screens. The flow
 * is its own stack (`src/app/scan/_layout`): leaving it pops back to whatever opened it.
 */

/** Close the scan flow: back to the screen that opened it, or Home when there is none. */
export function leaveScanFlow(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

export type ProcessingStageKey = 'detect' | 'check' | 'write';
export type ProcessingStage = { key: ProcessingStageKey; label: string };

/**
 * The named stages the processing screen shows (prototype `stagesList`): online adds the check
 * and the AI summary; offline with data checks the pack; offline without data only detects.
 */
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

/** Simulated timings from the prototype (`runStages`), in milliseconds. */
export const PROCESSING_TIMING = {
  /** How long the first stage (detecting) runs. */
  firstStage: 1000,
  /** Every later stage. */
  stage: 900,
  /** The check stage when the next outcome is "slow". */
  slowCheck: 4200,
  /** When "Still working…" appears after a slow check starts. */
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

/** The back label and fallback route for a results screen; Home unless `from` says otherwise. */
export function resultsBack(from: unknown): { label: string; route: (typeof ORIGIN_ROUTE)[ResultsOrigin] } {
  const origin: ResultsOrigin = isResultsOrigin(from) ? from : 'home';
  return { label: ORIGIN_LABEL[origin], route: ORIGIN_ROUTE[origin] };
}

/** "5 ingredients found" / "1 ingredient found". */
export function ingredientsFoundTitle(count: number): string {
  return `${count} ${count === 1 ? 'ingredient' : 'ingredients'} found`;
}

/** "3 detected, 1 likely, 1 uncertain" (bands with no items are left out). */
export function bandCountsLine(counts: Readonly<Record<'detected' | 'likely' | 'uncertain', number>>): string {
  const parts: string[] = [];
  if (counts.detected) parts.push(`${counts.detected} detected`);
  if (counts.likely) parts.push(`${counts.likely} likely`);
  if (counts.uncertain) parts.push(`${counts.uncertain} uncertain`);
  return parts.join(', ');
}
