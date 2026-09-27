import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Screen } from '@/components/denly/Screen';
import { ScreenHeader } from '@/components/denly/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { DEMO_USER } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';

type Props = {
  title: string;
  subtitle: string;
  /** Back button label and where it goes when there is no screen to go back to. */
  back: { label: string; fallback: '/(auth)/welcome' | '/(auth)/login' };
  children: ReactNode;
};

/** The auth form shell: keyboard avoidance, scroll, back row, large title and subtitle. */
export function AuthLayout({ title, subtitle, back, children }: Props) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader
          back={{
            label: back.label,
            onPress: () => (router.canGoBack() ? router.back() : router.replace(back.fallback)),
          }}
        />
        <View className="gap-2">
          <Text variant="largeTitle">{title}</Text>
          <Text variant="subhead">{subtitle}</Text>
        </View>
        {children}
      </Screen>
    </KeyboardAvoidingView>
  );
}

/** "or", then Continue with Apple / Google. Demo: both sign in as the demo user. */
export function SocialSignIn() {
  const { signIn } = useDemo();
  function continueWith(): void {
    signIn({ email: DEMO_USER.email });
    router.replace('/(tabs)');
  }
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center gap-3" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View className="h-hairline flex-1 bg-border" />
        <Text variant="footnote">or</Text>
        <View className="h-hairline flex-1 bg-border" />
      </View>
      {/* Text-only buttons: lucide has no brand marks and we do not redraw them by hand. */}
      <Button variant="outline" onPress={continueWith}>
        <Text>Continue with Apple</Text>
      </Button>
      <Button variant="outline" onPress={continueWith}>
        <Text>Continue with Google</Text>
      </Button>
    </View>
  );
}

/** "New to Denly? Create account" style line with an inline text button. */
export function SwitchAuthLine({ prompt, action, onPress }: { prompt: string; action: string; onPress: () => void }) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-1">
      <Text variant="subhead">{prompt}</Text>
      <Button variant="link" onPress={onPress}>
        <Text className="text-subhead font-semibold">{action}</Text>
      </Button>
    </View>
  );
}
