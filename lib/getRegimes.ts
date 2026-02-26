import regimesData from '@/data/regimes.json';
import type { RegimeContent } from '@/types/regime';

type LegacyRegime = {
  id: string;
  title: string;
  description: string;
  image: string;
  tier: 'Core' | 'Pro' | 'Specialty';
  learnMoreHref: string;
  metrics: Array<{ label: string; value: string }>;
};

const tierMap: Record<LegacyRegime['tier'], RegimeContent['visualTier']> = {
  Core: 'visualCore',
  Pro: 'visualPro',
  Specialty: 'visualSpecialty',
};

function formatImageAlt(title: string) {
  return `${title} regime visual`;
}

export async function getRegimes(): Promise<RegimeContent[]> {
  return (regimesData as LegacyRegime[])
    .map((regime, index) => ({
      id: regime.id,
      slug: regime.id,
      title: regime.title,
      subtitle: regime.description,
      imageUrl: regime.image,
      imageAlt: formatImageAlt(regime.title),
      visualTier: tierMap[regime.tier],
      stats: regime.metrics,
      ctaHref: regime.learnMoreHref,
      order: index + 1,
      published: true,
    }))
    .filter((regime) => regime.published)
    .sort((a, b) => a.order - b.order);
}

export async function getRegimesByTier(tier: RegimeContent['visualTier']) {
  const regimes = await getRegimes();
  return regimes.filter((regime) => regime.visualTier === tier);
}
