'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import PhotoBackground from '@/components/PhotoBackground';
import { fadeUp } from '@/lib/motion';
import { siteMetrics } from '@/lib/siteData';

function GuideIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
      <path
        d="M10 18 L15.5 23.5 L27 11"
        stroke="#2e7deb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ValidateIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
      <rect x="11" y="22" width="5" height="8" rx="1" fill="#2e7deb" />
      <rect x="18" y="16" width="5" height="14" rx="1" fill="#2e7deb" />
      <rect x="25" y="9" width="5" height="21" rx="1" fill="#2e7deb" />
    </svg>
  );
}

function RecordIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
      <rect x="11" y="6" width="18" height="23" rx="2" stroke="#2e7deb" strokeWidth="1.5" />
      <line x1="15" y1="12" x2="25" y2="12" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="16" x2="25" y2="16" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="20" x2="25" y2="20" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface CardData {
  icon: ReactNode;
  tag: string;
  title: string;
  body: string;
  metric: string;
  metricSuffix: string;
}

export default function ValueBridge() {
  const cards: CardData[] = [
    {
      icon: <GuideIcon />,
      tag: 'CAPTURE',
      title: 'Bring your own cameras',
      body: 'Start with compatible hardware you already own. Reference, context, and depth devices can work together in one fleet, and not every camera needs LiDAR.',
      metric: siteMetrics.valueBridge.governMetric,
      metricSuffix: 'error-rate target after deterministic validation',
    },
    {
      icon: <ValidateIcon />,
      tag: 'VALIDATE',
      title: 'Anchor to known facts first',
      body: 'The workflow begins with declared bar size, job context, and operator-confirmed steps. Reality Anchors validates against those constraints instead of pretending the system is fully autonomous on day one.',
      metric: siteMetrics.valueBridge.optimizeMetric,
      metricSuffix: 'scrap-reduction target from cleaner execution',
    },
    {
      icon: <RecordIcon />,
      tag: 'LEARN',
      title: 'Every capture builds proof',
      body: 'Structured capture turns each verified run into training data. The loop tightens accuracy over time — and every metric is verified against actual production outcomes, not projections.',
      metric: siteMetrics.valueBridge.traceMetric,
      metricSuffix: 'accuracy target as the loop improves',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-bg py-12">
      <PhotoBackground
        src="/images/operator-work.jpg"
        opacity={0.06}
        gradient="from-bg/90 via-bg/85 to-bg/90"
        position="center 40%"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">How It Adds Up</p>

          <div
            className="w-full max-w-5xl rounded-xl border border-line/50 bg-bg-2 p-3 md:p-5"
            role="region"
            aria-label="Reality Anchors core value: Capture, Validate, Learn"
          >
            <div className="flex flex-col items-stretch gap-3 md:flex-row">
              {cards.flatMap((card, index) => {
                const connector =
                  index > 0 ? (
                    <div
                      key={`conn-${card.tag}`}
                      className="hidden w-10 flex-shrink-0 items-center justify-center md:flex"
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="h-[5px] w-[5px] rounded-full bg-accent opacity-85" />
                        <div className="h-[5px] w-[5px] rounded-full bg-accent opacity-55" />
                        <div className="h-[5px] w-[5px] rounded-full bg-accent opacity-30" />
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#1e3048">
                          <path d="M0 0 L10 5 L0 10 z" />
                        </svg>
                      </div>
                    </div>
                  ) : null;

                const cardEl = (
                  <div
                    key={card.tag}
                    className="relative flex-1 overflow-hidden rounded-xl border border-line bg-card px-5 pb-5 pt-6"
                  >
                    <div className="absolute left-0 right-0 top-0 h-[3px] bg-accent" />
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <div>
                        <p className="mb-1 text-[9px] font-bold uppercase leading-none tracking-[2.2px] text-accent">
                          {card.tag}
                        </p>
                        <p className="text-sm font-semibold leading-snug text-txt">{card.title}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted">{card.body}</p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-xl font-bold text-accent-2">{card.metric}</span>
                      <span className="text-[10px] text-muted">{card.metricSuffix}</span>
                    </div>
                  </div>
                );

                return connector ? [connector, cardEl] : [cardEl];
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
