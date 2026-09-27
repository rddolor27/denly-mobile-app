import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { NavigationTabBar } from '@/components/denly/NavigationTabBar';

/** Home · History · [Scan] · Saved · Profile. Scan is a button that opens the camera stack. */
export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationTabBar {...props} onScanPress={() => router.push('/scan/camera')} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
