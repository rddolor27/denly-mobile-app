import { createContext, useContext } from 'react';

export const TOAST_DURATION_MS = 3000;

export type ToastState = {
  /** The message on screen, or null when nothing is shown. */
  message: string | null;
  /** Shows a message (replacing the current one) and announces it to screen readers. */
  show: (message: string) => void;
};

export const ToastContext = createContext<ToastState | null>(null);

/**
 * The app-wide toast. It lives above the navigators so a confirmation shown right before
 * navigating ("Logged in.") still appears on the next screen; each screen renders
 * `<Toast message={toast.message} />` where it fits its layout.
 */
export function useToast(): ToastState {
  const value = useContext(ToastContext);
  if (value === null) throw new Error('useToast() must be used inside <ToastProvider>');
  return value;
}
