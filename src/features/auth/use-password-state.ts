import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Password text for a form, cleared whenever the screen loses focus (another screen pushed on
 * top, or leaving the flow) and gone on unmount. Never logged, never stored outside this state.
 */
export function usePasswordState(): [string, (value: string) => void] {
  const [password, setPassword] = useState('');
  useFocusEffect(
    useCallback(() => {
      return () => setPassword('');
    }, []),
  );
  return [password, setPassword];
}
