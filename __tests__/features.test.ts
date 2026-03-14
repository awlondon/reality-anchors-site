import { describe, it, expect } from 'vitest';
import { features, featureCategories, getFeaturesByCategory } from '@/data/features';

describe('features data', () => {
  it('has features in all three categories', () => {
    for (const cat of featureCategories) {
      expect(getFeaturesByCategory(cat).length).toBeGreaterThan(0);
    }
  });

  it('every feature has all required fields', () => {
    for (const f of features) {
      expect(f.id).toBeTruthy();
      expect(f.name).toBeTruthy();
      expect(f.description).toBeTruthy();
      expect(featureCategories).toContain(f.category);
      expect(f.tiers).toHaveProperty('pilot');
      expect(f.tiers).toHaveProperty('production');
      expect(f.tiers).toHaveProperty('enterprise');
    }
  });

  it('has unique feature IDs', () => {
    const ids = features.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('enterprise features are only available in enterprise tier', () => {
    const enterprise = getFeaturesByCategory('Enterprise');
    for (const f of enterprise) {
      expect(f.tiers.pilot).toBe(false);
      expect(f.tiers.production).toBe(false);
      expect(f.tiers.enterprise).toBe(true);
    }
  });
});
