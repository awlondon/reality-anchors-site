import { describe, it, expect } from 'vitest';
import { workcells, getWorkcellBySlug, getLiveWorkcells, getExpansionWorkcells } from '@/data/workcells';

describe('workcells data', () => {
  it('has at least one workcell', () => {
    expect(workcells.length).toBeGreaterThan(0);
  });

  it('all workcells have required fields', () => {
    for (const wc of workcells) {
      expect(wc.id).toBeTruthy();
      expect(wc.slug).toBeTruthy();
      expect(wc.name).toBeTruthy();
      expect(wc.shortName).toBeTruthy();
      expect(['live', 'coming-soon', 'adjacent']).toContain(wc.status);
    }
  });

  it('all slugs are unique', () => {
    const slugs = workcells.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getWorkcellBySlug', () => {
  it('finds rebar-cut-bend', () => {
    const wc = getWorkcellBySlug('rebar-cut-bend');
    expect(wc).toBeDefined();
    expect(wc?.status).toBe('live');
  });

  it('returns undefined for unknown slug', () => {
    expect(getWorkcellBySlug('nonexistent')).toBeUndefined();
  });
});

describe('getLiveWorkcells', () => {
  it('returns only live workcells', () => {
    const live = getLiveWorkcells();
    expect(live.length).toBeGreaterThan(0);
    for (const wc of live) {
      expect(wc.status).toBe('live');
    }
  });
});

describe('getExpansionWorkcells', () => {
  it('returns only non-live workcells', () => {
    const expansion = getExpansionWorkcells();
    for (const wc of expansion) {
      expect(wc.status).not.toBe('live');
    }
  });

  it('combined with live equals all workcells', () => {
    const all = [...getLiveWorkcells(), ...getExpansionWorkcells()];
    expect(all.length).toBe(workcells.length);
  });
});
