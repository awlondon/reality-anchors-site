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
      <path d="M10 18 L15.5 23.5 L27 11" stroke="#2e7deb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
      tag: 'GUIDE',
      title: 'Action-Ready Guidance',
      body: 'Translate planning outputs into clear, execution-ready workstation actions. Validated execution reduces interpretation drift — while preserving upstream system continuity.',
      metric: siteMetrics.valueBridge.governMetric,
      metricSuffix: 'fabrication errors',
    },
    {
      icon: <ValidateIcon />,
      tag: 'VALIDATE',
      title: 'In-Process Verification',
      body: 'Each step is verified against live job context and facilities. Material & labour savings it propagates into scrap, delay, and rework.',
      metric: siteMetrics.valueBridge.optimizeMetric,
      metricSuffix: 'max scrap reduction',
    },
    {
      icon: <RecordIcon />,
      tag: 'RECORD',
      title: 'Operational Traceability',
      body: 'Every decision logged & reproducible. Upstream platforms gain cleaner material, timing, and performance feedback over time.',
      metric: siteMetrics.valueBridge.traceMetric,
      metricSuffix: 'execution accuracy',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-bg py-12">
      <PhotoBackground src="/images/operator-work.jpg" opacity={0.06} gradient="from-bg/90 via-bg/85 to-bg/90" position="center 40%" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent">
            Execution Infrastructure Value
          </p>

          <div
            className="w-full max-w-5xl rounded-xl bg-bg-2 border border-line/50 p-3 md:p-5"
            role="region"
            aria-label="Reality Anchors core value: Guide, Validate, Record"
          >
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              {cards.flatMap((card, i) => {
                const connector = i > 0 ? (
                  <div
                    key={`conn-${i}`}
                    className="hidden md:flex items-center justify-center w-10 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-[5px] h-[5px] rounded-full bg-accent opacity-85" />
                      <div className="w-[5px] h-[5px] rounded-full bg-accent opacity-55" />
                      <div className="w-[5px] h-[5px] rounded-full bg-accent opacity-30" />
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="#1e3048">
                        <path d="M0 0 L10 5 L0 10 z" />
                      </svg>
                    </div>
                  </div>
                ) : null;

                const cardEl = (
                  <div
                    key={card.tag}
                    className="flex-1 relative rounded-xl bg-card border border-line overflow-hidden px-5 pb-5 pt-6"
                  >
                    {/* Accent top strip */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent" />

                    {/* Header */}
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <div>
                        <p className="text-[9px] font-bold tracking-[2.2px] text-accent uppercase leading-none mb-1">
                          {card.tag}
                        </p>
                        <p className="text-sm font-semibold text-txt leading-snug">
                          {card.title}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <p className="mt-3 text-xs text-muted leading-relaxed">
                      {card.body}
                    </p>

                    {/* Metric */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-xl font-bold text-accent-2">
                        {card.metric}
                      </span>
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
