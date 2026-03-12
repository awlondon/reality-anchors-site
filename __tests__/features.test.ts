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
      expect(f.tiers).toHaveProperty('personal');
      expect(f.tiers).toHaveProperty('commercial');
      expect(f.tiers).toHaveProperty('industrial');
    }
  });

  it('has unique feature IDs', () => {
    const ids = features.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('enterprise features are only available in industrial tier', () => {
    const enterprise = getFeaturesByCategory('Enterprise');
    for (const f of enterprise) {
      expect(f.tiers.personal).toBe(false);
      expect(f.tiers.commercial).toBe(false);
      expect(f.tiers.industrial).toBe(true);
    }
  });
});
