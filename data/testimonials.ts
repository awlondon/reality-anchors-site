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
      'We cut our rework rate by 34% in the first quarter. The real-time validation catches dimensional errors before they reach the field — that alone paid for the platform.',
    attribution: 'Operations Manager',
    company: '200-person fabrication yard',
    backgroundSrc: '/images/operator-work.jpg',
    pages: ['home', 'commercial'],
  },
  {
    id: 'engineering-lead-steel',
    quote:
      'Our detailers spend less time chasing RFIs and more time on production drawings. The precision-guided checks integrate right into our existing workflow without adding overhead.',
    attribution: 'Engineering Lead',
    company: 'Structural steel shop, 45 employees',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['home', 'industrial'],
  },
  {
    id: 'quality-manager-precast',
    quote:
      'Across three plants, we finally have a consistent validation standard. Scrap dropped 22% and our QA team can focus on the outliers instead of spot-checking everything manually.',
    attribution: 'Quality Manager',
    company: 'Precast concrete operation, 3 plants',
    backgroundSrc: '/images/quality-control.jpg',
    pages: ['home', 'industrial'],
  },
  {
    id: 'it-director-multisite',
    quote:
      'The deployment was lighter than we expected — no on-prem infrastructure, no six-month integration timeline. We had three sites running within weeks and the ROI case practically wrote itself.',
    attribution: 'IT Director',
    company: 'Multi-site fabricator, 600+ employees',
    backgroundSrc: '/images/commercial-fabrication.jpg',
    pages: ['home', 'board-strategy'],
  },
  {
    id: 'procurement-lead-supply',
    quote:
      'Material waste used to be a line item we just accepted. Now we catch over-orders and cut-list errors upstream. Our procurement accuracy went from "close enough" to measurably precise.',
    attribution: 'Procurement Lead',
    company: 'Regional construction supply company',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['commercial', 'board-strategy'],
  },
  {
    id: 'shop-foreman-personal',
    quote:
      'I run a five-man crew and thought this kind of tech was only for the big shops. The personal plan gives me validation tools that keep my welds and cuts within spec without burying me in software.',
    attribution: 'Shop Foreman',
    company: 'Independent steel fabrication crew',
    backgroundSrc: '/images/workshop-personal.jpg',
    pages: ['personal'],
  },
];

export function getTestimonialsForPage(page: string): Testimonial[] {
  return testimonials.filter((t) => t.pages.includes(page));
}
