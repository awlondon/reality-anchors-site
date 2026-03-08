import { describe, it, expect } from 'vitest';
import { search } from '@/lib/searchIndex';

describe('search', () => {
  it('returns empty for short queries', () => {
    expect(search('a')).toEqual([]);
    expect(search('')).toEqual([]);
  });

  it('finds results by title keyword', () => {
    const results = search('rebar');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Rebar');
  });

  it('finds results by category keyword', () => {
    const results = search('pricing');
    expect(results.length).toBeGreaterThan(0);
    const categories = results.map((r) => r.category);
    expect(categories).toContain('Pricing');
  });

  it('ranks title matches higher than description matches', () => {
    const results = search('platform');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Platform');
  });

  it('limits to 8 results', () => {
    // "a" is too short, use a broader term
    const results = search('the');
    expect(results.length).toBeLessThanOrEqual(8);
  });

  it('handles multi-word queries', () => {
    const results = search('margin impact');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].href).toBe('/margin-impact/');
  });

  it('returns empty for nonsense queries', () => {
    const results = search('xyzzy12345');
    expect(results).toEqual([]);
  });
});
