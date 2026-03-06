import type { ExperimentConfig } from '@/lib/experiments/types';

export const HOME_EXPERIMENT: ExperimentConfig = {
  id: 'home_narrative_v1',
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
        'ai-governance',
        'structural-fabrication',
        'machine-calibration',
        'multi-project-optimization',
        'ar-execution',
        'fleet-grip',
      ],
    },
    heroOverride: {
      A: {
        headline: 'Execution validation for industrial fabrication.',
        subhead:
          'AI-guided verification that reduces scrap, eliminates rework, and builds traceable execution records across every workcell.',
      },
      B: {
        headline: 'Fewer Miscuts. Less Scrap. Every Bar Tracked.',
        subhead:
          'Tablet software that reads your cut lists, applies stretch allowances and bend rules, and generates step-by-step cutter and bender instructions. Runs alongside your existing machines\u00a0\u2014 no hardware changes, works offline.',
      },
      C: {
        headline: 'Verified execution data your planning tools can trust.',
        subhead:
          'Bridge the gap between upstream planning and downstream execution. Every step guided, validated, and recorded.',
      },
    },
  },
};
