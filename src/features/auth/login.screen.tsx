import { router } from 'expo-router';
import { CircleAlert } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { AccessibilityInfo, View, type TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useDemo } from '@/features/demo/demo-provider';

import { firstInvalidField, hasErrors, validateLogin, type AuthErrors } from './auth-validation';
import { AuthLayout, SocialSignIn, SwitchAuthLine } from './AuthLayout';
import { FormField } from './FormField';
import { usePasswordState } from './use-password-state';

/** Log in (demo): validates like the prototype; the password "wrong" shows the form error. */
export function LoginScreen() {
  const { signIn } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = usePasswordState();
  const [errors, setErrors] = useState<AuthErrors>({});
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  function submit(): void {
    const next = validateLogin({ email, password });
    setErrors(next);
    if (hasErrors(next)) {
      const field = firstInvalidField(next, ['email', 'password']);
      if (field === 'email') emailRef.current?.focus();
      else if (field === 'password') passwordRef.current?.focus();
      else if (next.form) AccessibilityInfo.announceForAccessibility(next.form);
      return;
    }
    setPassword('');
    signIn({ email: email.trim() });
    router.replace('/(tabs)');
  }

  function openForgot(): void {
    const value = email.trim();
    router.push(value ? { pathname: '/(auth)/forgot-password', params: { email: value } } : '/(auth)/forgot-password');
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Your history and saved dishes come with you."
      back={{ label: 'Back', fallback: '/(auth)/welcome' }}
    >
      {errors.form ? (
        <View
          className="flex-row items-center gap-2.5 rounded-lg bg-secondary px-3.5 py-2.5"
          accessible
          role="alert"
          accessibilityLiveRegion="assertive"
        >
          <Icon as={CircleAlert} size={16} className="text-secondary-foreground" />
          <Text className="flex-1 text-subhead text-secondary-foreground">{errors.form}</Text>
        </View>
      ) : null}
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
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
        />
        <FormField
          inputRef={passwordRef}
          label="Password"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button variant="link" className="self-start" onPress={openForgot}>
          <Text>Forgot password?</Text>
        </Button>
        <Button onPress={submit}>
          <Text>Log in</Text>
        </Button>
      </View>
      <SocialSignIn />
      <SwitchAuthLine
        prompt="New to Denly?"
        action="Create account"
        onPress={() => router.replace('/(auth)/register')}
      />
    </AuthLayout>
  );
}
