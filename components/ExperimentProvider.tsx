'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { assignVariant } from '@/lib/experiments/assign';
import type { ExperimentConfig, VariantId } from '@/lib/experiments/types';
import { getSessionId } from '@/lib/session';

type ExperimentContextValue = {
  experimentId: string;
  variant: VariantId;
  isEnabled: boolean;
  traffic: Record<VariantId, number>;
};

const Ctx = createContext<ExperimentContextValue | null>(null);
const EXP_COOKIE = 'exp_home_narrative_v1';
const OVERRIDE_KEY = 'exp_home_narrative_v1_override';

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; samesite=lax`;
}

function readOverride(config: ExperimentConfig): ExperimentConfig {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    if (!raw) return config;
    const parsed = JSON.parse(raw) as Partial<ExperimentConfig>;
    return {
      ...config,
      isEnabled: typeof parsed.isEnabled === 'boolean' ? parsed.isEnabled : config.isEnabled,
      traffic: parsed.traffic ? { ...config.traffic, ...parsed.traffic } : config.traffic,
    };
  } catch {
    return config;
  }
}

export default function ExperimentProvider({ config, children }: { config: ExperimentConfig; children: React.ReactNode }) {
  const [variant, setVariant] = useState<VariantId>('A');
  const [resolvedConfig, setResolvedConfig] = useState(config);

  useEffect(() => {
    const next = readOverride(config);
    setResolvedConfig(next);

    if (!next.isEnabled) {
      setVariant('A');
      setCookie(EXP_COOKIE, 'A');
      return;
    }

    const sid = getSessionId();
    if (!sid) return;
    const v = assignVariant(sid, next.traffic);
    setVariant(v);
    setCookie(EXP_COOKIE, v);
  }, [config]);

  const value = useMemo(
    () => ({ experimentId: resolvedConfig.id, variant, isEnabled: resolvedConfig.isEnabled, traffic: resolvedConfig.traffic }),
    [resolvedConfig.id, resolvedConfig.isEnabled, resolvedConfig.traffic, variant]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExperiment() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useExperiment must be used inside ExperimentProvider');
  return value;
}
