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
    tagline: 'Rebar cut+bend execution — without scrap surprises.',
    description:
      'AI-guided validation for rebar fabrication. Every cut measured, every bend verified, every ton accounted for.',
    status: 'live',
    heroImage: '/images/hero-welding.jpg',
    seoKeywords: [
      'rebar cut and bend software',
      'rebar fabrication execution',
      'rebar scrap reduction',
      'rebar production management',
    ],
    regimeIds: ['structural-fabrication', 'multi-project-optimization', 'machine-calibration'],
    metrics: [
      { value: '1.8 pts', label: 'Median scrap delta' },
      { value: '6–10 t/mo', label: 'Material recovered' },
      { value: '97.4%', label: 'Offline uptime' },
      { value: '60 days', label: 'Validation window' },
    ],
    integrations: [
      'ERP cut-list import',
      'BLE bend telemetry',
      'Tablet OCR',
      'QA audit export',
    ],
    workflowSteps: [
      'Import cut list from schedule, manual entry, or photo OCR',
      'Follow step-by-step execution guidance with hold points',
      'Validate each step against live job context and machine profile',
      'Record every action with timestamps, operator ID, and traceability',
    ],
  },
  {
    id: 'plate-press-brake',
    slug: 'plate-press-brake',
    name: 'Plate & Press Brake',
    shortName: 'Plate',
    tagline: 'Precision forming with execution verification at every bend.',
    description:
      'Guide, validate, and record press brake operations with AI-driven angle verification and sequence tracking.',
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
      'Execution validation for pipe and tube bending with springback compensation and dimensional tracking.',
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
      'Quality verification for precast reinforcement cage assembly and placement, tied to pour documentation.',
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
  return workcells.find((w) => w.slug === slug);
}

export function getLiveWorkcells(): Workcell[] {
  return workcells.filter((w) => w.status === 'live');
}

export function getExpansionWorkcells(): Workcell[] {
  return workcells.filter((w) => w.status !== 'live');
}
