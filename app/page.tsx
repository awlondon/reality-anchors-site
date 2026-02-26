import Hero from '@/components/Hero';
import ValueBridge from '@/components/ValueBridge';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import RegimeSection from '@/components/RegimeSection';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import { getRegimes } from '@/lib/getRegimes';

export default async function Home() {
  const regimes = await getRegimes();

  return (
    <main>
      <Hero />
      <ValueBridge />
      <Features />
      <section className="bg-bg">
        {regimes.map((regime, index) => (
          <RegimeSection
            key={regime.id}
            id={regime.slug}
            title={regime.title}
            subtitle={regime.subtitle}
            imageSrc={regime.imageUrl}
            imageAlt={regime.imageAlt}
            visualTier={regime.visualTier}
            align={regime.align ?? (index % 2 === 0 ? 'left' : 'right')}
            stats={regime.stats}
            ctaHref={regime.ctaHref}
          />
        ))}
      </section>
      <Metrics />
      <Tiers />
      <LeadForm />
      <Footer />
    </main>
  );
}
