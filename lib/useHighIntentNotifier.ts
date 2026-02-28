'use client';

import { useEffect, useRef } from 'react';
import { computeConversionScore, type SessionAggregate } from '@/lib/conversionModel';
import { upsertSalesAlert } from '@/lib/salesNotifications';

export function useHighIntentNotifier(sessionAggregate: SessionAggregate, regimesSeen: string[]) {
  const notified = useRef(false);

  useEffect(() => {
    if (!sessionAggregate) return;
    if (sessionAggregate.totalFormSubmits > 0) return;

    const score = computeConversionScore(sessionAggregate);

    if (score.probability >= 0.75 && !notified.current) {
      notified.current = true;

      const payload = {
        type: 'high_intent',
        probability: score.probability,
        sessionId: sessionAggregate.sessionId,
        maxScrollDepth: sessionAggregate.maxScrollDepth,
        totalDwellMs: sessionAggregate.totalDwellMs,
        regimesSeen,
        ctaClicks: sessionAggregate.totalCtaClicks,
        timestamp: Date.now(),
      };

      // Best-effort: API route only works with a Node server
      void fetch('/api/sales/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      const alert = {
        id: `${sessionAggregate.sessionId}_high_intent`,
        type: 'high_intent' as const,
        sessionId: sessionAggregate.sessionId,
        probability: score.probability,
        maxScrollDepth: sessionAggregate.maxScrollDepth,
        totalDwellMs: sessionAggregate.totalDwellMs,
        createdAt: Date.now(),
      };

      upsertSalesAlert(alert);
      window.dispatchEvent(new CustomEvent('analytics', { detail: { ...alert, type: 'sales_notification', notificationType: alert.type } }));
    }
  }, [regimesSeen, sessionAggregate]);
}
