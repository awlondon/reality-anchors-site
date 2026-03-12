'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const proofPoints = [
  { value: '3', label: 'Workcells supported' },
  { value: '100%', label: 'Offline-capable' },
  { value: '0', label: 'Hardware changes' },
  { value: '60 days', label: 'Validation window' },
];

export default function ProofStrip() {
  return (
    <section className="border-b border-line bg-card/50 py-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {proofPoints.map((p) => (
          <div key={p.label} className="flex items-baseline gap-2 text-center">
            <span className="font-mono text-sm font-bold text-accent-2">{p.value}</span>
            <span className="text-[11px] text-muted">{p.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
