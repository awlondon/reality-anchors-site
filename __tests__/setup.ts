/**
 * Vitest global setup.
 * Provides mocks for browser APIs used by components under test.
 */

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Polyfill IntersectionObserver for jsdom (used by framer-motion viewport features)
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion to avoid animation issues in tests.
// Renders motion.* components as plain HTML elements.
vi.mock('framer-motion', () => {
  const React = require('react');

  const FM_PROPS = new Set([
    'initial', 'animate', 'exit', 'variants', 'transition',
    'whileInView', 'viewport', 'whileHover', 'whileTap',
    'layout', 'layoutId', 'onAnimationComplete', 'mode',
  ]);

  // Cache component references so React doesn't remount on every render
  const cache = new Map();
  const motion = new Proxy({}, {
    get(_: unknown, tag: string) {
      if (tag === '__esModule') return true;
      if (tag === '$$typeof') return undefined;
      if (!cache.has(tag)) {
        const Comp = React.forwardRef(({ children, ...props }: any, ref: any) => {
          const htmlProps: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(props)) {
            if (!FM_PROPS.has(k)) htmlProps[k] = v;
          }
          return React.createElement(tag, { ...htmlProps, ref }, children);
        });
        Comp.displayName = `motion.${tag}`;
        cache.set(tag, Comp);
      }
      return cache.get(tag);
    },
  });

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => true,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
    useMotionValue: (v: number) => ({ get: () => v, set: vi.fn() }),
    useTransform: (v: any) => v,
    fadeUp: {},
  };
});

// Mock analytics (prevent tracking events in tests)
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));
