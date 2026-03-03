'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Reports Core Web Vitals (LCP, FID/INP, CLS) to analytics.
 * Uses the web-vitals library via dynamic import to avoid adding to the main bundle.
 */
export default function WebVitals() {
  useEffect(() => {
    import('web-vitals').then(({ onCLS, onFID, onLCP, onINP, onTTFB }) => {
      const report = (metric: { name: string; value: number; id: string; rating: string }) => {
        trackEvent('web_vital', {
          metric: metric.name,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          id: metric.id,
          rating: metric.rating,
        });
      };

      onCLS(report);
      onFID(report);
      onLCP(report);
      onINP(report);
      onTTFB(report);
    }).catch(() => {
      // web-vitals not available — skip silently
    });
  }, []);

  return null;
}
