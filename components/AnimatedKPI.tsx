'use client';

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  regimeId?: string;
  kpiIndex?: number;
};

export default function AnimatedKPI({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 0.8,
  regimeId,
  kpiIndex,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  // Initialize to real value so static HTML shows correct numbers
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    damping: 15,
    stiffness: 120,
    duration,
  });
  const formattedValue = useTransform(spring, (latest) => `${prefix}${latest.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    motionValue.jump(0);
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hydrated) return;

    if (reduceMotion) {
      motionValue.set(value);
      return;
    }

    if (isInView) {
      motionValue.set(value);
    }
  }, [hydrated, isInView, motionValue, reduceMotion, value]);

  useEffect(() => {
    if (!isInView) return;

    window.dispatchEvent(
      new CustomEvent('analytics', {
        detail: {
          type: 'kpi_reveal',
          stage: 'regime_kpi_reveal',
          regimeId,
          kpiIndex,
          value,
        },
      })
    );
  }, [isInView, kpiIndex, regimeId, value]);

  return (
    <motion.span
      ref={ref}
      animate={{ scale: isInView && !reduceMotion ? [1, 1.06, 1] : 1 }}
      transition={{ duration: 0.6 }}
      className="inline-block"
    >
      {formattedValue}
    </motion.span>
  );
}
