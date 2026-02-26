'use client';

import { useEffect, useMemo, useState } from 'react';
import { clearEvents, ExecEvent, ExecSummary, loadEvents, saveEvents, summarize } from '@/lib/execAnalytics';
import type { SessionAggregate } from '@/lib/conversionModel';

type Props = {
  children: (args: {
    events: ExecEvent[];
    summary: ExecSummary;
    sessions: SessionAggregate[];
    reset: () => void;
  }) => React.ReactNode;
};

function aggregateSessions(events: ExecEvent[]): SessionAggregate[] {
  const sessions = new Map<string, SessionAggregate>();

  for (const e of events) {
    if (!e.sessionId) continue;
    const s = sessions.get(e.sessionId) ?? {
      sessionId: e.sessionId,
      maxScrollDepth: 0,
      totalDwellMs: 0,
      regimeCount: 0,
      totalCtaClicks: 0,
      totalFormViews: 0,
      totalFormSubmits: 0,
      kpiReveals: 0,
    };

    if (e.type === 'scroll_depth') s.maxScrollDepth = Math.max(s.maxScrollDepth, e.depthPercent);
    if (e.type === 'regime_enter') s.regimeCount += 1;
    if (e.type === 'regime_exit') s.totalDwellMs += e.dwellTimeMs ?? 0;
    if (e.type === 'cta_click') s.totalCtaClicks += 1;
    if (e.type === 'lead_form_view') s.totalFormViews += 1;
    if (e.type === 'lead_form_submit') s.totalFormSubmits += 1;
    if (e.type === 'kpi_reveal') s.kpiReveals += 1;

    sessions.set(e.sessionId, s);
  }

  return Array.from(sessions.values());
}

function toExecEvent(detail: Record<string, unknown>): ExecEvent | null {
  const type = typeof detail.type === 'string' ? detail.type : null;
  if (!type) return null;

  const timestamp = typeof detail.timestamp === 'number' ? detail.timestamp : Date.now();
  const common = {
    timestamp,
    sessionId: typeof detail.sessionId === 'string' ? detail.sessionId : undefined,
    experimentId: typeof detail.experimentId === 'string' ? detail.experimentId : undefined,
    variant: detail.variant === 'A' || detail.variant === 'B' || detail.variant === 'C' ? detail.variant : undefined,
    trafficSource: typeof detail.trafficSource === 'string' ? detail.trafficSource : undefined,
    utmSource: typeof detail.utmSource === 'string' ? detail.utmSource : undefined,
    utmMedium: typeof detail.utmMedium === 'string' ? detail.utmMedium : undefined,
    utmCampaign: typeof detail.utmCampaign === 'string' ? detail.utmCampaign : undefined,
    referrerHost: typeof detail.referrerHost === 'string' ? detail.referrerHost : undefined,
  } as const;

  const mappedType = type === 'regime_kpi_reveal' ? 'kpi_reveal' : type;

  if (mappedType === 'regime_enter' && typeof detail.regimeId === 'string') {
    return { type: 'regime_enter', regimeId: detail.regimeId, stage: String(detail.stage ?? ''), ...common };
  }
  if (mappedType === 'regime_exit' && typeof detail.regimeId === 'string') {
    return { type: 'regime_exit', regimeId: detail.regimeId, dwellTimeMs: typeof detail.dwellTimeMs === 'number' ? detail.dwellTimeMs : 0, ...common };
  }
  if (mappedType === 'scroll_depth') {
    return { type: 'scroll_depth', depthPercent: typeof detail.depthPercent === 'number' ? detail.depthPercent : Number(detail.scrollDepth ?? 0), ...common };
  }
  if (mappedType === 'cta_click') return { type: 'cta_click', regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, ...common };
  if (mappedType === 'lead_form_view') return { type: 'lead_form_view', regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, ...common };
  if (mappedType === 'lead_form_submit') return { type: 'lead_form_submit', regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, ...common };
  if (mappedType === 'kpi_reveal') return { type: 'kpi_reveal', regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, kpiIndex: typeof detail.kpiIndex === 'number' ? detail.kpiIndex : undefined, value: typeof detail.value === 'number' ? detail.value : undefined, ...common };
  if (mappedType === 'experiment_exposure') return { type: 'experiment_exposure', ...common };
  if (mappedType === 'narrative_reorder') return { type: 'narrative_reorder', intent: typeof detail.intent === 'string' ? detail.intent : undefined, ...common };

  return null;
}

export default function ExecutiveAnalyticsProvider({ children }: Props) {
  const [events, setEvents] = useState<ExecEvent[]>([]);

  useEffect(() => setEvents(loadEvents()), []);

  useEffect(() => {
    const onAnalytics = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const detail = custom.detail ?? {};
      if (detail.source !== 'funnel_tracker') return;
      const evt = toExecEvent(detail);
      if (!evt) return;

      setEvents((prev) => {
        const next = [...prev, evt].slice(-5000);
        saveEvents(next);
        return next;
      });
    };

    window.addEventListener('analytics', onAnalytics as EventListener);
    return () => window.removeEventListener('analytics', onAnalytics as EventListener);
  }, []);

  const summary = useMemo(() => summarize(events), [events]);
  const sessions = useMemo(() => aggregateSessions(events), [events]);

  const reset = () => {
    clearEvents();
    setEvents([]);
  };

  return <>{children({ events, summary, sessions, reset })}</>;
}
