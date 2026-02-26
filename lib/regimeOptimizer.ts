export type RegimePerformance = {
  regimeId: string;
  exposures: number;
  avgDwellMs: number;
  ctaClicks: number;
  submits: number;
  highIntentSessions: number;
};

export function computeRegimeWeight(r: RegimePerformance) {
  if (r.exposures < 10) return 0.5;

  const dwellNorm = Math.min(r.avgDwellMs / 6000, 1);
  const ctaRate = r.ctaClicks / r.exposures;
  const submitRate = r.submits / r.exposures;
  const intentRate = r.highIntentSessions / r.exposures;

  const raw = 1.8 * submitRate + 1.4 * intentRate + 1.0 * ctaRate + 0.6 * dwellNorm;
  return Math.min(raw, 2);
}
