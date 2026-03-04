'use client';

import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';

type FunnelContextValue = {
  lastRegimeSeen: string | null;
  setLastRegime: (regimeId: string) => void;
};

const FunnelCtx = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [lastRegimeSeen, setLastRegimeSeen] = useState<string | null>(null);
  const setLastRegime = useCallback((regimeId: string) => {
    setLastRegimeSeen(regimeId);
  }, []);

  return (
    <FunnelCtx.Provider value={{ lastRegimeSeen, setLastRegime }}>
      {children}
    </FunnelCtx.Provider>
  );
}

export function useFunnelContext() {
  const ctx = useContext(FunnelCtx);
  if (!ctx) throw new Error('useFunnelContext must be used inside FunnelProvider');
  return ctx;
}

// Backwards-compatible exports for consumers that haven't migrated yet.
// These use module-level state as a fallback when outside FunnelProvider.
let _fallbackRegime: string | null = null;

export function setLastRegime(regimeId: string) {
  _fallbackRegime = regimeId;
}

export function getLastRegime() {
  return _fallbackRegime;
}
