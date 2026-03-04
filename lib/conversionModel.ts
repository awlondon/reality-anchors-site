import { CONVERSION_WEIGHTS, CONVERSION_NORMS, INTENT_THRESHOLDS } from '@/lib/constants';

export type SessionAggregate = {
  sessionId: string;
  maxScrollDepth: number;
  totalDwellMs: number;
  regimeCount: number;
  totalCtaClicks: number;
  totalFormViews: number;
  totalFormSubmits: number;
  kpiReveals: number;
};

export type IntentState = 'low' | 'emerging' | 'high';

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function classifyIntent(probability: number): IntentState {
  if (probability > INTENT_THRESHOLDS.high) return 'high';
  if (probability > INTENT_THRESHOLDS.emerging) return 'emerging';
  return 'low';
}

export function computeConversionScore(session: SessionAggregate) {
  const dwellNorm = Math.min(session.totalDwellMs / CONVERSION_NORMS.dwellMs, 1);
  const depthNorm = Math.min(session.maxScrollDepth / CONVERSION_NORMS.scrollDepth, 1);
  const regimeNorm = Math.min(session.regimeCount / CONVERSION_NORMS.regimeCount, 1);
  const ctaNorm = Math.min(session.totalCtaClicks / CONVERSION_NORMS.ctaClicks, 1);
  const kpiNorm = Math.min(session.kpiReveals / CONVERSION_NORMS.kpiReveals, 1);

  const w = CONVERSION_WEIGHTS;
  const z = w.dwell * dwellNorm + w.depth * depthNorm + w.regime * regimeNorm + w.cta * ctaNorm + w.kpi * kpiNorm + w.bias;
  const probability = sigmoid(z);

  return {
    probability,
    scorePercent: Math.round(probability * 100),
    components: { dwellNorm, depthNorm, regimeNorm, ctaNorm, kpiNorm },
  };
}
