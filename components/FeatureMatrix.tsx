'use client';

import { motion } from 'framer-motion';
import { features, featureCategories, type TierAvailability } from '@/data/features';
import { fadeUp, stagger } from '@/lib/motion';

const tierNames = ['pilot', 'production', 'enterprise'] as const;

const tierLabels: Record<(typeof tierNames)[number], string> = {
  pilot: 'Pilot',
  production: 'Production',
  enterprise: 'Enterprise',
};

const tierPrices: Record<(typeof tierNames)[number], string> = {
  pilot: '$1,200/bench/mo',
  production: '$3,200/bench/mo',
  enterprise: '$4,800/bench/mo',
};

function AvailabilityIcon({ value }: { value: TierAvailability }) {
  if (value === true) {
    return (
      <span aria-label="Included" className="text-emerald-400">
        <svg className="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (value === 'limited') {
    return (
      <span aria-label="Limited" className="text-xs font-medium text-amber-400">
        Limited
      </span>
    );
  }

  if (value === 'custom') {
    return (
      <span aria-label="Custom" className="text-xs font-medium text-accent">
        Custom
      </span>
    );
  }

  return (
    <span aria-label="Not included" className="text-muted/40">
      <svg className="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    </span>
  );
}

export default function FeatureMatrix() {
  return (
    <section className="relative py-16 bg-bg-2">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Feature Comparison</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-txt">Plan designations mapped to commercial capabilities</h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Pilot starts with guided validation and daily reporting. Production adds analytics, QA review, and custom
            calibration controls. Enterprise adds formal export and audit capabilities. Public plan labels are live now;
            some access gates are still rolling out behind them.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="overflow-x-auto"
        >
          <table className="min-w-[640px] w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="w-2/5 py-3 pr-4 text-left text-sm font-medium text-muted" />
                {tierNames.map((tier) => (
                  <th
                    key={tier}
                    className={`w-1/5 py-3 px-3 text-center ${tier === 'production' ? 'rounded-t-lg bg-accent/5' : ''}`}
                  >
                    <div className="text-sm font-semibold text-txt">{tierLabels[tier]}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted">{tierPrices[tier]}</div>
                    <div className="mt-0.5 text-[10px] text-muted/70">Incl. 1 reference camera</div>
                  </th>
                ))}
              </tr>
            </thead>

            {featureCategories.map((category) => {
              const categoryFeatures = features.filter((feature) => feature.category === category);

              return (
                <motion.tbody key={category} variants={fadeUp}>
                  <tr>
                    <td colSpan={4} className="pt-6 pb-2 text-xs font-bold uppercase tracking-[0.15em] text-accent">
                      {category}
                    </td>
                  </tr>

                  {categoryFeatures.map((feature) => (
                    <tr key={feature.name} className="group border-b border-line/50">
                      <td className="py-3 pr-4 align-top">
                        <div className="text-sm font-medium text-txt">{feature.name}</div>
                        <div className="mt-1 hidden max-w-xs text-[11px] leading-snug text-muted/70 group-hover:block">
                          {feature.description}
                        </div>
                      </td>
                      {tierNames.map((tier) => (
                        <td
                          key={tier}
                          className={`py-3 px-3 text-center ${tier === 'production' ? 'bg-accent/5' : ''}`}
                        >
                          <AvailabilityIcon value={feature.tiers[tier]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </motion.tbody>
              );
            })}
          </table>
        </motion.div>

        <p className="mt-6 text-center text-[11px] text-muted/50">
          Additional devices: context cameras at $200/device/mo, LiDAR-equipped devices at $450/device/mo.
          Advanced safety workflows are packaged separately until those controls are explicitly scoped.
        </p>
      </div>
    </section>
  );
}
