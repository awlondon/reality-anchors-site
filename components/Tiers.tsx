'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { stagger, fadeUp } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';

const tiers = [
  {
    name: 'Personal',
    href: '/personal/',
    price: '$19–$199/mo',
    badge: 'Basic',
    desc: 'Execution guidance for solo operators and small crews. Offline-first, 1–8 seats, with a clean upgrade path into commercial workflows.',
    tags: ['Execution guidance', 'Offline-first', '1–8 seats'],
    cta: 'Explore Personal',
  },
  {
    name: 'Commercial',
    href: '/commercial/',
    price: '$2k–$25k/yr',
    badge: 'Pro',
    desc: 'Value-aligned execution infrastructure for fabrication yards. Reinforces upstream planning tools through verified bench-level outcomes.',
    tags: ['Bench execution', 'Scrap reduction', 'Audit logs'],
    cta: 'Explore Commercial',
    highlight: true,
  },
  {
    name: 'Industrial',
    href: '/industrial/',
    price: 'Custom agreement',
    badge: 'Advanced',
    desc: 'Enterprise execution standardization for high-volume plants with ERP integration, calibration governance, and compliance-grade traceability.',
    tags: ['Throughput', 'ERP integration', 'Traceability'],
    cta: 'Explore Industrial',
  },
];

export default function Tiers() {
  return (
    <section className="relative overflow-hidden py-24 bg-bg-2">
      <PhotoBackground src="/images/cnc-precision.jpg" opacity={0.06} gradient="from-bg-2/95 via-bg-2/85 to-bg-2/95" position="center 50%" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-lg leading-tight">
            Scope that fits the operation
          </h2>
          <p className="mt-3 text-muted max-w-xl">
            From a single bench to an enterprise fleet. Pricing scales with the value delivered, not the number of features turned on.
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
              <div className={`absolute -top-3 left-7 px-3 py-0.5 text-[11px] font-bold tracking-wide rounded-full uppercase ${
                t.highlight
                  ? 'bg-accent text-white'
                  : 'bg-card border border-line text-muted'
              }`}>
                {t.badge}
              </div>

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
