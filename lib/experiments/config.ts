import type { ExperimentConfig } from '@/lib/experiments/types';

export const HOME_EXPERIMENT: ExperimentConfig = {
  id: 'home_narrative_v2',
  isEnabled: true,
  traffic: { A: 0.34, B: 0.33, C: 0.33 },
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
        'structural-fabrication',
        'multi-project-optimization',
        'machine-calibration',
        'fleet-grip',
        'ar-execution',
        'ai-governance',
      ],
      C: [
        'structural-fabrication',
        'multi-project-optimization',
        'machine-calibration',
        'ai-governance',
        'ar-execution',
        'fleet-grip',
      ],
    },
    heroOverride: {
      A: {
        headline: 'Calibrated capture for fabrication teams that need proof, not day-one autonomy.',
        subhead:
          'Start with your own cameras, validate every run against your job specs, and build measurable proof from every bench.',
      },
      B: {
        headline: 'Start with one camera. Add coverage when the workflow earns it.',
        subhead:
          'Reality Anchors makes one-camera deployment practical first, then expands into mixed-camera coverage and optional LiDAR only where precision depth matters.',
      },
      C: {
        headline:
          'Mixed camera fleets, operator-confirmed validation, and a clear path from pilot to paid production use.',
        subhead:
          'Reference, context, and depth devices can work together in one fleet while your team keeps control of each irreversible step.',
      },
    },
  },
};
