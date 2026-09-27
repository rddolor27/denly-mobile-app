import { Redirect } from 'expo-router';

import { useDemo } from '@/features/demo/demo-provider';

/** Start route: Welcome until the person signs in or continues as a guest, then the tabs. */
export default function Index() {
  const { session } = useDemo();
  return <Redirect href={session ? '/(tabs)' : '/(auth)/welcome'} />;
}
