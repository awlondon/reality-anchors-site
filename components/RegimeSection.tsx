'use client';

import Image from 'next/image';
import Link from 'next/link';

type Stat = {
  label: string;
  value: string;
};

export type RegimeSectionProps = {
  id?: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  stats: Stat[];
  ctaHref: string;
  visualTier?: 'visualCore' | 'visualPro' | 'visualSpecialty';
  align?: 'left' | 'right';
};

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
}: RegimeSectionProps) {
  return (
    <section id={id} className="relative w-full px-6 py-24 md:px-12 lg:px-20">
      <div
        className={cn(
          'grid items-center gap-16',
          align === 'left' ? 'lg:grid-cols-[1.2fr_1fr]' : 'lg:grid-cols-[1fr_1.2fr]'
        )}
      >
        <div
          className={cn(
            'relative h-[420px] overflow-hidden rounded-xl border md:h-[520px]',
            tierBorder(visualTier),
            align === 'right' && 'lg:order-2'
          )}
        >
          <Image src={imageSrc} alt={imageAlt} fill priority={false} className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className={cn('relative z-10', align === 'right' && 'lg:order-1')}>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>

          <p className="mt-4 max-w-xl text-lg text-gray-300">{subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                <div className="text-sm uppercase tracking-wide text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href={ctaHref}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium transition',
                tierAccent(visualTier)
              )}
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>
    </section>
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
