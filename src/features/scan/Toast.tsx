import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const TOAST_MS = 3000;

/** A short confirmation ("Scan saved.") shown for 3 s and announced to screen readers. */
export function useToast(): { message: string | null; show: (text: string) => void } {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const show = useCallback((text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(text);
    AccessibilityInfo.announceForAccessibility(text);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  return { message, show };
}

/** The toast pill; place it inside a relative container (it positions itself absolutely). */
export function Toast({ message, className }: { message: string | null; className?: string }) {
  if (!message) return null;
  return (
    <View className={cn('absolute left-4 right-4 items-center', className)} pointerEvents="none">
      <View className="rounded-lg bg-hero px-4 py-3" role="status">
        <Text className="text-center text-subhead text-hero-foreground">{message}</Text>
      </View>
    </View>
  );
}
