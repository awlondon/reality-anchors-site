'use client';

import PairedBarChart from '@/components/charts/PairedBarChart';

export function ScrapBeforeAfter() {
  return (
    <PairedBarChart
      ariaLabel="Before/after scrap rates by segment: small commercial 8% to 6%, prefab 5.5% to 4%, industrial 3.5% to 2.5%"
      data={[
        { label: 'Small commercial', before: 8.0, after: 6.0, delta: '−2.0 pts' },
        { label: 'Prefab yard', before: 5.5, after: 4.0, delta: '−1.5 pts' },
        { label: 'Industrial', before: 3.5, after: 2.5, delta: '−1.0 pt' },
      ]}
      maxValue={10}
      className="mt-6"
    />
  );
}
