'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ExecEvent } from '@/lib/execAnalytics';
import { computeConversionScore, type SessionAggregate } from '@/lib/conversionModel';

type IntentSession = SessionAggregate & { probability: number };
const STORAGE_KEY = 'intent_stream_events_v1';

function loadIntentEvents(): ExecEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExecEvent[]) : [];
  } catch {
    return [];
  }
}

function saveIntentEvents(events: ExecEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-1000)));
}

function toExecEvent(detail: Record<string, unknown>): ExecEvent | null {
  const type = typeof detail.type === 'string' ? detail.type : null;
  if (!type || detail.source !== 'funnel_tracker') return null;

  const sessionId = typeof detail.sessionId === 'string' ? detail.sessionId : undefined;
  const timestamp = typeof detail.timestamp === 'number' ? detail.timestamp : Date.now();

  if (type === 'scroll_depth') return { type, depthPercent: Number(detail.depthPercent ?? 0), timestamp, sessionId };
  if (type === 'regime_enter' && typeof detail.regimeId === 'string') return { type, regimeId: detail.regimeId, timestamp, sessionId };
  if (type === 'regime_exit' && typeof detail.regimeId === 'string') {
    return { type, regimeId: detail.regimeId, dwellTimeMs: Number(detail.dwellTimeMs ?? 0), timestamp, sessionId };
  }
  if (type === 'cta_click') return { type, regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, timestamp, sessionId };
  if (type === 'lead_form_view') return { type, regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, timestamp, sessionId };
  if (type === 'lead_form_submit') return { type, regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, timestamp, sessionId };
  if (type === 'kpi_reveal') return { type, regimeId: typeof detail.regimeId === 'string' ? detail.regimeId : undefined, value: typeof detail.value === 'number' ? detail.value : undefined, timestamp, sessionId };

  return null;
}

function aggregateSessions(events: ExecEvent[]): IntentSession[] {
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
    if (e.type === 'regime_exit') s.totalDwellMs += e.dwellTimeMs;
    if (e.type === 'cta_click') s.totalCtaClicks += 1;
    if (e.type === 'lead_form_view') s.totalFormViews += 1;
    if (e.type === 'lead_form_submit') s.totalFormSubmits += 1;
    if (e.type === 'kpi_reveal') s.kpiReveals += 1;

    sessions.set(e.sessionId, s);
  }

  return Array.from(sessions.values()).map((s) => ({ ...s, probability: computeConversionScore(s).probability }));
}

export function useLiveIntentStream() {
  const [events, setEvents] = useState<ExecEvent[]>([]);

  useEffect(() => {
    setEvents(loadIntentEvents());

    const onAnalytics = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const evt = toExecEvent(custom.detail ?? {});
      if (!evt) return;

      setEvents((prev) => {
        const next = [...prev, evt].slice(-1000);
        saveIntentEvents(next);
        return next;
      });
    };

    window.addEventListener('analytics', onAnalytics as EventListener);
    return () => window.removeEventListener('analytics', onAnalytics as EventListener);
  }, []);

  const sessions = useMemo(() => aggregateSessions(events).slice(0, 50), [events]);
  return { sessions, events };
}
