import { INITIAL_HISTORY, KITCHEN_SUMMARY } from './demo-data';
import {
  alternateName,
  bandCounts,
  createScan,
  demoReducer,
  greeting,
  groupScansByDay,
  hasFullDetail,
  hasRichData,
  INITIAL_DEMO_STATE,
  initials,
  scanTitle,
  type DemoState,
} from './demo-state';

const signedIn: DemoState = {
  ...INITIAL_DEMO_STATE,
  session: { kind: 'user', name: 'Rica Dela Cruz', email: 'rica@example.com' },
};

describe('demoReducer: session', () => {
  it('starts with nobody signed in so the app opens on Welcome', () => {
    expect(INITIAL_DEMO_STATE.session).toBeNull();
  });

  it('signs up with the given name and email', () => {
    const next = demoReducer(INITIAL_DEMO_STATE, { type: 'signUp', name: 'Ana', email: 'ana@example.com' });
    expect(next.session).toEqual({ kind: 'user', name: 'Ana', email: 'ana@example.com' });
  });

  it('signs in with the demo name when none is given', () => {
    const next = demoReducer(INITIAL_DEMO_STATE, { type: 'signIn', email: 'x@example.com' });
    expect(next.session).toEqual({ kind: 'user', name: 'Rica Dela Cruz', email: 'x@example.com' });
  });

  it('continues as a guest and signs out to a guest', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'continueAsGuest' }).session).toEqual({ kind: 'guest' });
    expect(demoReducer(signedIn, { type: 'signOut' }).session).toEqual({ kind: 'guest' });
  });

  it('keeps history and saved items on sign-out', () => {
    const next = demoReducer(signedIn, { type: 'signOut' });
    expect(next.history).toBe(signedIn.history);
    expect(next.savedDishIds).toEqual(signedIn.savedDishIds);
  });

  it('clears the session and every saved item when the account is deleted', () => {
    const next = demoReducer(signedIn, { type: 'deleteAccount' });
    expect(next.session).toBeNull();
    expect(next.savedScanIds).toEqual([]);
    expect(next.savedDishIds).toEqual([]);
    expect(next.savedIngredientIds).toEqual([]);
  });
});

describe('demoReducer: saving', () => {
  it('toggles a dish in and out of saved', () => {
    const removed = demoReducer(INITIAL_DEMO_STATE, { type: 'toggleSaveDish', dishId: 'pinakbet' });
    expect(removed.savedDishIds).not.toContain('pinakbet');
    const added = demoReducer(removed, { type: 'toggleSaveDish', dishId: 'pinakbet' });
    expect(added.savedDishIds).toContain('pinakbet');
  });

  it('toggles scans and ingredients', () => {
    const scans = demoReducer(INITIAL_DEMO_STATE, { type: 'toggleSaveScan', scanId: 's1' });
    expect(scans.savedScanIds).toEqual(['s3', 's1']);
    const ingredients = demoReducer(INITIAL_DEMO_STATE, { type: 'toggleSaveIngredient', ingredientId: 'kangkong' });
    expect(ingredients.savedIngredientIds).toEqual(['calamansi']);
  });
});

describe('demoReducer: settings and scans', () => {
  it('sets connection, pack, outcome and name language', () => {
    let state = demoReducer(INITIAL_DEMO_STATE, { type: 'setOnline', online: false });
    state = demoReducer(state, { type: 'setPack', pack: 'none' });
    state = demoReducer(state, { type: 'setNextOutcome', outcome: 'slow' });
    state = demoReducer(state, { type: 'setNameLanguage', language: 'ceb' });
    expect(state).toMatchObject({ online: false, pack: 'none', nextOutcome: 'slow', nameLanguage: 'ceb' });
  });

  it('prepends a new scan to history', () => {
    const scan = createScan('n1', { online: true, outcome: 'found' });
    if (!scan) throw new Error('expected a scan');
    const next = demoReducer(INITIAL_DEMO_STATE, { type: 'addScan', scan });
    expect(next.history.map((s) => s.id)).toEqual(['n1', 's1', 's2', 's3']);
  });

  it('loads the AI summary for a scan that had none', () => {
    const next = demoReducer(INITIAL_DEMO_STATE, { type: 'loadSummary', scanId: 's2' });
    const s2 = next.history.find((s) => s.id === 's2');
    expect(s2).toMatchObject({ summary: KITCHEN_SUMMARY, summaryFailed: false, offline: false });
  });
});

describe('createScan', () => {
  it('returns a full online result for "found" and "slow"', () => {
    for (const outcome of ['found', 'slow'] as const) {
      const scan = createScan('n', { online: true, outcome });
      expect(scan).toMatchObject({ when: 'Just now', offline: false, summary: KITCHEN_SUMMARY, summaryFailed: false });
    }
  });

  it('returns nothing for "empty"', () => {
    expect(createScan('n', { online: true, outcome: 'empty' })).toBeNull();
  });

  it('marks the AI summary as failed for "nosummary" online', () => {
    expect(createScan('n', { online: true, outcome: 'nosummary' })).toMatchObject({
      summary: null,
      summaryFailed: true,
    });
  });

  it('returns an offline result without a summary when offline', () => {
    expect(createScan('n', { online: false, outcome: 'found' })).toMatchObject({
      offline: true,
      summary: null,
      summaryFailed: false,
    });
  });
});

describe('selectors', () => {
  const [s1, s2] = INITIAL_HISTORY;
  if (!s1 || !s2) throw new Error('fixture history is missing');

  it('titles a scan in the chosen language', () => {
    expect(scanTitle(s1, 'tl')).toBe('Kangkong, kamatis and 3 more');
    expect(scanTitle(s1, 'en')).toBe('Water spinach, tomato and 3 more');
    expect(scanTitle({ ...s2, items: s2.items.slice(0, 2) }, 'tl')).toBe('Bangus, kalamansi');
  });

  it('shows English second, or Filipino when English is chosen', () => {
    expect(alternateName('kangkong', 'tl')).toBe('Water spinach');
    expect(alternateName('kangkong', 'ceb')).toBe('Water spinach');
    expect(alternateName('kangkong', 'en')).toBe('Kangkong');
  });

  it('counts confidence bands', () => {
    expect(bandCounts(s1)).toEqual({ detected: 3, likely: 1, uncertain: 1 });
  });

  it('groups history by day in order', () => {
    expect(groupScansByDay(INITIAL_HISTORY).map((g) => g.day)).toEqual(['Today', 'Yesterday', 'Earlier this week']);
  });

  it('knows how much data the phone has', () => {
    expect(hasRichData({ online: false, pack: 'none' })).toBe(false);
    expect(hasRichData({ online: false, pack: 'small' })).toBe(true);
    expect(hasFullDetail({ online: false, pack: 'small' })).toBe(false);
    expect(hasFullDetail({ online: false, pack: 'medium' })).toBe(true);
    expect(hasFullDetail({ online: true, pack: 'none' })).toBe(true);
  });

  it('builds initials and greetings', () => {
    expect(initials('Rica Dela Cruz')).toBe('RD');
    expect(initials('ana')).toBe('A');
    expect(greeting(new Date(2026, 8, 23, 7))).toBe('Magandang umaga');
    expect(greeting(new Date(2026, 8, 23, 14))).toBe('Magandang hapon');
    expect(greeting(new Date(2026, 8, 23, 20))).toBe('Magandang gabi');
  });
});
