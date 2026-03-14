'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const proofPoints = [
  { value: '1 camera', label: 'Baseline setup' },
  { value: 'BYO', label: 'Compatible hardware' },
  { value: 'Optional', label: 'LiDAR upgrade' },
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
        className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6"
      >
        {proofPoints.map((point) => (
          <div key={point.label} className="flex items-baseline gap-2 text-center">
            <span className="font-mono text-sm font-bold text-accent-2">{point.value}</span>
            <span className="text-[11px] text-muted">{point.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
