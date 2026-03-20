'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const proofSteps = [
  { label: 'Set Up', sub: 'Your job specs, your bench' },
  { label: 'Capture', sub: 'Structured camera data' },
  { label: 'Validate', sub: 'Checked before it leaves the bench' },
  { label: 'Record', sub: 'Auditable proof of every run' },
  { label: 'Measure', sub: 'Visible accuracy, run after run' },
];

export default function CaptureLoop() {
  return (
    <section className="relative overflow-hidden py-20 bg-bg">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
            Run-Level Proof
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-2xl mx-auto leading-tight">
            Every job run builds proof
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Each run produces verified, auditable results. Accuracy is visible over time — and your data stays yours.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          className="flex flex-col md:flex-row items-center justify-center gap-0"
        >
          {proofSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-full border-2 border-accent/60 bg-accent/10 flex items-center justify-center mb-3">
                  <span className="text-accent-2 font-mono font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-txt leading-snug">{step.label}</p>
                <p className="text-xs text-muted mt-1">{step.sub}</p>
              </div>

              {i < proofSteps.length - 1 && (
                <div className="hidden md:flex items-center mx-1 text-accent/50" aria-hidden="true">
                  <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                    <path d="M0 6h24m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}
