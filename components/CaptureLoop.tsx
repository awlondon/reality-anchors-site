'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const loopSteps = [
  { label: 'Declare Known Facts', sub: 'Bar size, spec, material' },
  { label: 'Capture', sub: 'Structured camera data' },
  { label: 'Upload', sub: 'Cloud sync & metadata' },
  { label: 'Train', sub: 'Model learns from verified data' },
  { label: 'Improve', sub: 'Faster, more accurate next cycle' },
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
            The Learning Loop
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-2xl mx-auto leading-tight">
            Every capture makes the system smarter
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Deterministic capture feeds a continuous improvement cycle. Start from what you know, and let each cycle tighten accuracy.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          className="flex flex-col md:flex-row items-center justify-center gap-0"
        >
          {loopSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-full border-2 border-accent/60 bg-accent/10 flex items-center justify-center mb-3">
                  <span className="text-accent-2 font-mono font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-txt leading-snug">{step.label}</p>
                <p className="text-xs text-muted mt-1">{step.sub}</p>
              </div>

              {i < loopSteps.length - 1 && (
                <div className="hidden md:flex items-center mx-1 text-accent/50" aria-hidden="true">
                  <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                    <path d="M0 6h24m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Loop-back arrow */}
          <div className="hidden md:flex items-center ml-2 text-accent/40" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 16C4 9.4 9.4 4 16 4s12 5.4 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
              <path d="M28 16l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        {/* Mobile: vertical indicator that the loop repeats */}
        <div className="md:hidden flex justify-center mt-4" aria-hidden="true">
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="text-accent/40">
            <path d="M12 0v32m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="12" y="38" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="monospace">LOOP</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
