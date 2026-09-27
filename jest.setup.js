// Tests never read a real .env; give the config module a valid value so importing it succeeds.
process.env.EXPO_PUBLIC_API_URL = 'https://api.test.denly.invalid';
