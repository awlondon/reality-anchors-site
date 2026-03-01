'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import PhotoBackground from '@/components/PhotoBackground';

type TestimonialBreakProps = {
  quote: string;
  attribution: string;
  company: string;
  avatarSrc?: string;
  avatarAlt?: string;
  backgroundSrc?: string;
  backgroundOpacity?: number;
  id?: string;
};

export default function TestimonialBreak({
  quote,
  attribution,
  company,
  avatarSrc,
  avatarAlt,
  backgroundSrc,
  backgroundOpacity = 0.08,
  id,
}: TestimonialBreakProps) {
  return (
    <section id={id} className="relative overflow-hidden py-16 md:py-20">
      {backgroundSrc && (
        <PhotoBackground
          src={backgroundSrc}
          opacity={backgroundOpacity}
          gradient="from-bg/90 via-bg/70 to-bg/90"
        />
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        {/* Decorative opening quote */}
        <span
          aria-hidden="true"
          className="block font-serif text-6xl md:text-7xl leading-none text-accent/20 select-none"
        >
          &ldquo;
        </span>

        {/* Quote text */}
        <blockquote className="mt-2">
          <p className="text-xl md:text-2xl italic font-light text-txt/90 leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Avatar or silhouette fallback */}
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-line bg-bg/60">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={avatarAlt ?? attribution}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="h-full w-full text-muted/40"
                aria-hidden="true"
              >
                <circle cx="24" cy="18" r="8" fill="currentColor" />
                <ellipse cx="24" cy="40" rx="14" ry="10" fill="currentColor" />
              </svg>
            )}
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-txt">
              &mdash; {attribution}
            </p>
            <p className="text-xs text-muted">{company}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
