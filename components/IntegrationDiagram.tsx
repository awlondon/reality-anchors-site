'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const nodes = [
  { label: 'ERP / Detailing', sub: 'Cut lists, schedules, bar marks' },
  { label: 'Reality Anchors', sub: 'Validate, guide, record', accent: true },
  { label: 'Bench / Operator', sub: 'Step-by-step execution' },
  { label: 'ERP / QA', sub: 'Audit trail, metrics, exports' },
];

export default function IntegrationDiagram() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-0 overflow-x-auto">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center flex-1 min-w-0">
            <div
              className={`flex-1 rounded-xl px-4 py-4 text-center ${
                node.accent
                  ? 'border-2 border-accent/60 bg-accent/10'
                  : 'border border-line bg-card/60'
              }`}
            >
              <p className={`text-sm font-semibold ${node.accent ? 'text-accent-2' : 'text-txt'}`}>
                {node.label}
              </p>
              <p className="text-[11px] text-muted mt-1">{node.sub}</p>
            </div>
            {i < nodes.length - 1 && (
              <div className="hidden sm:flex items-center px-2 text-line" aria-hidden="true">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                  <path d="M0 6h16M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
