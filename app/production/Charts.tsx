'use client';

import RangeBar from '@/components/charts/RangeBar';

export function ScrapRanges() {
  return (
    <RangeBar
      ariaLabel="Industry scrap ranges with model baselines: small commercial 6-10% baseline 8%, prefab 4-7% baseline 5.5%, industrial 2-5% baseline 3.5%"
      data={[
        { label: 'Small commercial', low: 6, high: 10, baseline: 8.0 },
        { label: 'Prefab yard', low: 4, high: 7, baseline: 5.5 },
        { label: 'Industrial', low: 2, high: 5, baseline: 3.5 },
      ]}
      maxValue={12}
      className="mt-4"
    />
  );
}
