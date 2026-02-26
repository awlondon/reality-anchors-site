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
  if (probability > 0.7) return 'high';
  if (probability > 0.4) return 'emerging';
  return 'low';
}

export function computeConversionScore(session: SessionAggregate) {
  const dwellNorm = Math.min(session.totalDwellMs / 8000, 1);
  const depthNorm = Math.min(session.maxScrollDepth / 100, 1);
  const regimeNorm = Math.min(session.regimeCount / 3, 1);
  const ctaNorm = Math.min(session.totalCtaClicks / 2, 1);
  const kpiNorm = Math.min(session.kpiReveals / 5, 1);

  const z = 2.4 * dwellNorm + 1.8 * depthNorm + 1.2 * regimeNorm + 2.6 * ctaNorm + 1.0 * kpiNorm - 2.5;
  const probability = sigmoid(z);

  return {
    probability,
    scorePercent: Math.round(probability * 100),
    components: { dwellNorm, depthNorm, regimeNorm, ctaNorm, kpiNorm },
  };
}
