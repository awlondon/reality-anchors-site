import Hero from '@/components/Hero';
import ValueBridge from '@/components/ValueBridge';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import AdaptiveNarrative from '@/components/AdaptiveNarrative';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import { getRegimes } from '@/lib/getRegimes';

export default async function Home() {
  const regimes = await getRegimes();

  return (
    <main className="snap-y">
      <Hero />
      <ValueBridge />
      <Features />
      <AdaptiveNarrative initialRegimes={regimes} />
      <Metrics />
      <Tiers />
      <LeadForm />
      <Footer />
    </main>
  );
}
