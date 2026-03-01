'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { stagger, fadeUp } from '@/lib/motion';

const steps = [
  {
    number: '01',
    title: 'Import',
    description: 'Load cut lists from existing schedules, manual entry, or photo import with OCR assist. No special file format required.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <path d="M14 26V14h12v12H14z" stroke="#2e7deb" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 18v4m0 0l-2-2m2 2l2-2" stroke="#2e7deb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Guide',
    description: 'Operators follow step-by-step execution sequences with hold points, counters, and machine-specific parameters.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <path d="M12 20l5.5 5.5L30 13" stroke="#2e7deb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Validate',
    description: 'Each step is verified against live job context. Deviations are caught before they become scrap, rework, or delays.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <path d="M20 12v8l4 4" stroke="#2e7deb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="8" stroke="#2e7deb" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Record',
    description: 'Every action is logged with timestamps, operator ID, and machine profiles. Export for audits, QA, or ERP feedback.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <rect x="13" y="10" width="14" height="20" rx="2" stroke="#2e7deb" strokeWidth="1.5" />
        <line x1="17" y1="16" x2="23" y2="16" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="17" y1="20" x2="23" y2="20" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="17" y1="24" x2="21" y2="24" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-line/50">
      <PhotoBackground src="/images/steel-closeup.jpg" opacity={0.05} gradient="from-bg-2/95 via-bg-2/85 to-bg-2/95" position="center 50%" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-lg leading-tight">
            Four steps from job list to audit-ready record
          </h2>
          <p className="mt-3 text-muted max-w-xl">
            No complex integrations required. Start with manual entry and scale into automated workflows as your operation grows.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="relative border border-line bg-card rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Connector line (hidden on first card and mobile) */}
              {i > 0 && (
                <div className="hidden lg:block absolute -left-3 top-1/2 w-6 h-px bg-line" aria-hidden="true" />
              )}

              <div className="flex items-center gap-3">
                {step.icon}
                <div>
                  <p className="text-[10px] font-bold tracking-[2px] text-accent uppercase">{step.number}</p>
                  <p className="text-base font-semibold text-txt">{step.title}</p>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed flex-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10 text-center"
        >
          <Link
            href="/calculator/"
            className="inline-flex px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px"
          >
            Try the Quick Estimate →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
