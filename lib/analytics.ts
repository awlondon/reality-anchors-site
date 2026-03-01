type EventData = Record<string, string | number | boolean>;

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === 'undefined') return;

  // Forward to GA4 if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, data);
  }

  // Forward to any analytics CustomEvent listeners
  window.dispatchEvent(
    new CustomEvent('analytics', { detail: { type: name, ...data } })
  );

  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics]', name, data);
  }
}
