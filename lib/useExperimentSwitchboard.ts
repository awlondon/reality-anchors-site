'use client';

import { useEffect, useState } from 'react';
import type { ExperimentConfig } from '@/lib/experiments/types';

const KEY = 'exp_home_narrative_v1_override';

export function useExperimentSwitchboard(defaultConfig: ExperimentConfig) {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ExperimentConfig>;
      setConfig((prev) => ({
        ...prev,
        isEnabled: typeof parsed.isEnabled === 'boolean' ? parsed.isEnabled : prev.isEnabled,
        traffic: parsed.traffic ? { ...prev.traffic, ...parsed.traffic } : prev.traffic,
      }));
    } catch {
      setConfig(defaultConfig);
    }
  }, [defaultConfig]);

  const update = (next: ExperimentConfig) => {
    setConfig(next);
    localStorage.setItem(KEY, JSON.stringify({ isEnabled: next.isEnabled, traffic: next.traffic }));
  };

  return { config, update };
}
