import { Stack } from 'expo-router';

/** A stack outside (tabs), so the scan flow is full screen without the tab bar. */
export default function ScanLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
