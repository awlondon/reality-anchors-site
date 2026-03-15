import { describe, it, expect } from 'vitest';
import { pricingTiers, deviceAddOns, pricingNarrative } from '@/data/pricing';

describe('pricing data', () => {
  it('has three tiers', () => {
    expect(pricingTiers).toHaveLength(3);
  });

  it('every tier includes 1 reference camera in base', () => {
    for (const tier of pricingTiers) {
      expect(tier.includedUsage.cameras).toMatch(/1 reference camera/i);
    }
  });

  it('exports device add-ons with context and lidar types', () => {
    expect(deviceAddOns).toHaveLength(2);
    const ids = deviceAddOns.map((d) => d.id);
    expect(ids).toContain('context_camera');
    expect(ids).toContain('lidar_device');
  });

  it('context camera costs $200/mo', () => {
    const ctx = deviceAddOns.find((d) => d.id === 'context_camera')!;
    expect(ctx.price).toBe('$200/device/mo');
    expect(ctx.monthlyUsd).toBe(200);
  });

  it('LiDAR device costs $450/mo', () => {
    const lidar = deviceAddOns.find((d) => d.id === 'lidar_device')!;
    expect(lidar.price).toBe('$450/device/mo');
    expect(lidar.monthlyUsd).toBe(450);
  });

  it('pricing narrative mentions device add-ons', () => {
    expect(pricingNarrative.bullets.some((b) => b.toLowerCase().includes('device'))).toBe(true);
  });
});
