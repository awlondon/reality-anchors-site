import { describe, it, expect } from 'vitest';
import { classifyIntent, computeConversionScore, type SessionAggregate } from '@/lib/conversionModel';

describe('classifyIntent', () => {
  it('returns "high" for probability > 0.7', () => {
    expect(classifyIntent(0.8)).toBe('high');
    expect(classifyIntent(0.71)).toBe('high');
    expect(classifyIntent(1.0)).toBe('high');
  });

  it('returns "emerging" for probability between 0.4 and 0.7', () => {
    expect(classifyIntent(0.5)).toBe('emerging');
    expect(classifyIntent(0.41)).toBe('emerging');
    expect(classifyIntent(0.7)).toBe('emerging');
  });

  it('returns "low" for probability <= 0.4', () => {
    expect(classifyIntent(0.3)).toBe('low');
    expect(classifyIntent(0.0)).toBe('low');
    expect(classifyIntent(0.4)).toBe('low');
  });
});

describe('computeConversionScore', () => {
  const baseSession: SessionAggregate = {
    sessionId: 'test-123',
    maxScrollDepth: 0,
    totalDwellMs: 0,
    regimeCount: 0,
    totalCtaClicks: 0,
    totalFormViews: 0,
    totalFormSubmits: 0,
    kpiReveals: 0,
  };

  it('returns low score for zero engagement', () => {
    const result = computeConversionScore(baseSession);
    expect(result.probability).toBeLessThan(0.5);
    expect(result.scorePercent).toBeLessThan(50);
  });

  it('returns high score for high engagement', () => {
    const result = computeConversionScore({
      ...baseSession,
      maxScrollDepth: 100,
      totalDwellMs: 10_000,
      regimeCount: 4,
      totalCtaClicks: 3,
      kpiReveals: 6,
    });
    expect(result.probability).toBeGreaterThan(0.9);
    expect(result.scorePercent).toBeGreaterThan(90);
  });

  it('CTA clicks have the highest weight', () => {
    const ctaOnly = computeConversionScore({ ...baseSession, totalCtaClicks: 2 });
    const dwellOnly = computeConversionScore({ ...baseSession, totalDwellMs: 8000 });
    // CTA weight is 2.6 vs dwell weight 2.4
    expect(ctaOnly.probability).toBeGreaterThan(dwellOnly.probability);
  });

  it('returns components in the result', () => {
    const result = computeConversionScore({
      ...baseSession,
      maxScrollDepth: 50,
      totalDwellMs: 4000,
    });
    expect(result.components.depthNorm).toBeCloseTo(0.5);
    expect(result.components.dwellNorm).toBeCloseTo(0.5);
    expect(result.components.regimeNorm).toBe(0);
  });
});
