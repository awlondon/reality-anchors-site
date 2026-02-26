export type ExperimentId = 'home_narrative_v1';

export type VariantId = 'A' | 'B' | 'C';

export type ExperimentConfig = {
  id: ExperimentId;
  isEnabled: boolean;
  traffic: Record<VariantId, number>;
  narrative: {
    regimeOrder?: Record<VariantId, string[]>;
    heroOverride?: Record<VariantId, { headline?: string; subhead?: string }>;
  };
};
