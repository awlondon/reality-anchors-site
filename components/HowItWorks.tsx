'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { trackEvent } from '@/lib/analytics';
import { stagger, fadeUp } from '@/lib/motion';
import { CTA } from '@/lib/constants';

const steps = [
  {
    number: '01',
    title: 'One Camera',
    description: 'Start with a single reference camera and known bar sizes. Declare the facts, capture structured data, and get deterministic validation from day one.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <rect x="12" y="14" width="16" height="12" rx="2" stroke="#2e7deb" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" stroke="#2e7deb" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Add Context',
    description: 'Bring a second camera for wider context or coverage. Mixed device types work together — reference, context, and standard cameras in one fleet.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <rect x="10" y="15" width="10" height="8" rx="1.5" stroke="#2e7deb" strokeWidth="1.3" />
        <rect x="22" y="13" width="10" height="8" rx="1.5" stroke="#2e7deb" strokeWidth="1.3" />
        <path d="M20 26l-3-3m3 3l3-3" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Precision Depth',
    description: 'When you need sub-millimetre accuracy, add a LiDAR-equipped device. Precision depth is a premium upgrade — not required for every setup.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <circle cx="20" cy="20" r="4" stroke="#2e7deb" strokeWidth="1.3" />
        <circle cx="20" cy="20" r="7" stroke="#2e7deb" strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="20" cy="20" r="10" stroke="#2e7deb" strokeWidth="0.6" strokeDasharray="2 4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Train & Improve',
    description: 'Every capture feeds the learning loop. Upload structured data, train models on verified outcomes, and improve accuracy with each cycle.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <path d="M14 20a6 6 0 0 1 6-6m6 6a6 6 0 0 1-6 6" stroke="#2e7deb" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 14l2 -2m-2 2l-2-2" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 26l2 2m-2-2l-2 2" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
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
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">The Capability Ladder</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-lg leading-tight">
            Start simple. Add capability as you need it.
          </h2>
          <p className="mt-3 text-muted max-w-xl">
            Begin with one camera and known facts. Scale to mixed fleets and LiDAR precision when your operation demands it.
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
              <p className="text-xs text-accent/80 italic mt-1">
                {step.outcome}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Risk reversal — from FieldProof */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-8 max-w-xl mx-auto border border-line/70 bg-card/50 backdrop-blur-sm rounded-xl px-5 py-4 text-center"
        >
          <p className="text-sm font-semibold text-txt mb-1">Assists the bench. Doesn&apos;t control it.</p>
          <p className="text-xs text-muted leading-relaxed">
            Operators confirm every step. The system validates&nbsp;&mdash; it doesn&apos;t override.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={CTA.primary.href}
            className="inline-flex px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px"
            onClick={() => trackEvent('how_it_works_cta')}
          >
            See It Work On Your Cut List →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
