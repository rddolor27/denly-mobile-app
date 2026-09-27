import { router } from 'expo-router';

import { ScanRow } from '@/components/denly/ScanRow';
import type { TileStackItem } from '@/components/denly/TileStack';
import type { DemoScan } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { getIngredient, scanTitle } from '@/features/demo/demo-state';

/** The produce tiles of a scan, in result order (the stack shows the first three). */
export function scanTiles(scan: DemoScan): TileStackItem[] {
  return scan.items.map((item) => {
    const ingredient = getIngredient(item.ingredientId);
    return { key: item.ingredientId, abbreviation: ingredient.abbreviation, color: ingredient.tileColor };
  });
}

/**
 * A `ScanRow` wired to the demo state: title in the chosen name language, the saved mark, and
 * a press that opens the result. Used by Home, History and Saved; `from` names the tab so the
 * result's back button says where it returns to.
 */
export function HistoryScanRow({ scan, from }: { scan: DemoScan; from: 'home' | 'history' | 'saved' }) {
  const { nameLanguage, savedScanIds } = useDemo();
  return (
    <ScanRow
      title={scanTitle(scan, nameLanguage)}
      when={scan.when}
      offline={scan.offline}
      saved={savedScanIds.includes(scan.id)}
      tiles={scanTiles(scan)}
      onPress={() => router.push({ pathname: '/scan/results/[scanId]', params: { scanId: scan.id, from } })}
    />
  );
}
