import Hero from '@/components/Hero';
import ValueBridge from '@/components/ValueBridge';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import AdaptiveNarrative from '@/components/AdaptiveNarrative';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import { getRegimes } from '@/lib/getRegimes';
import { HOME_EXPERIMENT } from '@/lib/experiments/config';
import { getServerVariant } from '@/lib/experiments/serverVariant';

function orderByList<T extends { slug: string }>(items: T[], slugs: string[]) {
  const map = new Map(items.map((item) => [item.slug, item]));
  const ordered = slugs.map((slug) => map.get(slug)).filter(Boolean) as T[];
  const remaining = items.filter((item) => !slugs.includes(item.slug));
  return [...ordered, ...remaining];
}

export default async function Home() {
  const regimes = await getRegimes();
  const variant = getServerVariant();

  const order = HOME_EXPERIMENT.narrative.regimeOrder?.[variant];
  const regimesOrdered = order ? orderByList(regimes, order) : regimes;

  return (
    <main className="snap-y">
      <Hero />
      <ValueBridge />
      <Features />
      <AdaptiveNarrative initialRegimes={regimesOrdered} />
      <Metrics />
      <Tiers />
      <LeadForm />
      <Footer />
    </main>
  );
}
