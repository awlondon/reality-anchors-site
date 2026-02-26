'use client';

import { useEffect } from 'react';
import { useExperiment } from '@/components/ExperimentProvider';
import { useFunnelTracker } from '@/lib/useFunnelTracker';
import { useScrollDepth } from '@/lib/useScrollDepth';

export default function AnalyticsProvider() {
  const { experimentId, variant } = useExperiment();

  useScrollDepth();
  useFunnelTracker();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('analytics', {
        detail: {
          type: 'experiment_exposure',
          experimentId,
          variant,
        },
      })
    );
  }, [experimentId, variant]);

  return null;
}
