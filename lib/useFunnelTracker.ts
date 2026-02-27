'use client';

import { useEffect } from 'react';
import { useExperiment } from '@/components/ExperimentProvider';
import { setLastRegime } from '@/lib/funnelContext';
import { hashEvent } from '@/lib/hashEvent';
import { getSessionId } from '@/lib/session';
import { useTrafficAttribution } from '@/lib/useTrafficAttribution';

async function sendEvent(
  detail: Record<string, unknown>,
  experimentId: string,
  variant: string,
  attribution: ReturnType<typeof useTrafficAttribution>
) {
  const sessionId = getSessionId();
  const payload = {
    ...detail,
    experimentId,
    variant,
    sessionId,
    ...attribution,
    timestamp: Date.now(),
    source: 'funnel_tracker',
  };

  const eventId = await hashEvent(payload);

  const response = await fetch('/api/analytics/ingest/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, eventId }),
  });

  if (!response.ok) {
    throw new Error(`analytics_ingest_failed:${response.status}`);
  }

  window.dispatchEvent(new CustomEvent('analytics', { detail: payload }));
}

export function useFunnelTracker() {
  const { experimentId, variant } = useExperiment();
  const attribution = useTrafficAttribution();

  useEffect(() => {
    const track = (detail: Record<string, unknown>) => {
      const stage = detail.stage;
      const regimeId = detail.regimeId;

      if (stage === 'regime_enter' && typeof regimeId === 'string') {
        setLastRegime(regimeId);
      }

      void sendEvent(detail, experimentId, variant, attribution).catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Analytics event failed to send:', error);
        }
      });
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
  }, [attribution, experimentId, variant]);
}
