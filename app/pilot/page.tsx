import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import PhotoBackground from '@/components/PhotoBackground';
import { regimeCatalog } from '@/lib/siteData';
import PhotoDivider from '@/components/PhotoDivider';
import { getDividersForPage } from '@/data/photoDividers';

export const metadata: Metadata = {
  title: 'Pilot — Structured Evaluation for Fabrication Teams',
  description: 'AR-guided execution overlay and daily usage dashboards at $1,200/bench/mo. Start with one bench, prove the ROI in 60 days, then scale to Production.',
  alternates: { canonical: '/pilot/' },
  openGraph: {
    title: 'Pilot | Reality Anchors',
    description: 'Structured evaluation tier — AR execution overlay, daily dashboards, email support. $1,200/bench/mo.',
  },
};

const pilotRegimes = regimeCatalog.filter((regime) => ['Core', 'Pro'].includes(regime.tier)).slice(0, 3);

const dividers = getDividersForPage('pilot');

export default function PilotPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Reality Anchors Pilot',
            description: 'AR-guided execution overlay and daily usage dashboards. Start with one bench, prove the ROI in 60 days, then scale.',
            url: 'https://realityanchorsltd.com/pilot/',
            brand: { '@type': 'Organization', name: 'Reality Anchors' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '1200',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '1200',
                priceCurrency: 'USD',
                unitText: 'bench/month',
              },
            },
          }),
        }}
      />

      {/* Page header */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/workshop-personal.jpg" opacity={0.15} position="center 60%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Pilot</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Pilot</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            AR-guided execution overlay and daily usage dashboards. Start with one bench, prove the ROI in 60 days, then scale to Production across your shop floor.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['$1,200/bench/mo', '60-day validation', 'Scale to Production'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + What's included */}
      <section className="relative overflow-hidden py-16">
        <PhotoBackground src="/images/operator-work.jpg" opacity={0.06} gradient="from-bg/95 via-bg/85 to-bg/95" position="center 50%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Who it&apos;s for</h2>
            <ul className="flex flex-col gap-2.5">
              {['Evaluation teams exploring AR-guided execution', 'Single-bench pilots validating fit before rollout', 'Shops proving ROI before scaling to Production'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">What&apos;s included</h2>
            <ul className="flex flex-col gap-2.5">
              {['AR-guided execution overlay', 'Daily usage dashboards', 'Email support (48h SLA)'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 60-day validation window */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-accent/30 bg-gradient-to-b from-accent/5 to-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">60-day validation window</h2>
            <p className="text-muted text-sm mb-5">
              Validate fit and measure impact before a broader rollout. Walk away after 60 days if the numbers don&apos;t work — no lock-in.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {[
                { phase: 'Week 1–2', title: 'Onboarding', desc: 'Baseline metrics captured, workflows configured, operators trained.' },
                { phase: 'Week 3–8', title: 'Validation', desc: '60-day window measuring scrap, rework, and throughput against baselines.' },
                { phase: 'Week 9+', title: 'Decision', desc: 'Review results against baselines. Scale to Production, adjust, or walk away — no lock-in.' },
              ].map((step) => (
                <div key={step.phase} className="border border-line rounded-xl bg-bg/50 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wide uppercase text-accent mb-1">{step.phase}</p>
                  <p className="text-sm font-semibold text-txt mb-1">{step.title}</p>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
                Start a pilot
              </Link>
              <Link href="/production/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                Compare Production tier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {dividers[0] && <PhotoDivider {...dividers[0]} />}

      {/* Regime cards */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-lg font-semibold text-txt mb-4">Curated program examples</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {pilotRegimes.map((regime) => (
              <article key={regime.id} className="min-w-[290px] border border-line bg-card rounded-2xl p-5">
                <p className="text-[11px] uppercase tracking-wide text-accent mb-2">{regime.tier}</p>
                <h3 className="text-base font-semibold text-txt">{regime.title}</h3>
                <p className="text-sm text-muted mt-2">{regime.description}</p>
                <p className="text-sm text-accent-2 font-semibold mt-3">{regime.metrics[0]?.label}: {regime.metrics[0]?.value}</p>
                <Link href={regime.learnMoreHref} className="inline-block mt-3 text-sm font-semibold text-accent hover:text-blue-400">
                  Quick view →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative overflow-hidden py-8 pb-16">
        <PhotoBackground src="/images/steel-closeup.jpg" opacity={0.05} gradient="from-bg/95 via-bg/90 to-bg/95" position="center" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7 text-center">
            <h2 className="text-lg font-semibold text-txt mb-3">Ready to prove the ROI?</h2>
            <p className="text-muted text-sm mb-5 max-w-xl mx-auto">
              Start with one bench on Pilot. Prove the ROI in 60 days. Scale to Production across your shop floor.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
                Start a pilot
              </Link>
              <Link href="/calculator/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                Get ROI Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LeadForm
        id="contact"
        heading="Get started with Pilot"
        description="Tell us about your operation and we'll help you get set up. No commitment required."
      />
      <Footer />
    </main>
  );
}
