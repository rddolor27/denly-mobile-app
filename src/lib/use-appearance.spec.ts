import { act, renderHook } from '@testing-library/react-native';
import Storage from 'expo-sqlite/kv-store';

import { APPEARANCE_STORAGE_KEY } from './appearance';
import { initAppearance, resetAppearanceForTests, useAppearance } from './use-appearance';

jest.mock('expo-sqlite/kv-store', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: jest.fn((key: string) => store.get(key) ?? null),
      setItemSync: jest.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      clearSync: () => store.clear(),
    },
  };
});
jest.mock('@/lib/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const storage = Storage as unknown as {
  getItemSync: jest.Mock;
  setItemSync: jest.Mock;
  clearSync: () => void;
};

describe('useAppearance', () => {
  beforeEach(() => {
    storage.clearSync();
    storage.getItemSync.mockClear();
    storage.setItemSync.mockClear();
    resetAppearanceForTests();
  });

  it('defaults to System when nothing is stored', async () => {
    const { result } = await renderHook(() => useAppearance());

    expect(result.current.preference).toBe('system');
  });

  it('restores the stored preference and applies it at startup', async () => {
    storage.setItemSync(APPEARANCE_STORAGE_KEY, 'dark');
    initAppearance();

    const { result } = await renderHook(() => useAppearance());

    expect(result.current.preference).toBe('dark');
    expect(result.current.colorScheme).toBe('dark');
  });

  it('persists a new preference and switches the scheme', async () => {
    const { result } = await renderHook(() => useAppearance());

    await act(() => result.current.setPreference('dark'));
    expect(result.current.preference).toBe('dark');
    expect(result.current.colorScheme).toBe('dark');
    expect(storage.setItemSync).toHaveBeenLastCalledWith(APPEARANCE_STORAGE_KEY, 'dark');

    await act(() => result.current.setPreference('light'));
    expect(result.current.colorScheme).toBe('light');
    expect(storage.setItemSync).toHaveBeenLastCalledWith(APPEARANCE_STORAGE_KEY, 'light');
  });

  it('shares one preference between callers', async () => {
    const first = await renderHook(() => useAppearance());
    const second = await renderHook(() => useAppearance());

    await act(() => first.result.current.setPreference('light'));

    expect(second.result.current.preference).toBe('light');
  });

  it('ignores an unknown stored value', async () => {
    storage.setItemSync(APPEARANCE_STORAGE_KEY, 'sepia');

    const { result } = await renderHook(() => useAppearance());

    expect(result.current.preference).toBe('system');
  });

  it('falls back to System when storage cannot be read', async () => {
    storage.getItemSync.mockImplementationOnce(() => {
      throw new Error('disk I/O error');
    });

    const { result } = await renderHook(() => useAppearance());

    expect(result.current.preference).toBe('system');
  });
});
