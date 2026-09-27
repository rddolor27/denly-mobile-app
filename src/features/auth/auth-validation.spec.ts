import { emailError, firstInvalidField, validateForgot, validateLogin, validateRegister } from './auth-validation';

describe('auth validation', () => {
  it('asks for an email, then for a well-formed one', () => {
    expect(emailError('  ')).toBe('Enter your email.');
    expect(emailError('rica@')).toBe('Enter an email like name@example.com.');
    expect(emailError(' rica@example.com ')).toBeUndefined();
  });

  it('login needs both fields and reports the demo mismatch only when they are valid', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email.',
      password: 'Enter a password.',
    });
    expect(validateLogin({ email: 'rica@example.com', password: 'wrong' })).toEqual({
      form: "That email and password don't match. Try again or reset your password.",
    });
    expect(validateLogin({ email: 'bad', password: 'wrong' })).toEqual({
      email: 'Enter an email like name@example.com.',
    });
    expect(validateLogin({ email: 'rica@example.com', password: 'secret' })).toEqual({});
  });

  it('register needs a name and at least 8 password characters', () => {
    expect(validateRegister({ name: ' ', email: 'rica@example.com', password: 'short' })).toEqual({
      name: 'Enter your name.',
      password: 'Use at least 8 characters.',
    });
    expect(validateRegister({ name: 'Rica', email: 'rica@example.com', password: 'longenough' })).toEqual({});
  });

  it('forgot password checks the email only', () => {
    expect(validateForgot({ email: '' })).toEqual({ email: 'Enter your email.' });
    expect(validateForgot({ email: 'rica@example.com' })).toEqual({});
  });

  it('finds the first invalid field in screen order', () => {
    expect(firstInvalidField({ password: 'x', email: 'y' }, ['name', 'email', 'password'])).toBe('email');
    expect(firstInvalidField({ form: 'x' }, ['email', 'password'])).toBeUndefined();
  });
});
