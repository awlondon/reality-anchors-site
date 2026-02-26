export type ExecEvent =
  | {
      type: 'regime_enter';
      regimeId: string;
      stage?: string;
      timestamp: number;
      sessionId?: string;
      experimentId?: string;
      variant?: 'A' | 'B' | 'C';
      trafficSource?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      referrerHost?: string;
    }
  | {
      type: 'regime_exit';
      regimeId: string;
      dwellTimeMs: number;
      timestamp: number;
      sessionId?: string;
      experimentId?: string;
      variant?: 'A' | 'B' | 'C';
      trafficSource?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      referrerHost?: string;
    }
  | {
      type: 'scroll_depth';
      depthPercent: number;
      timestamp: number;
      sessionId?: string;
      experimentId?: string;
      variant?: 'A' | 'B' | 'C';
      trafficSource?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      referrerHost?: string;
    }
  | { type: 'cta_click'; regimeId?: string; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string }
  | { type: 'lead_form_view'; regimeId?: string; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string }
  | { type: 'lead_form_submit'; regimeId?: string; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string }
  | { type: 'kpi_reveal'; regimeId?: string; kpiIndex?: number; value?: number; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string }
  | { type: 'experiment_exposure'; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string }
  | { type: 'narrative_reorder'; timestamp: number; sessionId?: string; experimentId?: string; variant?: 'A' | 'B' | 'C'; intent?: string; trafficSource?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string };

export type ExecRegimeStats = {
  regimeId: string;
  enters: number;
  exits: number;
  dwellMs: number;
  avgDwellMs: number;
  ctaClicks: number;
  formViews: number;
  formSubmits: number;
  kpiReveals: number;
  engagementScore: number;
};

export type ExecSummary = {
  totalEvents: number;
  uniqueRegimes: number;
  maxScrollDepth: number;
  totalCtaClicks: number;
  totalFormViews: number;
  totalFormSubmits: number;
  totalReorders: number;
  avgDwellMsAllRegimes: number;
  regimes: ExecRegimeStats[];
  timeline: { t: number; maxDepth: number; ctaClicks: number; formSubmits: number }[];
};

export const EXEC_STORAGE_KEY = 'exec_analytics_events_v1';
export function loadEvents(): ExecEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EXEC_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ExecEvent[];
  } catch {
    return [];
  }
}
export function saveEvents(events: ExecEvent[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EXEC_STORAGE_KEY, JSON.stringify(events));
}
export function clearEvents() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EXEC_STORAGE_KEY);
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function summarize(events: ExecEvent[]): ExecSummary {
  const byRegime = new Map<string, ExecRegimeStats>();
  let maxDepth = 0;
  let totalCta = 0;
  let totalFormViews = 0;
  let totalFormSubmits = 0;
  let totalReorders = 0;

  const buckets = new Map<number, { t: number; maxDepth: number; ctaClicks: number; formSubmits: number }>();
  const upsert = (regimeId: string) => {
    const existing = byRegime.get(regimeId);
    if (existing) return existing;
    const init: ExecRegimeStats = {
      regimeId,
      enters: 0,
      exits: 0,
      dwellMs: 0,
      avgDwellMs: 0,
      ctaClicks: 0,
      formViews: 0,
      formSubmits: 0,
      kpiReveals: 0,
      engagementScore: 0,
    };
    byRegime.set(regimeId, init);
    return init;
  };

  const bucketKey = (ts: number) => Math.floor(ts / 60000) * 60000;

  for (const e of events) {
    const bkey = bucketKey(e.timestamp);
    const b = buckets.get(bkey) ?? { t: bkey, maxDepth: 0, ctaClicks: 0, formSubmits: 0 };

    if (e.type === 'scroll_depth') {
      maxDepth = Math.max(maxDepth, e.depthPercent);
      b.maxDepth = Math.max(b.maxDepth, e.depthPercent);
    }
    if (e.type === 'cta_click') {
      totalCta += 1;
      b.ctaClicks += 1;
      if (e.regimeId) upsert(e.regimeId).ctaClicks += 1;
    }
    if (e.type === 'lead_form_view') {
      totalFormViews += 1;
      if (e.regimeId) upsert(e.regimeId).formViews += 1;
    }
    if (e.type === 'lead_form_submit') {
      totalFormSubmits += 1;
      b.formSubmits += 1;
      if (e.regimeId) upsert(e.regimeId).formSubmits += 1;
    }
    if (e.type === 'kpi_reveal' && e.regimeId) upsert(e.regimeId).kpiReveals += 1;
    if (e.type === 'regime_enter') upsert(e.regimeId).enters += 1;
    if (e.type === 'regime_exit') {
      const r = upsert(e.regimeId);
      r.exits += 1;
      r.dwellMs += e.dwellTimeMs;
    }
    if (e.type === 'narrative_reorder') totalReorders += 1;

    buckets.set(bkey, b);
  }

  const regimes = Array.from(byRegime.values()).map((r) => {
    r.avgDwellMs = r.exits > 0 ? r.dwellMs / r.exits : 0;
    const timeScore = clamp01(r.avgDwellMs / 6000);
    const submitScore = clamp01(r.formSubmits / 1);
    const ctaScore = clamp01(r.ctaClicks / 3);
    r.engagementScore = clamp01(timeScore * 0.6 + submitScore * 0.3 + ctaScore * 0.1);
    return r;
  });

  regimes.sort((a, b) => b.engagementScore - a.engagementScore);
  const avgDwellAll = regimes.length > 0 ? regimes.reduce((s, r) => s + r.avgDwellMs, 0) / regimes.length : 0;
  const timeline = Array.from(buckets.values()).sort((a, b) => a.t - b.t);

  return {
    totalEvents: events.length,
    uniqueRegimes: regimes.length,
    maxScrollDepth: maxDepth,
    totalCtaClicks: totalCta,
    totalFormViews,
    totalFormSubmits,
    totalReorders,
    avgDwellMsAllRegimes: avgDwellAll,
    regimes,
    timeline,
  };
}
