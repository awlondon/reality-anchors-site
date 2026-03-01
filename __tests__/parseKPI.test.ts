import { describe, it, expect } from 'vitest';
import { parseKPI } from '@/lib/parseKPI';

describe('parseKPI', () => {
  it('parses a simple integer', () => {
    const result = parseKPI('42');
    expect(result).toEqual({ number: 42, prefix: '', suffix: '', decimals: 0 });
  });

  it('parses a decimal value', () => {
    const result = parseKPI('1.8 pts');
    expect(result).toEqual({ number: 1.8, prefix: '', suffix: ' pts', decimals: 1 });
  });

  it('parses a value with a prefix', () => {
    const result = parseKPI('$5,000');
    // The regex captures 5 (before the comma)
    expect(result.number).toBe(5);
    expect(result.prefix).toBe('$');
  });

  it('parses a percentage', () => {
    const result = parseKPI('8%');
    expect(result).toEqual({ number: 8, prefix: '', suffix: '%', decimals: 0 });
  });

  it('parses a value with units suffix', () => {
    const result = parseKPI('4.2s');
    expect(result).toEqual({ number: 4.2, prefix: '', suffix: 's', decimals: 1 });
  });

  it('returns null number for non-numeric input', () => {
    const result = parseKPI('N/A');
    expect(result.number).toBeNull();
    expect(result.suffix).toBe('N/A');
  });

  it('handles negative numbers', () => {
    const result = parseKPI('-3.5%');
    expect(result.number).toBe(-3.5);
    expect(result.suffix).toBe('%');
    expect(result.decimals).toBe(1);
  });
});
