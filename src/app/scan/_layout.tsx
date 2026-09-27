import { Stack } from 'expo-router';

/** The scan flow: full screen, no tab bar (camera → processing → results → ingredient). */
export default function ScanLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
