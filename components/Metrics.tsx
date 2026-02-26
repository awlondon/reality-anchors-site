'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { fadeUp, stagger } from '@/lib/motion';
import { siteMetrics } from '@/lib/siteData';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1000;
    const steps = Math.min(target, 60);
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}


export default function Metrics() {
  return (
    <section className="py-24 bg-bg border-y border-line">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-12 text-center"
        >
          Measured Outcomes
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {siteMetrics.measuredOutcomes.map(({ value, suffix, label, sub }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-txt font-mono mb-2">
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-sm font-semibold text-txt mb-1">{label}</div>
              <div className="text-xs text-muted">{sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
