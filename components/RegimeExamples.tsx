import Image from 'next/image';
import Link from 'next/link';
import { regimeCatalog } from '@/lib/siteData';

export default function RegimeExamples() {
  return (
    <section className="py-24 bg-bg border-y border-line/70">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Regime Examples</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-3xl leading-tight">
            Real regimes, real anchors, and telemetry-backed outcomes
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Each regime maps a bounded reality domain to anchor objects, live data capture, and a reinforcement loop.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regimeCatalog.map((regime) => (
            <article key={regime.id} className="border border-line bg-card rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10]">
                <Image
                  src={regime.image}
                  alt={`${regime.title} visual`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full border border-white/30 bg-black/35 text-white">
                  {regime.tier}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-txt">{regime.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{regime.description}</p>

                <div className="mt-4 space-y-2">
                  {regime.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-line/70 bg-bg/60 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted">{metric.label}</p>
                      <p className="text-sm font-semibold text-accent-2">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <Link href={regime.learnMoreHref} className="mt-5 text-sm font-semibold text-accent hover:text-blue-400">
                  Learn more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 border border-line rounded-2xl bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-txt">Book a live regime demo</h3>
            <p className="text-sm text-muted mt-1">We&apos;ll walk your team through the exact telemetry, anchors, and ROI model for your highest-value regime.</p>
          </div>
          <Link href="/#contact" className="inline-flex px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
            Book a live regime demo
          </Link>
        </div>
      </div>
    </section>
  );
}
