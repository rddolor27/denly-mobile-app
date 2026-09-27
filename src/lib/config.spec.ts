import { ConfigError, parseConfig } from './config';

describe('parseConfig', () => {
  it('accepts an https API URL and strips trailing slashes', () => {
    const config = parseConfig({ EXPO_PUBLIC_API_URL: ' https://api.denly.app/ ' }, false);

    expect(config.apiUrl).toBe('https://api.denly.app');
    expect(config.apiTimeoutMs).toBeGreaterThan(0);
  });

  it('accepts plain http for a local backend in development', () => {
    expect(parseConfig({ EXPO_PUBLIC_API_URL: 'http://192.168.1.10:3000' }, true).apiUrl).toBe(
      'http://192.168.1.10:3000',
    );
  });

  it('rejects plain http outside development', () => {
    expect(() => parseConfig({ EXPO_PUBLIC_API_URL: 'http://api.denly.app' }, false)).toThrow(
      /must use https/,
    );
  });

  it.each([undefined, '', '   '])('fails fast with a clear message when the URL is %p', (value) => {
    expect(() => parseConfig({ EXPO_PUBLIC_API_URL: value }, true)).toThrow(
      /EXPO_PUBLIC_API_URL is not set/,
    );
  });

  it('rejects a value that is not a URL', () => {
    expect(() => parseConfig({ EXPO_PUBLIC_API_URL: 'not a url' }, true)).toThrow(/not a valid URL/);
  });

  it('rejects non-http protocols', () => {
    expect(() => parseConfig({ EXPO_PUBLIC_API_URL: 'ftp://api.denly.app' }, true)).toThrow(
      /must use http or https/,
    );
  });

  it('throws a typed error with a stable code', () => {
    expect.assertions(2);
    try {
      parseConfig({ EXPO_PUBLIC_API_URL: undefined }, true);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as ConfigError).code).toBe('CONFIG_INVALID');
    }
  });
});
