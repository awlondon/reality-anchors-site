'use client';

import { useEffect } from 'react';

export function useScrollDepth() {
  useEffect(() => {
    let maxDepth = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      if (depth > maxDepth) {
        maxDepth = depth;
        window.dispatchEvent(
          new CustomEvent('analytics', {
            detail: {
              type: 'scroll_depth',
              stage: 'scroll_depth',
              scrollDepth: depth,
              depthPercent: depth,
            },
          })
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
