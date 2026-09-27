import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** How long a toast stays on screen (the prototype's 3 s). */
export const TOAST_DURATION_MS = 3000;

export type ToastState = {
  /** The message on screen, or null when nothing is shown. */
  message: string | null;
  /** Shows a message (replacing the current one) and announces it to screen readers. */
  show: (message: string) => void;
};

/**
 * A screen-local transient message ("Pinakbet saved.", "Offline data removed."). One per screen;
 * the timer is cleared on unmount. Render it with `<Toast message={toast.message} />`.
 */
export function useToast(): ToastState {
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

  return { message, show };
}
