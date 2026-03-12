'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import caseStudies from '@/data/caseStudies';

export default function CaseStudies() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Illustrative Scenarios</p>
          <h2 className="text-2xl font-semibold text-txt mb-2">Modeled deployment outcomes</h2>
          <p className="text-sm text-muted mb-8 max-w-xl">
            Representative scenarios illustrating how the platform is designed to perform across different fabrication environments. Based on modeled assumptions, not specific customer data.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5"
        >
          {caseStudies.map((cs) => (
            <motion.article
              key={cs.id}
              variants={fadeUp}
              className="border border-line bg-card rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-txt mb-1">{cs.title}</h3>
              <p className="text-[11px] text-muted mb-4">{cs.industry}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line/50">
                      <th className="text-left font-medium text-muted pb-1.5 pr-3">Metric</th>
                      <th className="text-right font-medium text-muted pb-1.5 px-2">Typical</th>
                      <th className="text-right font-medium text-muted pb-1.5 pl-2">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cs.before.map((b, i) => (
                      <tr key={b.label} className="border-b border-line/30">
                        <td className="py-1.5 pr-3 text-muted">{b.label}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-muted/70">{b.value}</td>
                        <td className="py-1.5 pl-2 text-right font-mono text-accent-2 font-semibold">{cs.after[i].value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 pt-3 border-t border-line/50 flex items-baseline gap-2">
                <span className="text-[10px] text-muted uppercase tracking-wide">Modeled ROI</span>
                <span className="font-mono text-sm font-bold text-accent-2">{cs.payback}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
