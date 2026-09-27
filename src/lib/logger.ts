/**
 * The app's only logging module — nothing else calls `console.*` (enforced by ESLint).
 * Never log secrets, tokens, image bytes or user content. Development builds print every level;
 * release builds keep `warn` and `error` only until a crash/log sink is decided.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Readonly<Record<string, unknown>>;

const LEVEL_ORDER: Readonly<Record<LogLevel, number>> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: LogLevel = __DEV__ ? 'debug' : 'warn';

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;
  const line = `[denly] ${level.toUpperCase()} ${message}`;
  /* eslint-disable no-console -- the logger is the single sanctioned console user */
  const sink =
    level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  /* eslint-enable no-console */
  if (context === undefined) sink(line);
  else sink(line, context);
}

export const logger = {
  debug: (message: string, context?: LogContext): void => write('debug', message, context),
  info: (message: string, context?: LogContext): void => write('info', message, context),
  warn: (message: string, context?: LogContext): void => write('warn', message, context),
  error: (message: string, context?: LogContext): void => write('error', message, context),
};
