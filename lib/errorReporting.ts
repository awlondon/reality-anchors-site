/**
 * Lightweight error reporting utility.
 *
 * In development, errors are logged to the console.
 * In production, errors are sent to Sentry if configured,
 * otherwise logged as structured JSON to console.
 */

interface ErrorContext {
  component?: string;
  action?: string;
  [key: string]: unknown;
}

let sentryModule: any = null;
let sentryInitAttempted = false;

async function getSentry() {
  if (sentryInitAttempted) return sentryModule;
  sentryInitAttempted = true;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;

  try {
    // Dynamic import — @sentry/nextjs is an optional dependency.
    // Use a variable to prevent webpack from bundling it at build time.
    const sentryPkg = '@sentry/nextjs';
    const Sentry = await import(/* webpackIgnore: true */ sentryPkg);
    if (!Sentry.isInitialized()) {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
      });
    }
    sentryModule = Sentry;
    return Sentry;
  } catch {
    // @sentry/nextjs not installed — fall back to console
    return null;
  }
}

export function reportError(error: unknown, context?: ErrorContext): void {
  const message = error instanceof Error ? error.message : String(error);

  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorReport]', message, context);
    return;
  }

  // Attempt Sentry reporting (async, non-blocking)
  getSentry().then((Sentry) => {
    if (Sentry) {
      Sentry.captureException(error instanceof Error ? error : new Error(message), {
        extra: context,
      });
    }
  }).catch(() => {
    // Sentry send failed — fall through to console
  });

  // Always log structured data to console as fallback
  console.error(JSON.stringify({ error: message, ...context, ts: Date.now() }));
}

/**
 * Report a warning-level event (not a crash, but noteworthy).
 * Used for monitoring service degradation (e.g. Firebase timeout, EmailJS retry).
 */
export function reportWarning(message: string, context?: ErrorContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Warning]', message, context);
    return;
  }

  getSentry().then((Sentry) => {
    if (Sentry) {
      Sentry.captureMessage(message, { level: 'warning', extra: context });
    }
  }).catch(() => {});

  console.warn(JSON.stringify({ warning: message, ...context, ts: Date.now() }));
}
