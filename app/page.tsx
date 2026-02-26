import Hero from '@/components/Hero';
import ValueBridge from '@/components/ValueBridge';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <ValueBridge />
      <Features />
      <Metrics />
      <Tiers />
      <LeadForm />
      <Footer />
    </main>
  );
}
