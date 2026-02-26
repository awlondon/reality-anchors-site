import type { ExecEvent } from '@/lib/execAnalytics';

export type VariantSummary = {
  variant: string;
  exposures: number;
  ctas: number;
  submits: number;
  ctaRate: number;
  submitRate: number;
  avgDwellSecPerSession: number;
  sessions: number;
};

export function summarizeByVariant(events: ExecEvent[], experimentId: string): VariantSummary[] {
  const by = new Map<string, { exposures: number; ctas: number; submits: number; dwellMs: number; sessions: Set<string> }>();

  for (const e of events) {
    if (e.experimentId !== experimentId) continue;

    const v = e.variant ?? 'A';
    const r = by.get(v) ?? { exposures: 0, ctas: 0, submits: 0, dwellMs: 0, sessions: new Set<string>() };

    if (e.sessionId) r.sessions.add(e.sessionId);
    if (e.type === 'experiment_exposure') r.exposures += 1;
    if (e.type === 'cta_click') r.ctas += 1;
    if (e.type === 'lead_form_submit') r.submits += 1;
    if (e.type === 'regime_exit') r.dwellMs += e.dwellTimeMs ?? 0;

    by.set(v, r);
  }

  return Array.from(by.entries()).map(([variant, r]) => ({
    variant,
    exposures: r.exposures,
    ctas: r.ctas,
    submits: r.submits,
    sessions: r.sessions.size,
    ctaRate: r.exposures ? r.ctas / r.exposures : 0,
    submitRate: r.exposures ? r.submits / r.exposures : 0,
    avgDwellSecPerSession: r.sessions.size ? r.dwellMs / 1000 / r.sessions.size : 0,
  }));
}
