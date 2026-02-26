import type { VariantId } from '@/lib/experiments/types';

function hashToUnitInterval(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

export function assignVariant(sessionId: string, traffic: Record<VariantId, number>): VariantId {
  const r = hashToUnitInterval(sessionId);
  const a = traffic.A ?? 0;
  const b = traffic.B ?? 0;
  if (r < a) return 'A';
  if (r < a + b) return 'B';
  return 'C';
}
