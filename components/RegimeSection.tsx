'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import AnimatedKPI from '@/components/AnimatedKPI';
import MultiLayerParallax from '@/components/MultiLayerParallax';
import {
  containerVariants,
  fadeUp,
  minimal,
  scaleIn,
  slideInLeft,
  slideInRight,
} from '@/lib/animationPresets';
import { parseKPI } from '@/lib/parseKPI';
import type { AnimationPreset, RegimeStat } from '@/types/regime';

type RegimeSectionProps = {
  id?: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  stats: RegimeStat[];
  ctaHref: string;
  visualTier?: 'visualCore' | 'visualPro' | 'visualSpecialty';
  align?: 'left' | 'right';
  animationPreset?: AnimationPreset;
};

function tierDefault(tier: NonNullable<RegimeSectionProps['visualTier']>): AnimationPreset {
  switch (tier) {
    case 'visualCore':
      return 'fadeUp';
    case 'visualPro':
      return 'slideIn';
    case 'visualSpecialty':
      return 'scaleIn';
    default:
      return 'fadeUp';
  }
}

function resolvePreset(preset: AnimationPreset | undefined, align: 'left' | 'right') {
  switch (preset) {
    case 'fadeUp':
      return fadeUp;
    case 'slideIn':
      return align === 'left' ? slideInLeft : slideInRight;
    case 'scaleIn':
      return scaleIn;
    case 'minimal':
      return minimal;
    default:
      return fadeUp;
  }
}

function getTierDepths(tier: NonNullable<RegimeSectionProps['visualTier']>) {
  switch (tier) {
    case 'visualCore':
      return [20, 40, 60] as const;
    case 'visualPro':
      return [25, 50, 75] as const;
    case 'visualSpecialty':
      return [30, 60, 90] as const;
    default:
      return [20, 40, 60] as const;
  }
}

export default function RegimeSection({
  id,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  stats,
  ctaHref,
  visualTier = 'visualCore',
  align = 'left',
  animationPreset,
}: RegimeSectionProps) {
  const sectionAnimation = resolvePreset(animationPreset ?? tierDefault(visualTier), align);
  const [bgDepth, midDepth, fgDepth] = getTierDepths(visualTier);
  const kpiDuration = visualTier === 'visualSpecialty' ? 1.1 : visualTier === 'visualPro' ? 0.9 : 0.8;

  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start center', 'end center'],
  });

  const subtitleOpacity = reduceMotion ? 1 : useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const statsOpacity = reduceMotion ? 1 : useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="relative w-full px-6 py-24 md:px-12 lg:px-20"
    >
      <div
        className={cn(
          'grid items-center gap-16',
          align === 'left' ? 'lg:grid-cols-[1.2fr_1fr]' : 'lg:grid-cols-[1fr_1.2fr]'
        )}
      >
        <motion.div
          variants={sectionAnimation}
          className={cn(
            'relative h-[420px] overflow-hidden rounded-xl border md:h-[520px]',
            tierBorder(visualTier),
            align === 'right' && 'lg:order-2'
          )}
        >
          <MultiLayerParallax
            layers={[
              {
                src: imageSrc,
                alt: `${imageAlt} background layer`,
                depth: bgDepth,
                opacity: 0.9,
                scale: 1.05,
              },
              {
                src: imageSrc,
                alt: `${imageAlt} middle layer`,
                depth: midDepth,
                opacity: 1,
                scale: 1.1,
              },
              {
                src: imageSrc,
                alt: `${imageAlt} foreground layer`,
                depth: fgDepth,
                opacity: 1,
                scale: 1.15,
              },
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </motion.div>

        <motion.div
          ref={contentRef}
          variants={sectionAnimation}
          className={cn('relative z-10', align === 'right' && 'lg:order-1')}
        >
          <motion.h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </motion.h2>

          <motion.p style={{ opacity: subtitleOpacity }} className="mt-4 max-w-xl text-lg text-gray-300">
            {subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ opacity: statsOpacity }}
            className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((stat, index) => {
                const parsed = parseKPI(stat.value);

                return (
                  <motion.div key={stat.label} variants={fadeUp} className="space-y-2">
                    <div className="text-3xl font-bold text-white md:text-4xl">
                      {parsed.number !== null ? (
                        <AnimatedKPI
                          value={parsed.number}
                          prefix={parsed.prefix}
                          suffix={parsed.suffix}
                          decimals={parsed.decimals}
                          duration={kpiDuration}
                          regimeId={id}
                          kpiIndex={index}
                        />
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm uppercase tracking-wide text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <Link
              href={ctaHref}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('analytics', {
                    detail: {
                      type: 'cta_click',
                      stage: 'cta_click',
                      regimeId: id,
                    },
                  })
                );
              }}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium transition',
                tierAccent(visualTier)
              )}
            >
              Learn more →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function tierBorder(tier: RegimeSectionProps['visualTier']) {
  switch (tier) {
    case 'visualCore':
      return 'border-blue-500/40';
    case 'visualPro':
      return 'border-emerald-500/40';
    case 'visualSpecialty':
      return 'border-purple-500/40';
    default:
      return 'border-gray-700';
  }
}

function tierAccent(tier: RegimeSectionProps['visualTier']) {
  switch (tier) {
    case 'visualCore':
      return 'text-blue-400 hover:text-blue-300';
    case 'visualPro':
      return 'text-emerald-400 hover:text-emerald-300';
    case 'visualSpecialty':
      return 'text-purple-400 hover:text-purple-300';
    default:
      return 'text-white hover:text-gray-300';
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
