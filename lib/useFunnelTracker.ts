'use client';

import { useEffect } from 'react';
import { setLastRegime } from '@/lib/funnelContext';

export function useFunnelTracker() {
  useEffect(() => {
    const track = (detail: Record<string, unknown>) => {
      const stage = detail.stage;
      const regimeId = detail.regimeId;

      if (stage === 'regime_enter' && typeof regimeId === 'string') {
        setLastRegime(regimeId);
      }
    };

    track({ type: 'landing_view', stage: 'landing_view' });

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const detail = customEvent.detail ?? {};
      if (typeof detail.type !== 'string') return;
      if (detail.source === 'funnel_tracker') return;
      track(detail);
    };

    window.addEventListener('analytics', handler as EventListener);
    return () => window.removeEventListener('analytics', handler as EventListener);
  }, []);
}
