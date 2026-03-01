import { computeMarginImpact, formatUSD } from '@/lib/marginModel';
import type { CalculatorContext } from '@/lib/calculatorContext';

/** Quick Estimate calculator defaults — same as QuickEstimateCalculator.tsx */
const BENCHMARK = {
  tons: 12_500,
  scrapRate: 8,
  costPerTon: 850,
  scrapReductionPts: 1.5,
  revenueMultiplier: 2.5,
  laborFraction: 0.15,
  contributionMarginPct: 20,
  preventableReworkLaborPct: 4,
  reworkReductionPct: 40,
  throughputImprovementPct: 2,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/** Fallback computation when no calculator context is stored (benchmark only). */
function computeBenchmark() {
  const targetScrap = clamp(BENCHMARK.scrapRate - BENCHMARK.scrapReductionPts, 0, BENCHMARK.scrapRate);
  const revenue = BENCHMARK.tons * BENCHMARK.costPerTon * BENCHMARK.revenueMultiplier;
  const labor = revenue * BENCHMARK.laborFraction;

  return computeMarginImpact({
    annualTonsProcessed: BENCHMARK.tons,
    avgMaterialCostPerTon: BENCHMARK.costPerTon,
    annualFabricationRevenue: revenue,
    annualFabricationLaborCost: labor,
    incrementalContributionMarginPct: BENCHMARK.contributionMarginPct,
    currentScrapRatePct: BENCHMARK.scrapRate,
    targetScrapRatePct: targetScrap,
    preventableReworkLaborPct: BENCHMARK.preventableReworkLaborPct,
    reworkReductionPct: BENCHMARK.reworkReductionPct,
    throughputImprovementPct: BENCHMARK.throughputImprovementPct,
    includeOversightRisk: false,
    skipVolumeScale: true,
  });
}

export interface ConfirmationParams {
  firstName: string;
  specLabel: string;
  annualTons: string;
  scrapRate: string;
  costPerTon: string;
  tonsSaved: string;
  materialSavings: string;
  laborSavings: string;
  throughputSavings: string;
  oversightSavings: string;
  totalEbitda: string;
  materialPct: string;
  laborPct: string;
  throughputPct: string;
  oversightPct: string;
}

export function buildConfirmationParams(
  calc: CalculatorContext | null,
  name: string,
): ConfirmationParams {
  const isBenchmark = !calc;
  const tons = calc?.annualTons ?? BENCHMARK.tons;
  const scrapRate = calc?.scrapRatePct ?? BENCHMARK.scrapRate;
  const costPerTon = calc?.costPerTon ?? BENCHMARK.costPerTon;
  const tonsSaved = calc?.estimatedTonsSaved ?? 0;

  let materialSavings: number;
  let laborSavings: number;
  let throughputSavings: number;
  let oversightSavings: number;
  let totalEbitda: number;

  if (calc?.materialDollarsSaved != null) {
    // Use the exact results the lead saw on screen — no re-computation.
    materialSavings = calc.materialDollarsSaved;
    laborSavings = calc.laborDollarsSaved ?? 0;
    throughputSavings = calc.throughputContribution ?? 0;
    oversightSavings = calc.oversightRiskSaved ?? 0;
    totalEbitda = calc.estimatedEbitda;
  } else if (calc) {
    // Legacy context without breakdown — use stored total, estimate split
    materialSavings = calc.estimatedMaterialSavings;
    laborSavings = 0;
    throughputSavings = 0;
    oversightSavings = 0;
    totalEbitda = calc.estimatedEbitda;
  } else {
    // No calculator context at all — fall back to benchmark
    const result = computeBenchmark();
    materialSavings = result.material.dollarsSaved;
    laborSavings = result.labor.dollarsSaved;
    throughputSavings = result.throughput.ebitdaContribution;
    oversightSavings = 0;
    totalEbitda = result.totals.annualEbitdaIncrease;
  }

  const maxBar = Math.max(materialSavings, laborSavings, throughputSavings, oversightSavings, 1);

  return {
    firstName: name.split(' ')[0] || 'there',
    specLabel: isBenchmark
      ? 'Based on a typical mid-size fabricator (12,500 t/year, 8% scrap, $850/ton):'
      : 'Based on your inputs:',
    annualTons: `${tons.toLocaleString()} tons`,
    scrapRate: `${scrapRate.toFixed(1)}%`,
    costPerTon: `${formatUSD(costPerTon)}/ton`,
    tonsSaved: `${Math.round(tonsSaved).toLocaleString()} t`,
    materialSavings: formatUSD(materialSavings),
    laborSavings: formatUSD(laborSavings),
    throughputSavings: formatUSD(throughputSavings),
    oversightSavings: formatUSD(oversightSavings),
    totalEbitda: formatUSD(totalEbitda),
    materialPct: `${maxBar > 0 ? Math.round((materialSavings / maxBar) * 100) : 0}`,
    laborPct: `${maxBar > 0 ? Math.round((laborSavings / maxBar) * 100) : 0}`,
    throughputPct: `${maxBar > 0 ? Math.round((throughputSavings / maxBar) * 100) : 0}`,
    oversightPct: `${maxBar > 0 ? Math.round((oversightSavings / maxBar) * 100) : 0}`,
  };
}
