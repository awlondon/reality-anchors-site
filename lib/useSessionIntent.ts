'use client';

import { useMemo } from 'react';
import { classifyIntent, computeConversionScore, type SessionAggregate } from '@/lib/conversionModel';

export function useSessionIntent(sessionAggregate: SessionAggregate) {
  return useMemo(() => {
    const score = computeConversionScore(sessionAggregate);
    const intent = classifyIntent(score.probability);
    return { probability: score.probability, intent, components: score.components };
  }, [sessionAggregate]);
}
