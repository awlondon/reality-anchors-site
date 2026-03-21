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
    description:
      'Start with a single reference camera and a known object in frame. Reality anchors establish real-world scale from day one so capture stays tied to the physical bench, not manual guesswork.',
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
    description:
      'Bring a second camera for wider context or coverage. Mixed device types work together, and measured signals can determine bar size instead of depending on user declaration. +$200/device/mo.',
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
    description:
      'When you need sub-millimetre accuracy, add a LiDAR-equipped device. Precision depth is a premium upgrade, not required for every setup. +$450/device/mo.',
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
    title: 'Measure & Prove',
    description:
      'Every run produces auditable results. Track accuracy, review verified outcomes, and see measurable improvement over time. Included - every run builds proof.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
        <rect x="13" y="24" width="4" height="6" rx="1" fill="#2e7deb" />
        <rect x="19" y="19" width="4" height="11" rx="1" fill="#2e7deb" />
        <rect x="25" y="14" width="4" height="16" rx="1" fill="#2e7deb" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-y border-line/50 bg-bg-2 py-24">
      <PhotoBackground
        src="/images/steel-closeup.jpg"
        opacity={0.05}
        gradient="from-bg-2/95 via-bg-2/85 to-bg-2/95"
        position="center 50%"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">The Capability Ladder</p>
          <h2 className="max-w-lg text-3xl font-semibold leading-tight text-txt md:text-4xl">
            Start simple. Add capability as you need it.
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Begin with one camera and a reality anchor. Scale to mixed fleets and LiDAR precision only when your
            operation demands it.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="relative flex flex-col gap-4 rounded-2xl border border-line bg-card p-6"
            >
              {i > 0 && <div className="absolute -left-3 top-1/2 hidden h-px w-6 bg-line lg:block" aria-hidden="true" />}

              <div className="flex items-center gap-3">
                {step.icon}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-accent">{step.number}</p>
                  <p className="text-base font-semibold text-txt">{step.title}</p>
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-8 max-w-xl rounded-xl border border-line/70 bg-card/50 px-5 py-4 text-center backdrop-blur-sm"
        >
          <p className="mb-1 text-sm font-semibold text-txt">Assists the bench. Doesn&apos;t control it.</p>
          <p className="text-xs leading-relaxed text-muted">
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
            className="inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-blue-500"
            onClick={() => trackEvent('how_it_works_cta')}
          >
            See It Work On Your Cut List &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
