export type RegimeBayesStats = {
  regimeId: string;
  exposures: number;
  submits: number;
};

export type RegimePosterior = {
  regimeId: string;
  alpha: number;
  beta: number;
  mean: number;
  lower: number;
  upper: number;
  exposures: number;
  submits: number;
};

function betaMean(alpha: number, beta: number) {
  return alpha / (alpha + beta);
}

function betaInterval(alpha: number, beta: number) {
  const mean = betaMean(alpha, beta);
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
  const std = Math.sqrt(variance);

  return {
    lower: Math.max(0, mean - 1.96 * std),
    upper: Math.min(1, mean + 1.96 * std),
  };
}

export function computePosterior(stats: RegimeBayesStats, priorAlpha = 1, priorBeta = 9): RegimePosterior {
  const alpha = priorAlpha + stats.submits;
  const beta = priorBeta + (stats.exposures - stats.submits);
  const mean = betaMean(alpha, beta);
  const interval = betaInterval(alpha, beta);

  return {
    regimeId: stats.regimeId,
    alpha,
    beta,
    mean,
    lower: interval.lower,
    upper: interval.upper,
    exposures: stats.exposures,
    submits: stats.submits,
  };
}
