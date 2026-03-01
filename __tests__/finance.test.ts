import { describe, it, expect } from 'vitest';
import { calculateNPV, calculateIRR } from '@/lib/finance';

describe('calculateNPV', () => {
  it('returns the initial cash flow when rate is 0', () => {
    expect(calculateNPV(0, [-1000, 500, 500, 500])).toBeCloseTo(500);
  });

  it('discounts future cash flows correctly', () => {
    // -1000 + 1100/1.1 = -1000 + 1000 = 0
    expect(calculateNPV(0.1, [-1000, 1100])).toBeCloseTo(0, 4);
  });

  it('returns 0 for an empty array', () => {
    expect(calculateNPV(0.1, [])).toBe(0);
  });

  it('handles negative rates (edge case)', () => {
    const npv = calculateNPV(-0.05, [-1000, 500, 600]);
    expect(npv).toBeGreaterThan(100);
  });
});

describe('calculateIRR', () => {
  it('finds the IRR for a simple investment', () => {
    // -1000 + 1100/(1+r) = 0 → r = 0.1
    const irr = calculateIRR([-1000, 1100]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.1, 3);
  });

  it('finds the IRR for multi-period cash flows', () => {
    const irr = calculateIRR([-1000, 400, 400, 400]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeGreaterThan(0);
    expect(irr!).toBeLessThan(0.15);
  });

  it('returns null when no IRR exists', () => {
    // All negative cash flows — no rate makes NPV = 0
    const irr = calculateIRR([-1000, -500, -200]);
    expect(irr).toBeNull();
  });
});
