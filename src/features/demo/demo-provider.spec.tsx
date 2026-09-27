import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { DemoProvider, useDemo } from './demo-provider';

function wrapper({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>;
}

describe('useDemo', () => {
  it('throws outside the provider', async () => {
    // Silences React's expected error log for this throw.
    const silence = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderHook(() => useDemo())).rejects.toThrow(/DemoProvider/);
    silence.mockRestore();
  });

  it('adds a scan with the current outcome and connection and returns it', async () => {
    const { result } = await renderHook(() => useDemo(), { wrapper });

    await act(() => result.current.setOnline(false));
    let scan: ReturnType<typeof result.current.addScan> = null;
    await act(() => {
      scan = result.current.addScan();
    });

    expect(scan).toMatchObject({ offline: true, summary: null });
    expect(result.current.history[0]).toBe(scan);
  });

  it('adds nothing when the next scan finds nothing', async () => {
    const { result } = await renderHook(() => useDemo(), { wrapper });

    await act(() => result.current.setNextOutcome('empty'));
    let scan: ReturnType<typeof result.current.addScan> = null;
    await act(() => {
      scan = result.current.addScan();
    });

    expect(scan).toBeNull();
    expect(result.current.history).toHaveLength(3);
  });

  it('gives every new scan its own id', async () => {
    const { result } = await renderHook(() => useDemo(), { wrapper });

    await act(() => {
      result.current.addScan();
    });
    await act(() => {
      result.current.addScan();
    });

    const [first, second] = result.current.history;
    expect(first?.id).not.toBe(second?.id);
  });

  it('signs up, then signs out to a guest', async () => {
    const { result } = await renderHook(() => useDemo(), { wrapper });

    await act(() => result.current.signUp({ name: 'Ana', email: 'ana@example.com' }));
    expect(result.current.session).toEqual({ kind: 'user', name: 'Ana', email: 'ana@example.com' });

    await act(() => result.current.signOut());
    expect(result.current.session).toEqual({ kind: 'guest' });
  });
});
