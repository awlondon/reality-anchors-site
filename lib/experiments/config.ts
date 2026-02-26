import type { ExperimentConfig } from '@/lib/experiments/types';

export const HOME_EXPERIMENT: ExperimentConfig = {
  id: 'home_narrative_v1',
  isEnabled: true,
  traffic: { A: 0.5, B: 0.5, C: 0 },
  narrative: {
    regimeOrder: {
      A: [
        'structural-fabrication',
        'multi-project-optimization',
        'machine-calibration',
        'fleet-grip',
        'ar-execution',
        'ai-governance',
      ],
      B: [
        'ai-governance',
        'structural-fabrication',
        'machine-calibration',
        'multi-project-optimization',
        'ar-execution',
        'fleet-grip',
      ],
      C: [],
    },
  },
};
