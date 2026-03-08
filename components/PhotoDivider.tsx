'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/* ── Clip-path shapes per frame variant + image side ─────────── */
const FRAME_CLIPS = {
  angle: {
    left: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 0 100%)',
    right: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 8%)',
  },
  notch: {
    left: 'polygon(0 0, 85% 0, 85% 12%, 100% 12%, 100% 100%, 0 100%)',
    right: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 12%, 15% 12%)',
  },
  measure: {
    left: 'polygon(0 0, 88% 0, 88% 6%, 92% 6%, 92% 0, 100% 0, 100% 100%, 0 100%)',
    right: 'polygon(0 0, 8% 0, 8% 6%, 12% 6%, 12% 0, 100% 0, 100% 100%, 0 100%)',
  },
} as const;

/* ── Measurement tick marks (brand motif) ────────────────────── */
function MeasureTicks({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`absolute top-8 ${side === 'right' ? '-right-1' : '-left-1'} w-4 h-20`}
      viewBox="0 0 16 80"
      fill="none"
      aria-hidden="true"
    >
      {[0, 20, 40, 60].map((y) => (
        <line
          key={y}
          x1={side === 'right' ? 0 : 8}
          y1={y + 4}
          x2={side === 'right' ? 8 : 16}
          y2={y + 4}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/40"
        />
      ))}
    </svg>
  );
}

/* ── Corner bracket (speed-square motif) ─────────────────────── */
function CornerBracket({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const pos = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }[position];

  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');

  return (
    <div className={`absolute ${pos} w-5 h-5`} aria-hidden="true">
      <div className={`absolute ${isBottom ? 'bottom-0' : 'top-0'} ${isRight ? 'right-0' : 'left-0'} w-full h-px bg-accent/50`} />
      <div className={`absolute ${isBottom ? 'bottom-0' : 'top-0'} ${isRight ? 'right-0' : 'left-0'} h-full w-px bg-accent/50`} />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
type PhotoDividerProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  body: string;
  imagePosition?: 'left' | 'right';
  frameVariant?: 'angle' | 'notch' | 'measure';
  id?: string;
  imageObjectPosition?: string;
};

export default function PhotoDivider({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  body,
  imagePosition = 'left',
  frameVariant = 'angle',
  id,
  imageObjectPosition = 'center',
}: PhotoDividerProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Differential parallax — image lags, text overtakes
  const rawImageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rawTextY = useTransform(scrollYProgress, [0, 1], [60, -20]);
  const rawOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.85], [0, 1, 0.85]);

  const imageY = reduceMotion ? 0 : rawImageY;
  const textY = reduceMotion ? 0 : rawTextY;
  const opacity = reduceMotion ? 1 : rawOpacity;

  const isLeft = imagePosition === 'left';
  const clipPath = FRAME_CLIPS[frameVariant][isLeft ? 'left' : 'right'];
  const bracketPos = isLeft ? 'bottom-left' : 'bottom-right';
  const tickSide = isLeft ? 'right' : 'left';

  return (
    <section ref={ref} id={id} className="relative overflow-hidden py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 items-center gap-y-8">
          {/* ── Image panel (7 cols) ── */}
          <motion.div
            style={{ y: imageY, opacity }}
            className={`md:col-span-7 ${isLeft ? '' : 'md:col-start-6'} md:row-start-1 relative z-0`}
          >
            <div className="relative">
              {/* Accent border stroke (slightly larger clipped div) */}
              <div
                className="absolute -inset-[2px] bg-accent/20 rounded-sm"
                style={{ clipPath }}
                aria-hidden="true"
              />

              {/* Clipped image */}
              <div
                className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden"
                style={{ clipPath }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover will-change-transform"
                  style={{ objectPosition: imageObjectPosition }}
                />
                {/* Depth gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Brand decoration */}
              <MeasureTicks side={tickSide} />
              <CornerBracket position={bracketPos} />
            </div>
          </motion.div>

          {/* ── Text panel (6 cols, overlaps image by 1) ── */}
          <motion.div
            style={{ y: textY, opacity }}
            className={`md:col-span-6 ${isLeft ? 'md:col-start-7' : 'md:col-start-1'} md:row-start-1 relative z-10`}
          >
            <div className="bg-bg/80 backdrop-blur-sm border border-line/50 rounded-2xl p-8 md:p-10">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
                {eyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-txt leading-tight mb-4">
                {heading}
              </h2>
              <p className="text-sm md:text-base text-muted leading-relaxed">
                {body}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
