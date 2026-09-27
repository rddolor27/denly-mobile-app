import { router, useLocalSearchParams } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View, type TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { hasErrors, validateForgot, type AuthErrors } from './auth-validation';
import { AuthLayout } from './AuthLayout';
import { FormField } from './FormField';

function backToLogin(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/(auth)/login');
}

/** Reset password (demo): email, then "Check your email". Nothing is sent. */
export function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(typeof params.email === 'string' ? params.email : '');
  const [errors, setErrors] = useState<AuthErrors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const emailRef = useRef<TextInput>(null);

  function submit(): void {
    const next = validateForgot({ email });
    setErrors(next);
    if (hasErrors(next)) {
      emailRef.current?.focus();
      return;
    }
    setSentTo(email.trim());
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll email you a link to choose a new one."
      back={{ label: 'Log in', fallback: '/(auth)/login' }}
    >
      {sentTo === null ? (
        <View className="gap-4">
          <FormField
            inputRef={emailRef}
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={submit}
          />
          <Button onPress={submit}>
            <Text>Send reset link</Text>
          </Button>
        </View>
      ) : (
        <>
          <View className="gap-2 rounded-lg bg-card p-4" role="status" accessibilityLiveRegion="polite">
            <Icon as={Mail} size={20} className="text-detected" />
            <Text variant="headline" role="heading">
              Check your email.
            </Text>
            <Text variant="subhead">
              If an account exists for {sentTo}, a reset link is on its way. It expires in 1 hour.
            </Text>
          </View>
          <Button variant="secondary" onPress={backToLogin}>
            <Text>Back to log in</Text>
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
