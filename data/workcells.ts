export type WorkcellStatus = 'live' | 'coming-soon' | 'adjacent';

export interface Workcell {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  status: WorkcellStatus;
  heroImage: string;
  seoKeywords: string[];
  regimeIds: string[];
  metrics: Array<{ value: string; label: string }>;
  integrations: string[];
  workflowSteps: string[];
}

export const workcells: Workcell[] = [
  {
    id: 'rebar-cut-bend',
    slug: 'rebar-cut-bend',
    name: 'Rebar Cut & Bend',
    shortName: 'Rebar',
    tagline: 'Calibrated capture for rebar cut and bend — one camera first, more precision when you need it.',
    description:
      'Calibrated capture and execution validation for rebar fabrication. Start with one reference camera, expand to mixed coverage, and add LiDAR only where precision depth earns its keep.',
    status: 'live',
    heroImage: '/images/hero-welding.jpg',
    seoKeywords: [
      'rebar capture software',
      'rebar cut and bend software',
      'rebar fabrication execution validation',
      'calibrated fabrication capture',
    ],
    regimeIds: ['structural-fabrication', 'multi-project-optimization', 'machine-calibration'],
    metrics: [
      { value: '1 cam', label: 'Starting point' },
      { value: 'Mixed fleet', label: 'Coverage path' },
      { value: 'Optional LiDAR', label: 'Precision upgrade' },
      { value: '60 days', label: 'Validation window' },
    ],
    integrations: [
      'ERP and cut-list import',
      'Tablet capture and operator signoff',
      'QA and audit export',
      'Calibration-aware job context',
    ],
    workflowSteps: [
      'Set up your job specs and start with one reference camera at the bench',
      'Add context cameras when coverage or throughput demands broader visibility',
      'Introduce LiDAR-equipped devices only for precision depth checks that justify the extra cost',
      'Upload verified captures so every run builds on proven results',
    ],
  },
  {
    id: 'plate-press-brake',
    slug: 'plate-press-brake',
    name: 'Plate & Press Brake',
    shortName: 'Plate',
    tagline: 'Precision forming with execution verification at every bend.',
    description:
      'Guide, validate, and record press brake operations with angle verification, sequence control, and cleaner execution records.',
    status: 'coming-soon',
    heroImage: '/images/cnc-precision.jpg',
    seoKeywords: ['press brake software', 'plate forming validation'],
    regimeIds: ['machine-calibration'],
    metrics: [],
    integrations: [],
    workflowSteps: [],
  },
  {
    id: 'pipe-tube',
    slug: 'pipe-tube',
    name: 'Pipe & Tube',
    shortName: 'Pipe',
    tagline: 'Verified pipe bending from spec to audit trail.',
    description:
      'Execution validation for pipe and tube bending with springback compensation, dimensional tracking, and export-ready records.',
    status: 'coming-soon',
    heroImage: '/images/industrial-factory.jpg',
    seoKeywords: ['pipe bending software', 'tube fabrication validation'],
    regimeIds: [],
    metrics: [],
    integrations: [],
    workflowSteps: [],
  },
  {
    id: 'precast',
    slug: 'precast',
    name: 'Precast Reinforcement',
    shortName: 'Precast',
    tagline: 'Reinforcement cage verification before the pour.',
    description:
      'Quality verification for precast reinforcement cage assembly and placement, tied to pour documentation and handoff records.',
    status: 'adjacent',
    heroImage: '/images/structural-steel.jpg',
    seoKeywords: ['precast rebar verification', 'concrete cage validation'],
    regimeIds: [],
    metrics: [],
    integrations: [],
    workflowSteps: [],
  },
];

export function getWorkcellBySlug(slug: string): Workcell | undefined {
  return workcells.find((workcell) => workcell.slug === slug);
}

export function getLiveWorkcells(): Workcell[] {
  return workcells.filter((workcell) => workcell.status === 'live');
}

export function getExpansionWorkcells(): Workcell[] {
  return workcells.filter((workcell) => workcell.status !== 'live');
}
