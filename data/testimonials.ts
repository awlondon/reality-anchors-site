export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  company: string;
  backgroundSrc: string;
  pages: string[];
};

export const testimonials: Testimonial[] = [
  // ── Homepage (3 used: indices 0, 1, 3 of home-filtered list) ──
  {
    id: 'ops-manager-yard',
    quote:
      'Honestly, the biggest thing was catching bad cuts before they left the shop. We were eating 34% less rework by the end of Q1 \u2014 and that number kept dropping.',
    attribution: 'Operations Manager',
    company: '200-person fabrication yard',
    backgroundSrc: '/images/operator-work.jpg',
    pages: ['home'],
  },
  {
    id: 'engineering-lead-steel',
    quote:
      'My detailers were spending half their day chasing down RFIs. Now the checks happen at the bench, so they can actually focus on production drawings instead of cleaning up mistakes after the fact.',
    attribution: 'Engineering Lead',
    company: 'Structural steel shop, 45 employees',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['home'],
  },
  {
    id: 'safety-coordinator-home',
    quote:
      'We used to find out about a tolerance issue when the piece didn\u2019t fit on site. Now the operator knows before the torch even lights. It\u2019s a completely different way of working.',
    attribution: 'Safety Coordinator',
    company: 'Mid-Atlantic steel erector, 120 field crew',
    backgroundSrc: '/images/team-collaboration.jpg',
    pages: ['home'],
  },
  {
    id: 'it-director-multisite',
    quote:
      'I braced for a six-month integration headache. Turned out we had three sites live in under a month with zero on-prem infrastructure. When I showed the numbers to the CFO, the ROI conversation was already over.',
    attribution: 'IT Director',
    company: 'Multi-site fabricator, 600+ employees',
    backgroundSrc: '/images/commercial-fabrication.jpg',
    pages: ['home'],
  },

  // ── Commercial ──
  {
    id: 'procurement-lead-supply',
    quote:
      'We used to just budget for waste and move on. Now we\u2019re catching cut-list errors and over-orders before they ship. It\u2019s one of those things where you wonder how you lived without it.',
    attribution: 'Procurement Lead',
    company: 'Regional construction supply company',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['commercial'],
  },

  // ── Industrial ──
  {
    id: 'quality-manager-precast',
    quote:
      'Three plants, three different ways of checking work \u2014 that was our reality before this. Now everyone validates the same way, and the QA team isn\u2019t babysitting every pour. Scrap\u2019s down about 22%.',
    attribution: 'Quality Manager',
    company: 'Precast concrete operation, 3 plants',
    backgroundSrc: '/images/quality-control.jpg',
    pages: ['industrial'],
  },

  // ── Personal ──
  {
    id: 'shop-foreman-personal',
    quote:
      'I\u2019ve got five guys. I figured this stuff was built for the big shops with IT departments. But we got set up in a day and now my cuts and welds are tighter than they\u2019ve ever been. No extra paperwork.',
    attribution: 'Shop Foreman',
    company: 'Independent steel fabrication crew',
    backgroundSrc: '/images/workshop-personal.jpg',
    pages: ['personal'],
  },

  // ── Board Strategy ──
  {
    id: 'cfo-board-strategy',
    quote:
      'The board kept asking where the margin improvement was going to come from. When we showed them the execution layer numbers \u2014 real scrap delta, real labor savings \u2014 it was the first infrastructure pitch that didn\u2019t need a second meeting.',
    attribution: 'CFO',
    company: 'PE-backed fabrication platform, 4 facilities',
    backgroundSrc: '/images/boardroom-strategy.jpg',
    pages: ['board-strategy'],
  },

  // ── Regime: Structural Fabrication ──
  {
    id: 'lead-fabricator-structural',
    quote:
      'I\u2019ve been bending steel for nineteen years. This is the first system that actually matches how I think about a job \u2014 sequence, checks, confirmation. My error rate went from \u201Cpretty good\u201D to basically zero.',
    attribution: 'Lead Fabricator',
    company: 'Structural steel contractor, 60 employees',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['regime:structural-fabrication'],
  },

  // ── Regime: Multi-Project Optimization ──
  {
    id: 'planner-multi-project',
    quote:
      'We were running four jobs with overlapping material lists and nobody could see the shared inventory. First week on the platform, we consolidated two orders and saved a truckload \u2014 literally.',
    attribution: 'Senior Planner',
    company: 'General contractor, 15 concurrent projects',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['regime:multi-project-optimization'],
  },

  // ── Regime: Machine Calibration ──
  {
    id: 'maintenance-lead-calibration',
    quote:
      'We had a press that was drifting a quarter-degree every 200 cycles. Used to catch it when the parts didn\u2019t fit. Now I get a flag before it\u2019s even a problem \u2014 saves us a full shift of rework every month.',
    attribution: 'Maintenance Lead',
    company: 'Plate fabrication shop, 8 CNC machines',
    backgroundSrc: '/images/cnc-precision.jpg',
    pages: ['regime:machine-calibration'],
  },

  // ── Regime: Fleet Grip ──
  {
    id: 'fleet-supervisor-heavy',
    quote:
      'We had twelve machines across two yards and every one was doing its own thing. Now I can see drift before it turns into scrap. Last month we caught a saw that was pulling 2mm left on every cut \u2014 would\u2019ve wasted a whole run.',
    attribution: 'Fleet Supervisor',
    company: 'Heavy civil contractor, 12 CNC stations',
    backgroundSrc: '/images/cnc-precision.jpg',
    pages: ['regime:fleet-grip'],
  },

  // ── Regime: AR Execution ──
  {
    id: 'project-engineer-ar',
    quote:
      'The AR overlay changed how the crew reads drawings on site. Instead of squinting at a tablet and guessing, they\u2019re seeing the alignment check right on the piece. Fit-up errors dropped off a cliff.',
    attribution: 'Project Engineer',
    company: 'Structural erection contractor, 80 employees',
    backgroundSrc: '/images/structural-steel.jpg',
    pages: ['regime:ar-execution'],
  },

  // ── Regime: AI Governance ──
  {
    id: 'compliance-officer-ai',
    quote:
      'When the auditors asked how we validate AI-generated cut plans, we had a full trail \u2014 every override, every operator confirmation, every exception. That used to take us weeks to reconstruct.',
    attribution: 'Compliance Officer',
    company: 'Publicly traded steel fabricator',
    backgroundSrc: '/images/methodology-measurement.jpg',
    pages: ['regime:ai-governance'],
  },
];

export function getTestimonialsForPage(page: string): Testimonial[] {
  return testimonials.filter((t) => t.pages.includes(page));
}
