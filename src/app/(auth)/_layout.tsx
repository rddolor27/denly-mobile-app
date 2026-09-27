import { Stack } from 'expo-router';

/** Welcome, log in, create account, reset password. UI only: the session is a demo stub. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
