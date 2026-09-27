import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';

import { TOAST_DURATION_MS, ToastContext, type ToastState } from './use-toast';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    // iOS has no live regions; Android reads the polite live region on the toast itself.
    AccessibilityInfo.announceForAccessibility(next);
    timer.current = setTimeout(() => {
      timer.current = null;
      setMessage(null);
    }, TOAST_DURATION_MS);
  }, []);

  const value = useMemo<ToastState>(() => ({ message, show }), [message, show]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
