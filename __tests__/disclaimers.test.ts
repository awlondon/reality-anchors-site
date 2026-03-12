import { describe, it, expect } from 'vitest';
import { disclaimers } from '@/data/disclaimers';

describe('disclaimers', () => {
  it('exports all required disclaimer keys', () => {
    expect(disclaimers.metrics).toBeTruthy();
    expect(disclaimers.calculator).toBeTruthy();
    expect(disclaimers.heroFootnote).toBeTruthy();
    expect(disclaimers.roiQualifier).toBeTruthy();
    expect(disclaimers.printFooter).toBeTruthy();
  });

  it('calculator disclaimer includes "not a guarantee" language', () => {
    expect(disclaimers.calculator.toLowerCase()).toContain('does not guarantee');
  });

  it('calculator disclaimer includes consult-your-team language', () => {
    expect(disclaimers.calculator.toLowerCase()).toContain('consult');
  });
});
