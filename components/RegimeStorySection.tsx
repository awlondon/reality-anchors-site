'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useScrollEngagement } from '@/lib/useScrollEngagement';

type Props = {
  id: string;
  children: React.ReactNode;
};

export default function RegimeStorySection({ id, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useScrollEngagement({ sectionId: id });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacityTransform = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = reduceMotion ? 1 : opacityTransform;
  const scale = reduceMotion ? 1 : scaleTransform;

  return (
    <div id={id} ref={ref} className="relative h-[160vh] snap-start">
      <motion.div style={{ opacity, scale }} className="sticky top-0 flex h-screen items-center">
        {children}
      </motion.div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}
