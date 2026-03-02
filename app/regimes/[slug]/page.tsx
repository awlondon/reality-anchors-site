import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TestimonialBreak from '@/components/TestimonialBreak';
import { getRegimeById, regimeCatalog } from '@/lib/siteData';
import { getTestimonialsForPage } from '@/data/testimonials';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return regimeCatalog.map((regime) => ({ slug: regime.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const regime = getRegimeById(params.slug);
  if (!regime) {
    return { title: 'Program not found' };
  }

  return {
    title: `${regime.title} Program`,
    description: regime.description,
    alternates: { canonical: `/regimes/${params.slug}/` },
    openGraph: {
      title: `${regime.title} Program | Reality Anchors`,
      description: regime.description,
    },
  };
}

export default function RegimeDetailPage({ params }: Props) {
  const regime = getRegimeById(params.slug);

  if (!regime) notFound();

  const testimonial = getTestimonialsForPage(`regime:${params.slug}`)[0];

  return (
    <main className="pt-20">
      <section className="py-14 border-b border-line">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Programs / {regime.tier}</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">{regime.title}</h1>
          <p className="text-xl text-muted max-w-3xl leading-relaxed">{regime.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-line">
            <Image src={regime.image} alt={`${regime.title} visual`} fill className="object-cover" sizes="100vw" />
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <article className="border border-line bg-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-txt mb-3">Operational outcomes</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Fewer preventable errors during execution',
                'Improved consistency across operators and shifts',
                'Clear documentation for review and accountability',
                'Faster ramp-up for new team members',
              ].map((item) => (
                <li key={item} className="text-sm text-muted flex gap-3">
                  <span className="text-accent">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="border border-line bg-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-txt mb-3">Deployment profile</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Works in shop-floor and field environments',
                'Supports phased rollout by team or location',
                'Designed for measurable KPI tracking from day one',
                'Built for audit readiness and operational traceability',
              ].map((item) => (
                <li key={item} className="text-sm text-muted flex gap-3">
                  <span className="text-accent">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {testimonial && (
        <TestimonialBreak
          id={testimonial.id}
          quote={testimonial.quote}
          attribution={testimonial.attribution}
          company={testimonial.company}
          backgroundSrc={testimonial.backgroundSrc}
        />
      )}

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <article className="border border-line bg-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-txt mb-4">Metrics & ROI</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {regime.metrics.map((metric) => (
                <div key={metric.label} className="border border-line rounded-xl px-4 py-3 bg-bg/60">
                  <p className="text-xs uppercase tracking-wide text-muted">{metric.label}</p>
                  <p className="text-base font-semibold text-accent-2">{metric.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">{regime.roi}</p>
            <Link href="/#contact" className="inline-flex mt-5 px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Talk to our team about this program
            </Link>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
