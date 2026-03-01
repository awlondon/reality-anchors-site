/**
 * Lightweight error reporting utility.
 *
 * In development, errors are logged to the console.
 * In production, this is the integration point for an external service
 * (e.g. Sentry, LogRocket) — swap the implementation when ready.
 */

interface ErrorContext {
  component?: string;
  action?: string;
  [key: string]: unknown;
}

export function reportError(error: unknown, context?: ErrorContext): void {
  const message = error instanceof Error ? error.message : String(error);

  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorReport]', message, context);
    return;
  }

  // Production: log structured data to console for now.
  // Replace this block with Sentry.captureException(error, { extra: context })
  // or your preferred error monitoring service.
  console.error(JSON.stringify({ error: message, ...context, ts: Date.now() }));
}
