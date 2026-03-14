'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { stagger, fadeUp } from '@/lib/motion';
import { regimeCatalog } from '@/lib/siteData';

const CORE_TIERS = new Set(['Core', 'Pro']);

const displayOverrides: Record<
  string,
  {
    stat: string;
    statTwo: string;
    cta: string;
    href: string;
    bg: string;
    accent: string;
    imageMobile: string;
  }
> = {
  'structural-fabrication': {
    stat: 'Deterministic bench guidance',
    statTwo: 'Known facts declared once',
    cta: 'See Fabrication Intelligence',
    href: '/commercial/',
    bg: 'from-slate-900 via-slate-800 to-slate-950',
    accent: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    imageMobile: '/assets/regimes/structural-fabrication-mobile.svg',
  },
  'multi-project-optimization': {
    stat: 'Less setup repetition',
    statTwo: 'Cleaner capture across jobs',
    cta: 'Optimize Across Jobs',
    href: '/industrial/',
    bg: 'from-zinc-900 via-slate-800 to-zinc-950',
    accent: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    imageMobile: '/assets/regimes/multi-project-optimization-mobile.svg',
  },
  'machine-calibration': {
    stat: 'Calibration-aware validation',
    statTwo: 'Optional precision depth',
    cta: 'See Calibration Mode',
    href: '/industrial/',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    accent: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    imageMobile: '/assets/regimes/machine-calibration-mobile.svg',
  },
  'fleet-grip': {
    stat: 'Advanced safety reserved',
    statTwo: 'Packaged separately from base plans',
    cta: 'Explore Fleet Safety Layer',
    href: '/commercial/',
    bg: 'from-zinc-900 via-neutral-800 to-slate-950',
    accent: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    imageMobile: '/assets/regimes/fleet-grip-mobile.svg',
  },
  'ar-execution': {
    stat: 'Operator-confirmed steps',
    statTwo: 'Validation before irreversible work',
    cta: 'See AR Execution',
    href: '/commercial/',
    bg: 'from-slate-900 via-cyan-950 to-slate-950',
    accent: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
    imageMobile: '/assets/regimes/ar-execution-mobile.svg',
  },
  'ai-governance': {
    stat: 'Audit-ready learning loop',
    statTwo: 'Governance before broader rollout',
    cta: 'Review Governance Controls',
    href: '/pricing-methodology/',
    bg: 'from-slate-950 via-violet-950 to-slate-900',
    accent: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
    imageMobile: '/assets/regimes/ai-governance-mobile.svg',
  },
};

const coreRegimes = regimeCatalog.filter((regime) => CORE_TIERS.has(regime.tier));
const advancedRegimes = regimeCatalog.filter((regime) => !CORE_TIERS.has(regime.tier));

function RegimeCard({ regime, compact = false }: { regime: (typeof regimeCatalog)[number]; compact?: boolean }) {
  const display = displayOverrides[regime.id];
  if (!display) return null;

  if (compact) {
    return (
      <motion.article
        key={regime.id}
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-line/50 bg-card/80"
      >
        <div className="flex flex-col p-5">
          <h3 className="mb-2 text-base font-semibold text-txt/80">{regime.title}</h3>
          <p className="mb-3 text-xs leading-relaxed text-muted">{regime.description}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className={`rounded-md border px-2 py-1 text-[11px] font-semibold opacity-70 ${display.accent}`}>
              {display.stat}
            </span>
          </div>
          <Link href={display.href} className="text-xs font-semibold text-muted transition-colors hover:text-accent-2">
            {display.cta} &rarr;
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      key={regime.id}
      variants={fadeUp}
      className={`relative overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-br ${display.bg}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(46,125,235,0.2),transparent_35%)] opacity-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 opacity-70 sm:w-44 md:w-48">
        <picture>
          <source media="(max-width: 767px)" srcSet={display.imageMobile} />
          <img
            src={regime.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain object-right p-3"
          />
        </picture>
      </div>
      <div className="relative flex min-h-[280px] flex-col p-7 md:p-8">
        <h3 className="mb-3 text-xl font-semibold text-white">{regime.title}</h3>
        <p className="max-w-[80%] text-sm leading-relaxed text-slate-200/90 sm:max-w-[70%] md:max-w-[72%]">
          {regime.description}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${display.accent}`}>{display.stat}</div>
          <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${display.accent}`}>{display.statTwo}</div>
        </div>
        <Link
          href={display.href}
          className="mt-auto pt-7 text-sm font-semibold text-white transition-colors hover:text-accent-2"
        >
          {display.cta} &rarr;
        </Link>
      </div>
    </motion.article>
  );
}

export default function Features() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-bg-2 py-24">
      <PhotoBackground
        src="/images/sparks-metal.jpg"
        opacity={0.08}
        gradient="from-bg-2/90 via-bg-2/80 to-bg-2/95"
        position="center 40%"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Core Capabilities</p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-txt md:text-4xl">
            Less repetitive setup. Faster data collection. Mixed hardware that just works.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Reality Anchors eliminates the busywork of configuring every camera and re-entering known facts. Declare
            once, capture everywhere, and let the system handle orchestration across the compatible hardware your team
            already owns.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid gap-6 lg:grid-cols-2"
        >
          {coreRegimes.map((regime) => (
            <RegimeCard key={regime.id} regime={regime} />
          ))}
        </motion.div>

        {advancedRegimes.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-14"
          >
            <motion.p variants={fadeUp} className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Advanced Capabilities
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advancedRegimes.map((regime) => (
                <RegimeCard key={regime.id} regime={regime} compact />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
