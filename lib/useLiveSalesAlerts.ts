'use client';

import { useEffect, useState } from 'react';
import { acknowledgeSalesAlert, loadSalesAlerts, type SalesAlert, upsertSalesAlert } from '@/lib/salesNotifications';

export function useLiveSalesAlerts() {
  const [alerts, setAlerts] = useState<SalesAlert[]>([]);

  useEffect(() => {
    setAlerts(loadSalesAlerts().filter((a) => !a.acknowledged).slice(0, 5));

    const onAnalytics = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const d = custom.detail ?? {};
      if (d.type !== 'sales_notification') return;

      const notificationType: SalesAlert['type'] = d.notificationType === 'form_submit' ? 'form_submit' : 'high_intent';

      const next: SalesAlert = {
        id: String(d.id ?? `${d.sessionId ?? 'unknown'}_${notificationType}`),
        type: notificationType,
        sessionId: String(d.sessionId ?? 'unknown'),
        probability: typeof d.probability === 'number' ? d.probability : undefined,
        maxScrollDepth: typeof d.maxScrollDepth === 'number' ? d.maxScrollDepth : undefined,
        totalDwellMs: typeof d.totalDwellMs === 'number' ? d.totalDwellMs : undefined,
        createdAt: typeof d.createdAt === 'number' ? d.createdAt : Date.now(),
      };

      upsertSalesAlert(next);
      setAlerts(loadSalesAlerts().filter((a) => !a.acknowledged).slice(0, 5));
    };

    window.addEventListener('analytics', onAnalytics as EventListener);
    return () => window.removeEventListener('analytics', onAnalytics as EventListener);
  }, []);

  const acknowledge = (id: string) => {
    acknowledgeSalesAlert(id);
    setAlerts(loadSalesAlerts().filter((a) => !a.acknowledged).slice(0, 5));
  };

  return { alerts, acknowledge };
}
