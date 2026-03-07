export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  company: string;
  backgroundSrc: string;
  pages: string[];
};

export const testimonials: Testimonial[] = [
  // ── Homepage ──
  {
    id: 'ops-manager-yard',
    quote:
      'The biggest shift is catching bad cuts before they leave the bench — not after they hit the field. That changes the whole rework conversation.',
    attribution: 'Representative scenario',
    company: 'Fabrication yard operations',
    backgroundSrc: '/images/operator-work.jpg',
    pages: ['home', 'industries:rebar-cut-bend'],
  },
  {
    id: 'engineering-lead-steel',
    quote:
      'When checks happen at the bench, detailers can focus on production drawings instead of cleaning up mistakes after the fact.',
    attribution: 'Representative scenario',
    company: 'Structural steel shop',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['home'],
  },
  {
    id: 'safety-coordinator-home',
    quote:
      'The goal is for operators to catch tolerance issues before the torch even lights — a completely different way of working.',
    attribution: 'Representative scenario',
    company: 'Steel erection crew',
    backgroundSrc: '/images/team-collaboration.jpg',
    pages: ['home'],
  },
  {
    id: 'it-director-multisite',
    quote:
      'Cloud-native deployment means no on-prem infrastructure. Multiple sites can go live quickly, and the ROI conversation with leadership becomes straightforward.',
    attribution: 'Representative scenario',
    company: 'Multi-site fabricator',
    backgroundSrc: '/images/commercial-fabrication.jpg',
    pages: ['home'],
  },

  // ── Commercial ──
  {
    id: 'procurement-lead-supply',
    quote:
      'Most shops budget for waste and move on. The opportunity is catching cut-list errors and over-orders before they ship — the kind of thing you wonder how you lived without.',
    attribution: 'Representative scenario',
    company: 'Construction supply operations',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['commercial'],
  },

  // ── Industrial ──
  {
    id: 'quality-manager-precast',
    quote:
      'When every plant validates the same way, the QA team stops babysitting every pour. Standardized checks are the foundation for consistent scrap reduction.',
    attribution: 'Representative scenario',
    company: 'Multi-plant precast operation',
    backgroundSrc: '/images/quality-control.jpg',
    pages: ['industrial', 'industries'],
  },

  // ── Personal ──
  {
    id: 'shop-foreman-personal',
    quote:
      'This kind of tooling doesn\u2019t have to be just for the big shops with IT departments. A small crew can get set up quickly and tighten up cuts and welds without extra paperwork.',
    attribution: 'Representative scenario',
    company: 'Independent steel fabrication crew',
    backgroundSrc: '/images/workshop-personal.jpg',
    pages: ['personal'],
  },

  // ── Board Strategy ──
  {
    id: 'cfo-board-strategy',
    quote:
      'When the execution layer shows real scrap delta and labor savings, the infrastructure pitch doesn\u2019t need a second meeting. That\u2019s the kind of margin story boards want to hear.',
    attribution: 'Illustrative framing',
    company: 'PE-backed fabrication platform',
    backgroundSrc: '/images/boardroom-strategy.jpg',
    pages: ['board-strategy'],
  },

  // ── Regime: Structural Fabrication ──
  {
    id: 'lead-fabricator-structural',
    quote:
      'A system that matches how you actually think about a job — sequence, checks, confirmation — makes the difference between good work and guesswork.',
    attribution: 'Representative scenario',
    company: 'Structural steel contractor',
    backgroundSrc: '/images/sparks-metal.jpg',
    pages: ['regime:structural-fabrication', 'industries:rebar-cut-bend'],
  },

  // ── Regime: Multi-Project Optimization ──
  {
    id: 'planner-multi-project',
    quote:
      'When you\u2019re running overlapping jobs with shared material lists, consolidating orders across projects is where the real savings show up.',
    attribution: 'Representative scenario',
    company: 'General contractor operations',
    backgroundSrc: '/images/industrial-factory.jpg',
    pages: ['regime:multi-project-optimization'],
  },

  // ── Regime: Machine Calibration ──
  {
    id: 'maintenance-lead-calibration',
    quote:
      'Catching machine drift before parts don\u2019t fit — instead of after — can save a full shift of rework. Early flagging changes maintenance from reactive to proactive.',
    attribution: 'Representative scenario',
    company: 'Plate fabrication shop',
    backgroundSrc: '/images/cnc-precision.jpg',
    pages: ['regime:machine-calibration'],
  },

  // ── Regime: Fleet Grip ──
  {
    id: 'fleet-supervisor-heavy',
    quote:
      'When every machine is doing its own thing across two yards, you need drift visibility before it turns into scrap. Centralized monitoring changes the equation.',
    attribution: 'Representative scenario',
    company: 'Heavy civil contractor',
    backgroundSrc: '/images/cnc-precision.jpg',
    pages: ['regime:fleet-grip'],
  },

  // ── Regime: AR Execution ──
  {
    id: 'project-engineer-ar',
    quote:
      'AR overlay changes how crews read drawings on site. Instead of squinting at a tablet and guessing, they see alignment checks right on the piece.',
    attribution: 'Representative scenario',
    company: 'Structural erection contractor',
    backgroundSrc: '/images/structural-steel.jpg',
    pages: ['regime:ar-execution'],
  },

  // ── Regime: AI Governance ──
  {
    id: 'compliance-officer-ai',
    quote:
      'A full audit trail — every override, every operator confirmation, every exception — is what auditors want to see when AI-generated plans are in play.',
    attribution: 'Representative scenario',
    company: 'Regulated steel fabricator',
    backgroundSrc: '/images/methodology-measurement.jpg',
    pages: ['regime:ai-governance'],
  },
];

export function getTestimonialsForPage(page: string): Testimonial[] {
  return testimonials.filter((t) => t.pages.includes(page));
}
