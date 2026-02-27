'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { stagger, fadeUp } from '@/lib/motion';

const regimes = [
  {
    name: 'Structural Fabrication Program',
    description:
      'Clear, confirmed instructions at the workstation to reduce waste and improve consistency.',
    stat: '8% avg scrap reduction',
    statTwo: '<1% fabrication error rate',
    cta: 'See Fabrication Intelligence',
    href: '/commercial/',
    image: '/assets/regimes/structural-fabrication.svg',
    bg: 'from-slate-900 via-slate-800 to-slate-950',
    accent: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
  },
  {
    name: 'Cross-Project Optimization Program',
    description:
      'Consolidate cut demand across active jobs, improve reusable stock visibility, and return cleaner material insights upstream.',
    stat: '18–35% scrap reutilization increase',
    statTwo: '4–12 hrs/week planning saved',
    cta: 'Optimize Across Jobs',
    href: '/industrial/',
    image: '/assets/regimes/multi-project-optimization.svg',
    bg: 'from-zinc-900 via-slate-800 to-zinc-950',
    accent: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  },
  {
    name: 'Machine Calibration Program',
    description:
      'Monitor machine behavior in operation so teams can maintain stable output across shifts.',
    stat: 'Real-time angle tracking',
    statTwo: 'Drift alerts + stretch profile updates',
    cta: 'See Calibration Mode',
    href: '/industrial/',
    image: '/assets/regimes/machine-calibration.svg',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    accent: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
  },
  {
    name: 'Vehicle Stability & Grip Program',
    description:
      'Live operating-condition alerts help crews address risk early and maintain safer fleet operations.',
    stat: 'Live slip-risk alerts',
    statTwo: 'Insurance-grade telemetry stream',
    cta: 'Explore Fleet Safety Layer',
    href: '/commercial/',
    image: '/assets/regimes/fleet-grip.svg',
    bg: 'from-zinc-900 via-neutral-800 to-slate-950',
    accent: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  },
  {
    name: 'AR Execution Program',
    description:
      'Deliver point-of-work guidance that helps operators execute accurately under real shop conditions.',
    stat: 'Hands-free workflow guidance',
    statTwo: 'Live bend verification + audit logs',
    cta: 'See AR Execution',
    href: '/commercial/',
    image: '/assets/regimes/ar-execution.svg',
    bg: 'from-slate-900 via-cyan-950 to-slate-950',
    accent: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  },
  {
    name: 'AI Oversight Program',
    description:
      'Strengthen platform fidelity with audit-ready records, reliability trends, and execution-grounded accountability.',
    stat: 'Reliability trend tracking',
    statTwo: 'Drift alerts + audit-ready logs',
    cta: 'Review Governance Controls',
    href: '/pricing-methodology/',
    image: '/assets/regimes/ai-governance.svg',
    bg: 'from-slate-950 via-violet-950 to-slate-900',
    accent: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-bg-2 border-y border-line/70">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Strategic Role in the Fabrication Stack</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-3xl leading-tight">
            Closed-loop execution intelligence for fabrication operations
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            We complement detailing and ERP systems by converting planning intent into verified execution outcomes and feedback-ready telemetry.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6"
        >
          {regimes.map((regime) => (
            <motion.article
              key={regime.name}
              variants={fadeUp}
              className={`relative overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-br ${regime.bg}`}
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(46,125,235,0.2),transparent_35%)]" />
              <div className="absolute inset-y-0 right-0 w-28 sm:w-44 md:w-48 opacity-70 pointer-events-none">
                <Image
                  src={regime.image}
                  alt=""
                  fill
                  aria-hidden
                  className="object-contain object-right p-3"
                  sizes="192px"
                />
              </div>
              <div className="relative p-7 md:p-8 min-h-[280px] flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-3">{regime.name}</h3>
                <p className="text-slate-200/90 text-sm leading-relaxed max-w-[80%] sm:max-w-[70%] md:max-w-[72%]">{regime.description}</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${regime.accent}`}>{regime.stat}</div>
                  <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${regime.accent}`}>{regime.statTwo}</div>
                </div>

                <Link
                  href={regime.href}
                  className="mt-auto pt-7 text-sm font-semibold text-white hover:text-accent-2 transition-colors"
                >
                  {regime.cta} →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
