import { cookies } from 'next/headers';
import type { VariantId } from '@/lib/experiments/types';

const EXP_COOKIE = 'exp_home_narrative_v1';

export function getServerVariant(): VariantId {
  const v = cookies().get(EXP_COOKIE)?.value;
  if (v === 'B' || v === 'C') return v;
  return 'A';
}
