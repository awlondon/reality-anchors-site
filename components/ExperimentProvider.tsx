'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { assignVariant } from '@/lib/experiments/assign';
import type { ExperimentConfig, VariantId } from '@/lib/experiments/types';
import { getSessionId } from '@/lib/session';
import { trackEvent } from '@/lib/analytics';

type ExperimentContextValue = {
  experimentId: string;
  variant: VariantId;
  isEnabled: boolean;
  traffic: Record<VariantId, number>;
  /** Force a specific variant (useful for testing / QA) */
  overrideVariant: (variant: VariantId) => void;
};

const Ctx = createContext<ExperimentContextValue | null>(null);
const STORAGE_PREFIX = 'exp_';

function getCookieName(id: string) { return `${STORAGE_PREFIX}${id}`; }
function getOverrideKey(id: string) { return `${STORAGE_PREFIX}${id}_override`; }

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; samesite=lax`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function readOverride(config: ExperimentConfig): ExperimentConfig {
  try {
    const raw = localStorage.getItem(getOverrideKey(config.id));
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
      setCookie(getCookieName(next.id), 'A');
      return;
    }

    // Check for sticky variant from cookie first (session continuity)
    const cookieName = getCookieName(next.id);
    const sticky = readCookie(cookieName) as VariantId | null;
    if (sticky && Object.keys(next.traffic).includes(sticky)) {
      setVariant(sticky);
      return;
    }

    // Assign new variant based on session ID
    const sid = getSessionId();
    if (!sid) return;
    const v = assignVariant(sid, next.traffic);
    setVariant(v);
    setCookie(cookieName, v);

    // Track experiment exposure
    trackEvent('experiment_exposure', {
      experimentId: next.id,
      variant: v,
    });
  }, [config]);

  const overrideVariant = useCallback((v: VariantId) => {
    setVariant(v);
    setCookie(getCookieName(resolvedConfig.id), v);
    trackEvent('experiment_override', { experimentId: resolvedConfig.id, variant: v });
  }, [resolvedConfig.id]);

  const value = useMemo(
    () => ({
      experimentId: resolvedConfig.id,
      variant,
      isEnabled: resolvedConfig.isEnabled,
      traffic: resolvedConfig.traffic,
      overrideVariant,
    }),
    [resolvedConfig.id, resolvedConfig.isEnabled, resolvedConfig.traffic, variant, overrideVariant]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExperiment() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useExperiment must be used inside ExperimentProvider');
  return value;
}
