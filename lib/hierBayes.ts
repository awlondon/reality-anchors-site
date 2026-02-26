import { computePosterior } from '@/lib/bayesianRanking';

export function globalPosterior(submits: number, exposures: number, alpha0 = 1, beta0 = 9) {
  return computePosterior({ regimeId: 'global', exposures, submits }, alpha0, beta0);
}

export function sourcePosteriorFromGlobal(
  submits: number,
  exposures: number,
  globalMean: number,
  kappa = 30,
  regimeId = 'source'
) {
  const alphaPrior = globalMean * kappa;
  const betaPrior = (1 - globalMean) * kappa;
  const posterior = computePosterior(
    {
      regimeId,
      exposures,
      submits,
    },
    alphaPrior,
    betaPrior
  );

  return {
    ...posterior,
    alphaPrior,
    betaPrior,
  };
}
