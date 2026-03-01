/**
 * Fabrication Margin Impact Model — clean formula logic (no UI framework assumptions).
 * Keep this as a pure function layer so UI can be swapped without touching math.
 */

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function pctToFrac(pct) {
  return pct / 100;
}

const REFERENCE_ANNUAL_TONS = 25000;

function validateInputs(i) {
  const required = [
    'annualTonsProcessed',
    'avgMaterialCostPerTon',
    'annualFabricationRevenue',
    'annualFabricationLaborCost',
    'incrementalContributionMarginPct',
    'currentScrapRatePct',
    'targetScrapRatePct',
    'preventableReworkLaborPct',
    'reworkReductionPct',
    'throughputImprovementPct',
    'includeOversightRisk',
  ];

  for (const k of required) {
    if (typeof i[k] !== 'number' && typeof i[k] !== 'boolean') {
      throw new Error(`Missing or invalid input: ${k}`);
    }
  }

  if (i.annualTonsProcessed < 0) throw new Error('annualTonsProcessed must be >= 0');
  if (i.avgMaterialCostPerTon < 0) throw new Error('avgMaterialCostPerTon must be >= 0');
  if (i.annualFabricationRevenue < 0) throw new Error('annualFabricationRevenue must be >= 0');
  if (i.annualFabricationLaborCost < 0) throw new Error('annualFabricationLaborCost must be >= 0');

  if (i.includeOversightRisk) {
    const opt = ['annualQALaborCost', 'annualMajorErrorCost', 'errorReductionPct'];
    for (const k of opt) {
      if (typeof i[k] !== 'number') throw new Error(`Missing oversight/risk input: ${k}`);
      if (i[k] < 0) throw new Error(`${k} must be >= 0`);
    }
  }
}

export function computeMarginImpact(inputs) {
  validateInputs(inputs);

  const currentScrap = clamp(inputs.currentScrapRatePct, 0, 100);
  const targetScrap = clamp(inputs.targetScrapRatePct, 0, 100);
  const preventableReworkPct = clamp(inputs.preventableReworkLaborPct, 0, 100);
  const reworkReductionPct = clamp(inputs.reworkReductionPct, 0, 100);
  const throughputImprovementPct = clamp(inputs.throughputImprovementPct, 0, 100);
  const contribMarginPct = clamp(inputs.incrementalContributionMarginPct, 0, 100);

  // When revenue & labor are already proportional to the user's tonnage
  // (e.g. derived via tons × costPerTon × multiplier), callers should pass
  // skipVolumeScale: true to avoid double-scaling.
  const volumeScale = inputs.skipVolumeScale
    ? 1
    : REFERENCE_ANNUAL_TONS > 0
      ? Math.max(0, inputs.annualTonsProcessed) / REFERENCE_ANNUAL_TONS
      : 0;

  const scrapDeltaPct = Math.max(0, currentScrap - targetScrap);
  const tonsSaved = inputs.annualTonsProcessed * pctToFrac(scrapDeltaPct);
  const materialDollarsSaved = tonsSaved * inputs.avgMaterialCostPerTon;

  const scaledAnnualLaborCost = inputs.annualFabricationLaborCost * volumeScale;
  const preventableReworkDollars = scaledAnnualLaborCost * pctToFrac(preventableReworkPct);
  const laborDollarsSaved = preventableReworkDollars * pctToFrac(reworkReductionPct);

  const scaledAnnualRevenue = inputs.annualFabricationRevenue * volumeScale;
  const incrementalRevenue = scaledAnnualRevenue * pctToFrac(throughputImprovementPct);
  const throughputEbitdaContribution = incrementalRevenue * pctToFrac(contribMarginPct);

  let oversightRiskDollarsSaved = 0;
  if (inputs.includeOversightRisk) {
    const errRed = clamp(inputs.errorReductionPct, 0, 100);
    const qaSaved = (inputs.annualQALaborCost * volumeScale) * pctToFrac(errRed);
    const majorErrSaved = (inputs.annualMajorErrorCost * volumeScale) * pctToFrac(errRed);
    oversightRiskDollarsSaved = qaSaved + majorErrSaved;
  }

  const annualEbitdaIncrease =
    materialDollarsSaved + laborDollarsSaved + throughputEbitdaContribution + oversightRiskDollarsSaved;

  const ebitdaMarginImprovementPct =
    scaledAnnualRevenue > 0 ? (annualEbitdaIncrease / scaledAnnualRevenue) * 100 : 0;

  const lowFrictionAnnual = annualEbitdaIncrease * 0.08;
  const baseAnnual = annualEbitdaIncrease * 0.12;
  const aggressiveAnnual = annualEbitdaIncrease * 0.15;

  return {
    material: { tonsSaved, dollarsSaved: materialDollarsSaved },
    labor: { dollarsSaved: laborDollarsSaved },
    throughput: { incrementalRevenue, ebitdaContribution: throughputEbitdaContribution },
    oversightRisk: { dollarsSaved: oversightRiskDollarsSaved },
    totals: { annualEbitdaIncrease, ebitdaMarginImprovementPct },
    pricing: { lowFrictionAnnual, baseAnnual, aggressiveAnnual },
  };
}

export function formatUSD(value, { maximumFractionDigits = 0 } = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value, { maximumFractionDigits = 2 } = {}) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(Number.isFinite(value) ? value : 0);
}

export function formatPct(value, { maximumFractionDigits = 1 } = {}) {
  return `${formatNumber(value, { maximumFractionDigits })}%`;
}
