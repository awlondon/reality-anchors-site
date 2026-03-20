interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  turnstile?: {
    render: (element: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
  };
}
