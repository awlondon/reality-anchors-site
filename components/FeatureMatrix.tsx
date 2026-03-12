'use client';

import { motion } from 'framer-motion';
import { features, featureCategories, type TierAvailability } from '@/data/features';
import { fadeUp, stagger } from '@/lib/motion';

const tierNames = ['personal', 'commercial', 'industrial'] as const;
const tierLabels = { personal: 'Personal', commercial: 'Commercial', industrial: 'Industrial' };

function AvailabilityIcon({ value }: { value: TierAvailability }) {
  if (value === true) {
    return (
      <span aria-label="Included" className="text-emerald-400">
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === 'limited') {
    return (
      <span aria-label="Limited" className="text-xs text-amber-400 font-medium">Limited</span>
    );
  }
  if (value === 'custom') {
    return (
      <span aria-label="Custom" className="text-xs text-accent font-medium">Custom</span>
    );
  }
  return (
    <span aria-label="Not included" className="text-muted/40">
      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Feature Comparison</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-txt">
            What&rsquo;s included in each tier
          </h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-3 pr-4 text-sm font-medium text-muted w-2/5" />
                {tierNames.map((t) => (
                  <th key={t} className="py-3 px-3 text-center text-sm font-semibold text-txt w-1/5">
                    {tierLabels[t]}
                  </th>
                ))}
              </tr>
            </thead>
            {featureCategories.map((category) => {
              const categoryFeatures = features.filter((f) => f.category === category);
              return (
                <motion.tbody key={category} variants={fadeUp}>
                  <tr>
                    <td
                      colSpan={4}
                      className="pt-6 pb-2 text-xs font-bold tracking-[0.15em] uppercase text-accent"
                    >
                      {category}
                    </td>
                  </tr>
                  {categoryFeatures.map((feature) => (
                    <tr key={feature.id} className="border-b border-line/50 group">
                      <td className="py-3 pr-4">
                        <div className="text-sm text-txt font-medium">{feature.name}</div>
                        <div className="text-[11px] text-muted/70 mt-0.5 leading-snug max-w-xs hidden group-hover:block">
                          {feature.description}
                        </div>
                      </td>
                      {tierNames.map((t) => (
                        <td key={t} className="py-3 px-3 text-center">
                          <AvailabilityIcon value={feature.tiers[t]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </motion.tbody>
              );
            })}
          </table>
        </motion.div>

        <p className="text-[11px] text-muted/50 text-center mt-6">
          All tiers include standard security and data encryption. Enterprise features available on annual agreements.
        </p>
      </div>
    </section>
  );
}
