export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  company: string;
  backgroundSrc: string;
  pages: string[];
};

export const testimonials: Testimonial[] = [
  {
    id: 'ops-manager-yard',
    quote:
      'Honestly, the biggest thing was catching bad cuts before they left the shop. We were eating 34% less rework by the end of Q1 — and that number kept dropping.',
    attribution: 'Operations Manager',
    company: '200-person fabrication yard',
    backgroundSrc: '/images/operator-work.jpg',
    pages: ['home', 'commercial'],
  },
  {
    id: 'engineering-lead-steel',
    quote:
      'My detailers were spending half their day chasing down RFIs. Now the checks happen at the bench, so they can actually focus on production drawings instead of cleaning up mistakes after the fact.',
    attribution: 'Engineering Lead',
    company: 'Structural steel shop, 45 employees',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['home', 'industrial'],
  },
  {
    id: 'quality-manager-precast',
    quote:
      'Three plants, three different ways of checking work — that was our reality before this. Now everyone validates the same way, and my QA guys aren\u2019t babysitting every pour. Scrap\u2019s down about 22%.',
    attribution: 'Quality Manager',
    company: 'Precast concrete operation, 3 plants',
    backgroundSrc: '/images/quality-control.jpg',
    pages: ['home', 'industrial'],
  },
  {
    id: 'it-director-multisite',
    quote:
      'I braced for a six-month integration headache. Turned out we had three sites live in under a month with zero on-prem infrastructure. When I showed the numbers to the CFO, the ROI conversation was already over.',
    attribution: 'IT Director',
    company: 'Multi-site fabricator, 600+ employees',
    backgroundSrc: '/images/commercial-fabrication.jpg',
    pages: ['home', 'board-strategy'],
  },
  {
    id: 'procurement-lead-supply',
    quote:
      'We used to just budget for waste and move on. Now we\u2019re catching cut-list errors and over-orders before they ship. It\u2019s one of those things where you wonder how you lived without it.',
    attribution: 'Procurement Lead',
    company: 'Regional construction supply company',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['commercial', 'board-strategy'],
  },
  {
    id: 'shop-foreman-personal',
    quote:
      'I\u2019ve got five guys. I figured this stuff was built for the big shops with IT departments. But we got set up in a day and now my cuts and welds are tighter than they\u2019ve ever been. No extra paperwork.',
    attribution: 'Shop Foreman',
    company: 'Independent steel fabrication crew',
    backgroundSrc: '/images/workshop-personal.jpg',
    pages: ['personal'],
  },
];

export function getTestimonialsForPage(page: string): Testimonial[] {
  return testimonials.filter((t) => t.pages.includes(page));
}
