import Hero from '@/components/Hero';
import ValueBridge from '@/components/ValueBridge';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import AdaptiveNarrative from '@/components/AdaptiveNarrative';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getRegimes } from '@/lib/getRegimes';

export default async function Home() {
  const regimes = await getRegimes();

  return (
    <main className="snap-y">
      <ErrorBoundary section="hero">
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary section="value-bridge">
        <ValueBridge />
      </ErrorBoundary>
      <ErrorBoundary section="features">
        <Features />
      </ErrorBoundary>
      <ErrorBoundary section="narrative">
        <AdaptiveNarrative initialRegimes={regimes} />
      </ErrorBoundary>
      <ErrorBoundary section="metrics">
        <Metrics />
      </ErrorBoundary>
      <ErrorBoundary section="tiers">
        <Tiers />
      </ErrorBoundary>
      <ErrorBoundary section="lead-form">
        <LeadForm />
      </ErrorBoundary>
      <Footer />
    </main>
  );
}
