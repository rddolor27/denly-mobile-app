import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** True while the system Reduce Motion (Remove animations on Android) setting is on. */
export function useReduceMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {
        // Unknown: keep animations (the default); nothing to report to the user.
      });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}
