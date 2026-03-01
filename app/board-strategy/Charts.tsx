'use client';

import WaterfallChart from '@/components/charts/WaterfallChart';
import BarChart from '@/components/charts/BarChart';

export function EbitdaWaterfall() {
  return (
    <WaterfallChart
      ariaLabel="EBITDA waterfall: $3.2M baseline stepping up by scrap, labor, and throughput savings to $3.775M"
      data={[
        { label: 'Baseline', value: 3_200_000, isTotal: false },
        { label: 'Scrap', value: 319_000 },
        { label: 'Labor', value: 96_000 },
        { label: 'Throughput', value: 160_000 },
        { label: 'Total', value: 0, isTotal: true },
      ]}
      className="mt-6"
    />
  );
}

export function ArrRamp() {
  return (
    <BarChart
      ariaLabel="5-year ARR ramp from $0.7M to $32.4M"
      data={[
        { label: 'Y1', value: 0.7, sublabel: '10 facilities', annotation: '$0.7M' },
        { label: 'Y2', value: 2.4, sublabel: '35 facilities', annotation: '$2.4M' },
        { label: 'Y3', value: 6.9, sublabel: '95 facilities', annotation: '$6.9M' },
        { label: 'Y4', value: 16.5, sublabel: '220 facilities', annotation: '$16.5M' },
        { label: 'Y5', value: 32.4, sublabel: '420 facilities', annotation: '$32.4M' },
      ]}
      yAxisLabel="ARR ($M)"
      className="mt-6"
    />
  );
}

export function ScrapSensitivity() {
  return (
    <BarChart
      ariaLabel="Scrap improvement sensitivity: 1.0pt=$212k, 1.5pts=$319k, 2.0pts=$425k"
      data={[
        { label: '1.0 pt', value: 212, annotation: '~$212k' },
        { label: '1.5 pts', value: 319, annotation: '~$319k' },
        { label: '2.0 pts', value: 425, annotation: '~$425k' },
      ]}
      yAxisLabel="EBITDA uplift ($k)"
      className="mt-6"
    />
  );
}
