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
    pages: ['home', 'commercial', 'regime:structural-fabrication'],
  },
  {
    id: 'engineering-lead-steel',
    quote:
      'My detailers were spending half their day chasing down RFIs. Now the checks happen at the bench, so they can actually focus on production drawings instead of cleaning up mistakes after the fact.',
    attribution: 'Engineering Lead',
    company: 'Structural steel shop, 45 employees',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['home', 'industrial', 'regime:machine-calibration'],
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
    pages: ['commercial', 'board-strategy', 'regime:multi-project-optimization'],
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
  {
    id: 'fleet-supervisor-heavy',
    quote:
      'We had twelve machines across two yards and every one was doing its own thing. Now I can see drift before it turns into scrap. Last month we caught a saw that was pulling 2mm left on every cut — would\u2019ve wasted a whole run.',
    attribution: 'Fleet Supervisor',
    company: 'Heavy civil contractor, 12 CNC stations',
    backgroundSrc: '/images/cnc-precision.jpg',
    pages: ['regime:fleet-grip'],
  },
  {
    id: 'project-engineer-ar',
    quote:
      'The AR overlay changed how my guys read drawings on site. Instead of squinting at a tablet and guessing, they\u2019re seeing the alignment check right on the piece. Fit-up errors dropped off a cliff.',
    attribution: 'Project Engineer',
    company: 'Structural erection contractor, 80 employees',
    backgroundSrc: '/images/structural-steel.jpg',
    pages: ['regime:ar-execution'],
  },
  {
    id: 'compliance-officer-ai',
    quote:
      'When the auditors asked how we validate AI-generated cut plans, we had a full trail — every override, every operator confirmation, every exception. That used to take us weeks to reconstruct.',
    attribution: 'Compliance Officer',
    company: 'Publicly traded steel fabricator',
    backgroundSrc: '/images/methodology-measurement.jpg',
    pages: ['regime:ai-governance'],
  },
];

export function getTestimonialsForPage(page: string): Testimonial[] {
  return testimonials.filter((t) => t.pages.includes(page));
}
