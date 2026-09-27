import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { View, type TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDemo } from '@/features/demo/demo-provider';

import { firstInvalidField, hasErrors, validateRegister, type AuthErrors } from './auth-validation';
import { AuthLayout, SocialSignIn, SwitchAuthLine } from './AuthLayout';
import { FormField } from './FormField';
import { usePasswordState } from './use-password-state';

/** Create account (demo): name, email, password of at least 8 characters. */
export function RegisterScreen() {
  const { signUp } = useDemo();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = usePasswordState();
  const [errors, setErrors] = useState<AuthErrors>({});
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  function submit(): void {
    const next = validateRegister({ name, email, password });
    setErrors(next);
    if (hasErrors(next)) {
      const refs = { name: nameRef, email: emailRef, password: passwordRef };
      const field = firstInvalidField(next, ['name', 'email', 'password']);
      if (field) refs[field].current?.focus();
      return;
    }
    setPassword('');
    signUp({ name: name.trim(), email: email.trim() });
    router.replace('/(tabs)');
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Free. Keeps your scans and saved dishes on every device."
      back={{ label: 'Back', fallback: '/(auth)/welcome' }}
    >
      <View className="gap-4">
        <FormField
          inputRef={nameRef}
          label="Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoComplete="name"
          textContentType="name"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          submitBehavior="submit"
        />
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
          help="At least 8 characters."
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoComplete="new-password"
          textContentType="newPassword"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Text variant="footnote">
          By creating an account you agree to Denly&apos;s Terms and Privacy Policy. Photos never leave your phone.
        </Text>
        <Button onPress={submit}>
          <Text>Create account</Text>
        </Button>
      </View>
      <SocialSignIn />
      <SwitchAuthLine
        prompt="Already have an account?"
        action="Log in"
        onPress={() => router.replace('/(auth)/login')}
      />
    </AuthLayout>
  );
}
