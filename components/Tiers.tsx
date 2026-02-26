'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { stagger, fadeUp } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';

const tiers = [
  {
    name: 'Personal',
    href: '/personal/',
    price: '$5–$50/mo',
    desc: 'Curated regimes for individual operators and small shops. Pre-built, pre-tested, versioned before release.',
    tags: ['Curated regimes', 'Offline-first', 'Continuous use'],
    cta: 'Explore Personal',
  },
  {
    name: 'Commercial',
    href: '/commercial/',
    price: '$2k–$25k/yr',
    desc: 'Bench-first execution for crews and fabrication yards. Pricing based on modeled value, not self-reported scrap.',
    tags: ['Bench-first', 'Savings modeled', 'Audit logs'],
    cta: 'Explore Commercial',
    highlight: true,
  },
  {
    name: 'Industrial',
    href: '/industrial/',
    price: 'Custom agreement',
    desc: 'High-volume plants with traceability, machine calibration governance, and ERP integration readiness.',
    tags: ['Throughput', 'Traceability', 'Integration'],
    cta: 'Explore Industrial',
  },
];

export default function Tiers() {
  return (
    <section className="py-24 bg-bg-2">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-lg leading-tight">
            Choose your path
          </h2>
          <p className="mt-3 text-muted max-w-xl">
            Different buyers optimize for different outcomes. Product surface and contract terms follow that reality.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className={`relative border rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-0.5 ${
                t.highlight
                  ? 'border-accent/50 bg-gradient-to-b from-accent/8 to-card shadow-xl shadow-accent/10'
                  : 'border-line bg-card hover:border-line/80'
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-7 px-3 py-0.5 bg-accent text-white text-[11px] font-bold tracking-wide rounded-full uppercase">
                  Most popular
                </div>
              )}

              <div>
                <div className="text-lg font-semibold text-txt">{t.name}</div>
                <div className="text-accent-2 font-mono text-sm mt-1">{t.price}</div>
              </div>

              <p className="text-muted text-sm leading-relaxed flex-1">{t.desc}</p>

              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-line text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={t.href}
                className={`text-sm font-semibold py-2.5 px-4 rounded-lg text-center transition-all ${
                  t.highlight
                    ? 'bg-accent hover:bg-blue-500 text-white'
                    : 'border border-line hover:border-accent/40 text-txt hover:text-accent-2'
                }`}
                onClick={() => trackEvent('tier_click', { tier: t.name })}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
