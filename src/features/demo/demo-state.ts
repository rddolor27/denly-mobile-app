import {
  DEMO_USER,
  DISHES,
  INGREDIENTS,
  INITIAL_HISTORY,
  KITCHEN_SUMMARY,
  kitchenScan,
  type ConfidenceBand,
  type DemoDish,
  type DemoIngredient,
  type DemoScan,
  type DishId,
  type IngredientId,
  type NameLanguage,
  type OfflinePack,
} from './demo-data';

/**
 * DEMO STATE — the prototype's app state as a pure reducer (memory only, reset on relaunch).
 * The session is a local stub: open decision #14 (auth method) comes before real login.
 */

export type DemoUser = { name: string; email: string };

/** `null` = first launch, nobody has chosen yet (the app opens on Welcome). */
export type Session = { kind: 'guest' } | ({ kind: 'user' } & DemoUser) | null;

/** What the next simulated scan returns (the prototype's "What the next scan finds"). */
export type ScanOutcome = 'found' | 'empty' | 'nosummary' | 'slow';

export type DemoState = {
  session: Session;
  online: boolean;
  pack: OfflinePack;
  nextOutcome: ScanOutcome;
  nameLanguage: NameLanguage;
  /** Newest first. */
  history: readonly DemoScan[];
  savedScanIds: readonly string[];
  savedDishIds: readonly DishId[];
  savedIngredientIds: readonly IngredientId[];
};

export const INITIAL_DEMO_STATE: DemoState = {
  session: null,
  online: true,
  pack: 'medium',
  nextOutcome: 'found',
  nameLanguage: 'tl',
  history: INITIAL_HISTORY,
  savedScanIds: ['s3'],
  savedDishIds: ['pinakbet', 'adobo_kangkong'],
  savedIngredientIds: ['kangkong', 'calamansi'],
};

export type DemoAction =
  | { type: 'signIn'; email: string; name?: string }
  | { type: 'signUp'; name: string; email: string }
  | { type: 'continueAsGuest' }
  | { type: 'signOut' }
  | { type: 'deleteAccount' }
  | { type: 'setOnline'; online: boolean }
  | { type: 'setPack'; pack: OfflinePack }
  | { type: 'setNextOutcome'; outcome: ScanOutcome }
  | { type: 'setNameLanguage'; language: NameLanguage }
  | { type: 'addScan'; scan: DemoScan }
  | { type: 'loadSummary'; scanId: string }
  | { type: 'toggleSaveScan'; scanId: string }
  | { type: 'toggleSaveDish'; dishId: DishId }
  | { type: 'toggleSaveIngredient'; ingredientId: IngredientId };

function toggle<T>(list: readonly T[], item: T): readonly T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'signIn': {
      const name =
        action.name ?? (state.session?.kind === 'user' ? state.session.name : DEMO_USER.name);
      return { ...state, session: { kind: 'user', name, email: action.email } };
    }
    case 'signUp':
      return { ...state, session: { kind: 'user', name: action.name, email: action.email } };
    case 'continueAsGuest':
      return { ...state, session: { kind: 'guest' } };
    case 'signOut':
      return { ...state, session: { kind: 'guest' } };
    case 'deleteAccount':
      return { ...state, session: null, savedScanIds: [], savedDishIds: [], savedIngredientIds: [] };
    case 'setOnline':
      return { ...state, online: action.online };
    case 'setPack':
      return { ...state, pack: action.pack };
    case 'setNextOutcome':
      return { ...state, nextOutcome: action.outcome };
    case 'setNameLanguage':
      return { ...state, nameLanguage: action.language };
    case 'addScan':
      return { ...state, history: [action.scan, ...state.history] };
    case 'loadSummary':
      return {
        ...state,
        history: state.history.map((scan) =>
          scan.id === action.scanId
            ? { ...scan, summary: KITCHEN_SUMMARY, summaryFailed: false, offline: false }
            : scan,
        ),
      };
    case 'toggleSaveScan':
      return { ...state, savedScanIds: toggle(state.savedScanIds, action.scanId) };
    case 'toggleSaveDish':
      return { ...state, savedDishIds: toggle(state.savedDishIds, action.dishId) };
    case 'toggleSaveIngredient':
      return { ...state, savedIngredientIds: toggle(state.savedIngredientIds, action.ingredientId) };
  }
}

/**
 * The scan a finished simulated capture produces, or `null` when the outcome is "nothing
 * recognised" (the caller shows the empty state and adds nothing to history). Offline results
 * never carry a summary; `nosummary` online marks the AI step as failed.
 */
export function createScan(
  id: string,
  context: { online: boolean; outcome: ScanOutcome },
): DemoScan | null {
  if (context.outcome === 'empty') return null;
  const scan = kitchenScan(id, 'Just now', !context.online);
  if (!context.online) return { ...scan, summary: null };
  if (context.outcome === 'nosummary') return { ...scan, summary: null, summaryFailed: true };
  return scan;
}

// ---------------------------------------------------------------- selectors (pure)

export function getIngredient(id: IngredientId): DemoIngredient {
  return INGREDIENTS[id];
}

export function getDish(id: DishId): DemoDish {
  return DISHES[id];
}

export function isIngredientId(value: string): value is IngredientId {
  return Object.prototype.hasOwnProperty.call(INGREDIENTS, value);
}

export function findScan(state: DemoState, scanId: string): DemoScan | undefined {
  return state.history.find((scan) => scan.id === scanId);
}

/** The name shown first, in the user's chosen language. */
export function ingredientName(id: IngredientId, language: NameLanguage): string {
  return INGREDIENTS[id].names[language];
}

/** The secondary name under it: English, or Filipino when English is the chosen language. */
export function alternateName(id: IngredientId, language: NameLanguage): string {
  return INGREDIENTS[id].names[language === 'en' ? 'tl' : 'en'];
}

/** "Kangkong, kamatis and 3 more". */
export function scanTitle(scan: DemoScan, language: NameLanguage): string {
  const [first, second] = scan.items;
  if (!first) return 'No ingredients';
  const head = ingredientName(first.ingredientId, language);
  if (!second) return head;
  const title = `${head}, ${ingredientName(second.ingredientId, language).toLowerCase()}`;
  return scan.items.length > 2 ? `${title} and ${scan.items.length - 2} more` : title;
}

export function bandCounts(scan: DemoScan): Readonly<Record<ConfidenceBand, number>> {
  const counts: Record<ConfidenceBand, number> = { detected: 0, likely: 0, uncertain: 0 };
  for (const item of scan.items) counts[item.band] += 1;
  return counts;
}

/** Scans grouped under their day heading, in history order. */
export function groupScansByDay(scans: readonly DemoScan[]): { day: string; scans: DemoScan[] }[] {
  const groups: { day: string; scans: DemoScan[] }[] = [];
  for (const scan of scans) {
    const group = groups.find((g) => g.day === scan.day);
    if (group) group.scans.push(scan);
    else groups.push({ day: scan.day, scans: [scan] });
  }
  return groups;
}

/** Categories, local names and dishes are available (online, or any offline pack installed). */
export function hasRichData(state: Pick<DemoState, 'online' | 'pack'>): boolean {
  return state.online || state.pack !== 'none';
}

/** Ingredient detail depth: the Small pack has names and categories only. */
export function hasFullDetail(state: Pick<DemoState, 'online' | 'pack'>): boolean {
  return state.online || (state.pack !== 'none' && state.pack !== 'small');
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** Filipino greeting by time of day, as in the prototype. */
export function greeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Magandang umaga';
  if (hour < 18) return 'Magandang hapon';
  return 'Magandang gabi';
}
