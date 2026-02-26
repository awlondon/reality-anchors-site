'use client';

import { useEffect, useRef } from 'react';

type Props = {
  sectionId: string;
};

export function useScrollEngagement({ sectionId }: Props) {
  const startTime = useRef<number | null>(null);
  const totalTime = useRef(0);
  const hasEntered = useRef(false);

  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEntered.current = true;
          startTime.current = performance.now();

          window.dispatchEvent(
            new CustomEvent('analytics', {
              detail: {
                type: 'regime_enter',
                stage: 'regime_enter',
                regimeId: sectionId,
              },
            })
          );
          return;
        }

        if (hasEntered.current && startTime.current !== null) {
          const duration = performance.now() - startTime.current;
          totalTime.current += duration;

          window.dispatchEvent(
            new CustomEvent('analytics', {
              detail: {
                type: 'regime_exit',
                stage: 'regime_exit',
                regimeId: sectionId,
                dwellTimeMs: Math.round(totalTime.current),
              },
            })
          );

          startTime.current = null;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [sectionId]);
}
