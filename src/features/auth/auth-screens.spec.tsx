import { screen, userEvent } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { demoProbe, renderScreen } from '@/test/render-screen';

import { ForgotPasswordScreen } from './forgot-password.screen';
import { LoginScreen } from './login.screen';
import { RegisterScreen } from './register.screen';
import { WelcomeScreen } from './welcome.screen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useLocalSearchParams).mockReturnValue({});
});

describe('WelcomeScreen', () => {
  it('shows the value, the benefits and the three ways in', async () => {
    const user = userEvent.setup();
    await renderScreen(<WelcomeScreen />);

    expect(screen.getByRole('heading', { name: "Know what's on your counter." })).toBeOnTheScreen();
    expect(screen.getByText('Scan in seconds')).toBeOnTheScreen();
    expect(screen.getByText('Keep your history')).toBeOnTheScreen();
    expect(screen.getByText('Save dishes to cook')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Create account' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/register');
    await user.press(screen.getByRole('button', { name: 'Log in' }));
    expect(router.push).toHaveBeenCalledWith('/(auth)/login');
  });

  it('continues as a guest into the tabs', async () => {
    const user = userEvent.setup();
    await renderScreen(<WelcomeScreen />);

    await user.press(screen.getByRole('button', { name: 'Continue without an account' }));

    expect(demoProbe.current?.session).toEqual({ kind: 'guest' });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});

describe('LoginScreen', () => {
  it('shows inline errors under empty fields and stays on the screen', async () => {
    const user = userEvent.setup();
    await renderScreen(<LoginScreen />);

    await user.press(screen.getByRole('button', { name: 'Log in' }));

    expect(screen.getByText('Enter your email.')).toBeOnTheScreen();
    expect(screen.getByText('Enter a password.')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email')).toHaveProp('aria-invalid', true);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('shows the form error banner for the password "wrong"', async () => {
    const user = userEvent.setup();
    await renderScreen(<LoginScreen />);

    await user.type(screen.getByLabelText('Email'), 'rica@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.press(screen.getByRole('button', { name: 'Log in' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      "That email and password don't match. Try again or reset your password.",
    );
    expect(demoProbe.current?.session).toBeNull();
  });

  it('hides the password by default and toggles it with Show / Hide', async () => {
    const user = userEvent.setup();
    await renderScreen(<LoginScreen />);

    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', true);
    await user.press(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', false);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeOnTheScreen();
  });

  it('signs in and opens the tabs', async () => {
    const user = userEvent.setup();
    await renderScreen(<LoginScreen />);

    await user.type(screen.getByLabelText('Email'), 'rica@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret-pass');
    await user.press(screen.getByRole('button', { name: 'Log in' }));

    expect(demoProbe.current?.session).toMatchObject({ kind: 'user', email: 'rica@example.com' });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('signs in with Apple or Google (demo)', async () => {
    const user = userEvent.setup();
    await renderScreen(<LoginScreen />);

    await user.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(demoProbe.current?.session).toMatchObject({ kind: 'user' });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});

describe('RegisterScreen', () => {
  it('asks for a longer password', async () => {
    const user = userEvent.setup();
    await renderScreen(<RegisterScreen />);

    expect(screen.getByText('At least 8 characters.')).toBeOnTheScreen();
    await user.type(screen.getByLabelText('Name'), 'Rica');
    await user.type(screen.getByLabelText('Email'), 'rica@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.press(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Use at least 8 characters.')).toBeOnTheScreen();
    expect(screen.queryByText('At least 8 characters.')).toBeNull();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('creates the account and opens the tabs', async () => {
    const user = userEvent.setup();
    await renderScreen(<RegisterScreen />);

    await user.type(screen.getByLabelText('Name'), 'Rica Dela Cruz');
    await user.type(screen.getByLabelText('Email'), 'rica@example.com');
    await user.type(screen.getByLabelText('Password'), 'longenough');
    await user.press(screen.getByRole('button', { name: 'Create account' }));

    expect(demoProbe.current?.session).toEqual({ kind: 'user', name: 'Rica Dela Cruz', email: 'rica@example.com' });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});

describe('ForgotPasswordScreen', () => {
  it('validates the email, then shows "Check your email"', async () => {
    const user = userEvent.setup();
    await renderScreen(<ForgotPasswordScreen />);

    await user.press(screen.getByRole('button', { name: 'Send reset link' }));
    expect(screen.getByText('Enter your email.')).toBeOnTheScreen();

    await user.type(screen.getByLabelText('Email'), 'rica@example.com');
    await user.press(screen.getByRole('button', { name: 'Send reset link' }));

    expect(screen.getByRole('heading', { name: 'Check your email.' })).toBeOnTheScreen();
    expect(screen.getByText(/If an account exists for rica@example.com/)).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Back to log in' }));
    expect(router.back).toHaveBeenCalled();
  });

  it('starts with the email passed from log in', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ email: 'rica@example.com' });
    await renderScreen(<ForgotPasswordScreen />);

    expect(screen.getByLabelText('Email')).toHaveDisplayValue('rica@example.com');
  });
});
