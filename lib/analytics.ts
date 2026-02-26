type EventData = Record<string, string | number | boolean>;

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === 'undefined') return;

  // Wire to your analytics provider here (e.g. Segment, Plausible, GA4)
  // Example: window.gtag?.('event', name, data);
  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics]', name, data);
  }
}
