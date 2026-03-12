import { describe, it, expect } from 'vitest';
import { computeMarginImpact, formatUSD, formatNumber, formatPct, type MarginImpactInputs } from '@/lib/marginModel';

const baseInputs: MarginImpactInputs = {
  annualTonsProcessed: 25000,
  avgMaterialCostPerTon: 850,
  annualFabricationRevenue: 30_000_000,
  annualFabricationLaborCost: 8_000_000,
  incrementalContributionMarginPct: 35,
  currentScrapRatePct: 8,
  targetScrapRatePct: 6.2,
  preventableReworkLaborPct: 12,
  reworkReductionPct: 45,
  throughputImprovementPct: 2,
  includeOversightRisk: false,
};

describe('computeMarginImpact', () => {
  it('returns correct material savings', () => {
    const r = computeMarginImpact(baseInputs);
    // 25000 * (8 - 6.2)/100 = 450 tons saved
    expect(r.material.tonsSaved).toBeCloseTo(450, 0);
    // 450 * 850 = 382,500
    expect(r.material.dollarsSaved).toBeCloseTo(382_500, 0);
  });

  it('returns correct labor savings', () => {
    const r = computeMarginImpact(baseInputs);
    // volumeScale = 25000/25000 = 1
    // preventableRework = 8,000,000 * 0.12 = 960,000
    // laborSaved = 960,000 * 0.45 = 432,000
    expect(r.labor.dollarsSaved).toBeCloseTo(432_000, 0);
  });

  it('returns correct throughput EBITDA contribution', () => {
    const r = computeMarginImpact(baseInputs);
    // incrementalRevenue = 30,000,000 * 0.02 = 600,000
    // EBITDA contribution = 600,000 * 0.35 = 210,000
    expect(r.throughput.incrementalRevenue).toBeCloseTo(600_000, 0);
    expect(r.throughput.ebitdaContribution).toBeCloseTo(210_000, 0);
  });

  it('sums totals correctly', () => {
    const r = computeMarginImpact(baseInputs);
    const expectedTotal = r.material.dollarsSaved + r.labor.dollarsSaved + r.throughput.ebitdaContribution + r.oversightRisk.dollarsSaved;
    expect(r.totals.annualEbitdaIncrease).toBeCloseTo(expectedTotal, 0);
  });

  it('includes oversight/risk when enabled', () => {
    const inputs: MarginImpactInputs = {
      ...baseInputs,
      includeOversightRisk: true,
      annualQALaborCost: 500_000,
      annualMajorErrorCost: 200_000,
      errorReductionPct: 30,
    };
    const r = computeMarginImpact(inputs);
    // (500000 + 200000) * 0.30 = 210,000
    expect(r.oversightRisk.dollarsSaved).toBeCloseTo(210_000, 0);
  });

  it('clamps scrap rates to valid range', () => {
    const inputs: MarginImpactInputs = {
      ...baseInputs,
      currentScrapRatePct: 150,
      targetScrapRatePct: -5,
    };
    const r = computeMarginImpact(inputs);
    // clamped: current=100, target=0, delta=100%
    expect(r.material.tonsSaved).toBeCloseTo(25000, 0);
  });

  it('throws on missing required input', () => {
    const broken = { ...baseInputs, annualTonsProcessed: undefined } as unknown as MarginImpactInputs;
    expect(() => computeMarginImpact(broken)).toThrow('Missing or invalid input');
  });

  it('throws on negative tonnage', () => {
    const broken = { ...baseInputs, annualTonsProcessed: -1 };
    expect(() => computeMarginImpact(broken)).toThrow('annualTonsProcessed must be >= 0');
  });

  it('returns zero totals when all inputs are zero', () => {
    const zero: MarginImpactInputs = {
      ...baseInputs,
      annualTonsProcessed: 0,
      annualFabricationRevenue: 0,
      annualFabricationLaborCost: 0,
      currentScrapRatePct: 0,
      targetScrapRatePct: 0,
    };
    const r = computeMarginImpact(zero);
    expect(r.totals.annualEbitdaIncrease).toBe(0);
  });

  it('respects skipVolumeScale flag', () => {
    const withScale = computeMarginImpact({ ...baseInputs, annualTonsProcessed: 50000 });
    const withSkip = computeMarginImpact({ ...baseInputs, annualTonsProcessed: 50000, skipVolumeScale: true });
    // With volume scale = 50000/25000 = 2x, labor/throughput should be doubled
    // With skip, they use raw input values
    expect(withScale.labor.dollarsSaved).toBeGreaterThan(withSkip.labor.dollarsSaved);
  });
});

describe('formatUSD', () => {
  it('formats positive amounts', () => {
    expect(formatUSD(1234567)).toBe('$1,234,567');
  });

  it('formats zero', () => {
    expect(formatUSD(0)).toBe('$0');
  });

  it('handles NaN gracefully', () => {
    expect(formatUSD(NaN)).toBe('$0');
  });

  it('handles Infinity gracefully', () => {
    expect(formatUSD(Infinity)).toBe('$0');
  });
});

describe('formatNumber', () => {
  it('formats with default decimals', () => {
    expect(formatNumber(1234.5678)).toBe('1,234.57');
  });
});

describe('formatPct', () => {
  it('formats percentages', () => {
    expect(formatPct(12.345)).toBe('12.3%');
  });
});
