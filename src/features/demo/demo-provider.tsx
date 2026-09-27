import { createContext, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react';

import type { DemoScan, DishId, IngredientId, NameLanguage, OfflinePack } from './demo-data';
import {
  createScan,
  demoReducer,
  INITIAL_DEMO_STATE,
  type DemoState,
  type ScanOutcome,
} from './demo-state';

/**
 * In-memory state for the frontend-only app. Screens read and change it only through
 * `useDemo()`; when the backend and real auth exist, this is replaced by TanStack Query hooks
 * and an auth session, screen by screen.
 */
export type DemoActions = {
  signIn: (input: { email: string; name?: string }) => void;
  signUp: (input: { name: string; email: string }) => void;
  continueAsGuest: () => void;
  signOut: () => void;
  deleteAccount: () => void;
  setOnline: (online: boolean) => void;
  setPack: (pack: OfflinePack) => void;
  setNextOutcome: (outcome: ScanOutcome) => void;
  setNameLanguage: (language: NameLanguage) => void;
  /**
   * Finishes a simulated scan with the current `nextOutcome` and connection: prepends it to
   * history and returns it, or returns `null` for "nothing recognised" (history unchanged).
   */
  addScan: () => DemoScan | null;
  /** "Try again" / "Get AI summary": the scan gets its AI summary (online result). */
  loadSummary: (scanId: string) => void;
  toggleSaveScan: (scanId: string) => void;
  toggleSaveDish: (dishId: DishId) => void;
  toggleSaveIngredient: (ingredientId: IngredientId) => void;
};

export type DemoContextValue = DemoState & DemoActions;

const DemoContext = createContext<DemoContextValue | null>(null);

type Props = {
  children: ReactNode;
  /** Tests and the design route can start from another state. */
  initialState?: DemoState;
};

export function DemoProvider({ children, initialState = INITIAL_DEMO_STATE }: Props) {
  const [state, dispatch] = useReducer(demoReducer, initialState);
  const scanCounter = useRef(0);
  const { online, nextOutcome } = state;

  const actions = useMemo<DemoActions>(
    () => ({
      signIn: ({ email, name }) =>
        dispatch(name === undefined ? { type: 'signIn', email } : { type: 'signIn', email, name }),
      signUp: ({ name, email }) => dispatch({ type: 'signUp', name, email }),
      continueAsGuest: () => dispatch({ type: 'continueAsGuest' }),
      signOut: () => dispatch({ type: 'signOut' }),
      deleteAccount: () => dispatch({ type: 'deleteAccount' }),
      setOnline: (online) => dispatch({ type: 'setOnline', online }),
      setPack: (pack) => dispatch({ type: 'setPack', pack }),
      setNextOutcome: (outcome) => dispatch({ type: 'setNextOutcome', outcome }),
      setNameLanguage: (language) => dispatch({ type: 'setNameLanguage', language }),
      addScan: () => {
        scanCounter.current += 1;
        const scan = createScan(`n${Date.now().toString(36)}${scanCounter.current}`, {
          online,
          outcome: nextOutcome,
        });
        if (scan) dispatch({ type: 'addScan', scan });
        return scan;
      },
      loadSummary: (scanId) => dispatch({ type: 'loadSummary', scanId }),
      toggleSaveScan: (scanId) => dispatch({ type: 'toggleSaveScan', scanId }),
      toggleSaveDish: (dishId) => dispatch({ type: 'toggleSaveDish', dishId }),
      toggleSaveIngredient: (ingredientId) => dispatch({ type: 'toggleSaveIngredient', ingredientId }),
    }),
    [online, nextOutcome],
  );

  const value = useMemo<DemoContextValue>(() => ({ ...state, ...actions }), [state, actions]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/** The demo state and actions. Throws outside `DemoProvider` (mounted in the root layout). */
export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (value === null) throw new Error('useDemo() must be used inside <DemoProvider>');
  return value;
}
