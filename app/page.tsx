import Hero from '@/components/Hero';
import VideoShowcase from '@/components/VideoShowcase';
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
    <main id="main-content" className="snap-y">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Reality Anchors Limited',
            url: 'https://ra.primarydesignco.com',
            description: 'AI-assisted operational validation for fabrication, field, and operations teams.',
          }),
        }}
      />
      <Hero />
      <VideoShowcase />
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
