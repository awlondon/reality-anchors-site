type EventData = Record<string, string | number | boolean>;

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === 'undefined') return;

  // Push to GTM dataLayer (primary — GTM routes to GA4, Meta, etc.)
  const dl = (window as unknown as Record<string, unknown>).dataLayer;
  if (Array.isArray(dl)) {
    dl.push({ event: name, ...data });
  }

  // Forward to GA4 gtag if loaded directly (fallback)
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
