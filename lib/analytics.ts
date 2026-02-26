export function trackEvent(name: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if ((window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", name, data);
  }

  console.log("trackEvent", name, data);
}
