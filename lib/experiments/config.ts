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
        headline: 'For fabrication teams, we reduce scrap and rework by up to 8%\u00a0\u2014 without changing your hardware.',
        subhead:
          'Tablet software that validates every cut, bend, and assembly step against your job data. Works offline, runs alongside existing machines.',
      },
      B: {
        headline: 'Fewer Miscuts. Less Scrap. Every Bar Tracked.',
        subhead:
          'Reads your cut lists, applies stretch and bend rules, and generates step-by-step instructions. No hardware changes, works offline.',
      },
      C: {
        headline: 'For operations leaders, we close the plan-to-execution gap by up to 8%\u00a0\u2014 no new hardware.',
        subhead:
          'Every fabrication step guided, validated, and recorded. Your ERP and QA systems get cleaner downstream data.',
      },
    },
  },
};
