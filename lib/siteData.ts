import metrics from '@/data/metrics.json';
import regimes from '@/data/regimes.json';

export interface MetricItem {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  context?: string;
}

export interface HeroMetric {
  value: string;
  label: string;
}

export interface RegimeMetric {
  label: string;
  value: string;
}

export interface Regime {
  id: string;
  title: string;
  description: string;
  image: string;
  tier: 'Core' | 'Pro' | 'Specialty';
  learnMoreHref: string;
  metrics: RegimeMetric[];
  anchors: string[];
  dataSources: string[];
  pipeline: string[];
  roi: string;
  workcellIds?: string[];
}

export const siteMetrics = metrics as {
  hero: HeroMetric[];
  heroVariants: Record<string, HeroMetric[]>;
  designTargets: MetricItem[];
  valueBridge: {
    governMetric: string;
    optimizeMetric: string;
    traceMetric: string;
  };
};

export const regimeCatalog = regimes as Regime[];

export function getRegimeById(id: string) {
  return regimeCatalog.find((regime) => regime.id === id);
}

export function getRegimesByWorkcell(workcellId: string): Regime[] {
  return regimeCatalog.filter((r) => r.workcellIds?.includes(workcellId));
}
