'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { stagger, fadeUp } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';
import { pricingNarrative, pricingTiers, deviceAddOns } from '@/data/pricing';

export default function Tiers() {
  return (
    <section className="relative overflow-hidden py-24 bg-bg-2">
      <PhotoBackground
        src="/images/cnc-precision.jpg"
        opacity={0.06}
        gradient="from-bg-2/95 via-bg-2/85 to-bg-2/95"
        position="center 50%"
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-10"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">{pricingNarrative.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-3xl leading-tight">
            {pricingNarrative.title}
          </h2>
          <p className="mt-3 text-muted max-w-3xl">{pricingNarrative.body}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12 grid gap-3 rounded-2xl border border-line bg-card/70 p-6 md:grid-cols-3"
        >
          {pricingNarrative.bullets.map((bullet) => (
            <div key={bullet} className="flex gap-3 text-sm text-muted leading-relaxed">
              <span className="mt-0.5 text-accent">+</span>
              <span>{bullet}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3"
        >
          {pricingTiers.map((tier) => (
            <motion.article
              key={tier.id}
              variants={fadeUp}
              className={`relative flex h-full flex-col gap-5 rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-0.5 ${
                tier.highlight
                  ? 'border-accent/50 bg-gradient-to-b from-accent/8 to-card shadow-xl shadow-accent/10'
                  : 'border-line bg-card hover:border-line/80'
              }`}
            >
              <div
                className={`absolute -top-3 left-7 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                  tier.highlight ? 'bg-accent text-white' : 'border border-line bg-card text-muted'
                }`}
              >
                {tier.badge}
              </div>

              <div className="pt-1">
                <div className="text-lg font-semibold text-txt">{tier.name}</div>
                <div className="mt-1 font-mono text-sm text-accent-2">{tier.price}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{tier.description}</p>
              </div>

              <div className="space-y-3 rounded-xl border border-line/70 bg-bg/40 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Included usage</p>
                <div className="text-sm text-muted">
                  <span className="font-semibold text-txt">Cameras:</span> {tier.includedUsage.cameras}
                </div>
                <div className="text-sm text-muted">
                  <span className="font-semibold text-txt">Storage:</span> {tier.includedUsage.storage}
                </div>
                <div className="text-sm text-muted">
                  <span className="font-semibold text-txt">Overage:</span> {tier.includedUsage.overage}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Best fit</p>
                <p className="text-sm leading-relaxed text-muted">{tier.fit}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tier.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                  Tier-defining modules
                </p>
                <div className="flex flex-wrap gap-2">
                  {tier.moduleIds.map((moduleId) => (
                    <span
                      key={moduleId}
                      className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent-2"
                    >
                      {moduleId}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={tier.href}
                className={`mt-auto rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all ${
                  tier.highlight
                    ? 'bg-accent text-white hover:bg-blue-500'
                    : 'border border-line text-txt hover:border-accent/40 hover:text-accent-2'
                }`}
                onClick={() => trackEvent('tier_click', { tier: tier.name })}
              >
                {tier.cta}
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10 border border-line bg-card rounded-2xl p-7"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-2">Device Add-Ons</p>
          <p className="text-sm text-muted mb-5">
            Every bench includes one reference camera. Add devices when your operation needs wider coverage or precision depth.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {deviceAddOns.map((device) => (
              <div key={device.id} className="border border-line/70 rounded-xl p-5 bg-bg/40">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-semibold text-txt">{device.name}</span>
                  <span className="font-mono text-sm text-accent-2">{device.price}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{device.description}</p>
                <p className="mt-2 text-[10px] text-muted/70 italic">{device.valueAnchor}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
