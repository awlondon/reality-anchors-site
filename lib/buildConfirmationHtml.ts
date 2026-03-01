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

function compute(tons: number, scrapRate: number, costPerTon: number) {
  const targetScrap = clamp(scrapRate - BENCHMARK.scrapReductionPts, 0, scrapRate);
  const revenue = tons * costPerTon * BENCHMARK.revenueMultiplier;
  const labor = revenue * BENCHMARK.laborFraction;

  return computeMarginImpact({
    annualTonsProcessed: tons,
    avgMaterialCostPerTon: costPerTon,
    annualFabricationRevenue: revenue,
    annualFabricationLaborCost: labor,
    incrementalContributionMarginPct: BENCHMARK.contributionMarginPct,
    currentScrapRatePct: scrapRate,
    targetScrapRatePct: targetScrap,
    preventableReworkLaborPct: BENCHMARK.preventableReworkLaborPct,
    reworkReductionPct: BENCHMARK.reworkReductionPct,
    throughputImprovementPct: BENCHMARK.throughputImprovementPct,
    includeOversightRisk: false,
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
  totalEbitda: string;
  materialPct: string;
  laborPct: string;
  throughputPct: string;
}

export function buildConfirmationParams(
  calc: CalculatorContext | null,
  name: string,
): ConfirmationParams {
  const isBenchmark = !calc;
  const tons = calc?.annualTons ?? BENCHMARK.tons;
  const scrapRate = calc?.scrapRatePct ?? BENCHMARK.scrapRate;
  const costPerTon = calc?.costPerTon ?? BENCHMARK.costPerTon;

  const result = compute(tons, scrapRate, costPerTon);

  const materialSavings = result.material.dollarsSaved;
  const laborSavings = result.labor.dollarsSaved;
  const throughputSavings = result.throughput.ebitdaContribution;
  const maxBar = Math.max(materialSavings, laborSavings, throughputSavings, 1);

  return {
    firstName: name.split(' ')[0] || 'there',
    specLabel: isBenchmark
      ? 'Based on a typical mid-size fabricator (12,500 t/year, 8% scrap, $850/ton):'
      : 'Based on your inputs:',
    annualTons: `${tons.toLocaleString()} tons`,
    scrapRate: `${scrapRate.toFixed(1)}%`,
    costPerTon: `${formatUSD(costPerTon)}/ton`,
    tonsSaved: `${Math.round(result.material.tonsSaved).toLocaleString()} t`,
    materialSavings: formatUSD(materialSavings),
    laborSavings: formatUSD(laborSavings),
    throughputSavings: formatUSD(throughputSavings),
    totalEbitda: formatUSD(result.totals.annualEbitdaIncrease),
    materialPct: `${maxBar > 0 ? Math.round((materialSavings / maxBar) * 100) : 0}`,
    laborPct: `${maxBar > 0 ? Math.round((laborSavings / maxBar) * 100) : 0}`,
    throughputPct: `${maxBar > 0 ? Math.round((throughputSavings / maxBar) * 100) : 0}`,
  };
}
