import { IRR_SOLVER } from '@/lib/constants';

export function calculateNPV(rate: number, cashFlows: number[]) {
  return cashFlows.reduce((npv, cf, i) => npv + cf / Math.pow(1 + rate, i), 0);
}

export function calculateIRR(cashFlows: number[], guess = 0.1) {
  const { maxIterations, tolerance, gridSearchStart, gridSearchEnd, gridSearchStep, gridSearchTolerance, minRate } = IRR_SOLVER;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      derivative -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }

    if (Math.abs(derivative) < tolerance) break;

    const newRate = rate - npv / derivative;
    if (!Number.isFinite(newRate) || newRate <= minRate) break;

    if (Math.abs(newRate - rate) < tolerance) return newRate;
    rate = newRate;
  }

  for (let candidate = gridSearchStart; candidate <= gridSearchEnd; candidate += gridSearchStep) {
    const npv = calculateNPV(candidate, cashFlows);
    if (Math.abs(npv) < gridSearchTolerance) return candidate;
  }

  return null;
}
