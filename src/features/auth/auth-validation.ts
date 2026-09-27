/**
 * Client-side checks for the demo auth forms. They only help the person fix typos: the real
 * checks belong to the backend once auth exists (open decision #14).
 */

export type AuthFieldName = 'name' | 'email' | 'password';

/** Field errors plus an optional form-level error (the "don't match" banner). */
export type AuthErrors = Partial<Record<AuthFieldName | 'form', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The demo's stand-in for a rejected login: typing this password shows the form error. */
export const DEMO_WRONG_PASSWORD = 'wrong';

export const MIN_PASSWORD_LENGTH = 8;

export function emailError(email: string): string | undefined {
  const value = email.trim();
  if (!value) return 'Enter your email.';
  if (!EMAIL_PATTERN.test(value)) return 'Enter an email like name@example.com.';
  return undefined;
}

function withoutEmpty(errors: Partial<Record<keyof AuthErrors, string | undefined>>): AuthErrors {
  const result: AuthErrors = {};
  for (const [key, value] of Object.entries(errors) as [keyof AuthErrors, string | undefined][]) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

export function validateLogin(input: { email: string; password: string }): AuthErrors {
  const errors = withoutEmpty({
    email: emailError(input.email),
    password: input.password ? undefined : 'Enter a password.',
  });
  if (Object.keys(errors).length === 0 && input.password === DEMO_WRONG_PASSWORD) {
    return { form: "That email and password don't match. Try again or reset your password." };
  }
  return errors;
}

export function validateRegister(input: { name: string; email: string; password: string }): AuthErrors {
  let password: string | undefined;
  if (!input.password) password = 'Enter a password.';
  else if (input.password.length < MIN_PASSWORD_LENGTH) password = 'Use at least 8 characters.';
  return withoutEmpty({
    name: input.name.trim() ? undefined : 'Enter your name.',
    email: emailError(input.email),
    password,
  });
}

export function validateForgot(input: { email: string }): AuthErrors {
  return withoutEmpty({ email: emailError(input.email) });
}

/** The first field with an error, in the order the fields appear on screen. */
export function firstInvalidField(errors: AuthErrors, order: readonly AuthFieldName[]): AuthFieldName | undefined {
  return order.find((field) => errors[field] !== undefined);
}

export function hasErrors(errors: AuthErrors): boolean {
  return Object.keys(errors).length > 0;
}
