'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import PhotoBackground from '@/components/PhotoBackground';
import { fadeUp, stagger } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';

const bullets = [
  'Imports cut lists from existing job sheets \u2014 photo-assisted entry, CSV, or manual entry.',
  'Applies stretch allowances and bend deduction rules automatically per bar mark.',
  'Sequences cuts to minimize drop-off waste and reduce setup churn.',
  'Works on standard tablets. Fully functional offline \u2014 syncs when connected.',
];

const specRows = [
  { label: 'IMPORT', value: 'Photo assist \u00b7 CSV \u00b7 Manual entry' },
  { label: 'STRETCH', value: 'Auto-applied per bar mark + diameter' },
  { label: 'SEQUENCE', value: 'Cut sequencing \u00b7 drop-off minimization' },
  { label: 'VALIDATE', value: 'Hold-point checks against live job context' },
  { label: 'LOG', value: 'Timestamped \u00b7 per-operator \u00b7 per-machine' },
  { label: 'EXPORT', value: 'Audit trail \u00b7 ERP feed \u00b7 QA report' },
];

export default function FieldProof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView && !fired) {
      setFired(true);
      trackEvent('field_proof_view');
    }
  }, [inView, fired]);

  return (
    <section ref={ref} className="relative overflow-hidden py-24 bg-bg-2 border-y border-line/50">
      <PhotoBackground src="/images/quality-control.jpg" opacity={0.06} gradient="from-bg-2/95 via-bg-2/85 to-bg-2/95" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-start"
        >
          {/* Left — narrative */}
          <motion.div variants={fadeUp}>
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
              Built for the Bench
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-txt leading-tight mb-6">
              Your operators keep their process. The system makes it more reliable.
            </h2>

            <ul className="flex flex-col gap-3 mb-8">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted leading-relaxed">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* Risk reversal callout */}
            <div className="border border-line/70 bg-card/50 backdrop-blur-sm rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-txt mb-1">
                Assists the bench. Doesn&apos;t control it.
              </p>
              <p className="text-xs text-muted leading-relaxed">
                Operators confirm every step. The system validates&nbsp;&mdash; it doesn&apos;t override.
              </p>
            </div>
          </motion.div>

          {/* Right — spec list */}
          <motion.div variants={fadeUp} className="border border-line bg-card rounded-2xl p-6 md:p-8">
            <p className="text-[10px] font-bold tracking-[2px] text-accent uppercase mb-5">
              System Pipeline
            </p>
            <div className="flex flex-col gap-3">
              {specRows.map((row) => (
                <div key={row.label} className="flex gap-4 items-baseline">
                  <span className="text-[10px] font-bold tracking-[2px] text-accent-2 uppercase font-mono w-20 shrink-0">
                    {row.label}
                  </span>
                  <span className="text-sm text-muted leading-relaxed">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
