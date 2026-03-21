export type PricingTierId = 'pilot' | 'production' | 'enterprise';

export interface PricingTier {
  id: PricingTierId;
  name: string;
  href: string;
  price: string;
  badge: string;
  description: string;
  fit: string;
  includedUsage: {
    cameras: string;
    storage: string;
    overage: string;
  };
  highlights: string[];
  moduleIds: string[];
  cta: string;
  highlight?: boolean;
}

export interface PricingModuleStatus {
  id: string;
  name: string;
  includedIn: string;
  enforcementStatus: string;
  note: string;
}

export interface DeviceAddOn {
  id: 'context_camera' | 'lidar_device';
  name: string;
  price: string;
  monthlyUsd: number;
  description: string;
  valueAnchor: string;
  capabilityStep: string;
}

export const deviceAddOns: DeviceAddOn[] = [
  {
    id: 'context_camera',
    name: 'Context Camera',
    price: '$200/device/mo',
    monthlyUsd: 200,
    description: 'Add wider coverage, redundancy, or multi-angle capture to any bench.',
    valueAnchor: 'Wider coverage without complexity',
    capabilityStep: '02',
  },
  {
    id: 'lidar_device',
    name: 'LiDAR-Equipped Device',
    price: '$450/device/mo',
    monthlyUsd: 450,
    description: 'Sub-millimetre precision depth for tighter bend verification or spacing checks.',
    valueAnchor: 'Precision depth where accuracy earns its keep',
    capabilityStep: '03',
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: 'pilot',
    name: 'Pilot',
    href: '/personal/',
    price: '$1,200/bench/mo',
    badge: 'Start Here',
    description:
      'Start with calibrated capture on one bench. Pilot includes the baseline workflow modules you need to prove fit before you expand.',
    fit: 'Single benches, small crews, and beta evaluations that need a clean path into paid production use.',
    includedUsage: {
      cameras: '1 reference camera (included)',
      storage: 'Starter capture storage for one active bench',
      overage: 'Additional cameras or storage can be added without changing tiers',
    },
    highlights: [
      'One-camera baseline',
      'Includes ar_execution + daily_dashboards',
      'Written review date before conversion',
      'Fastest path to first validated workflow',
    ],
    moduleIds: ['ar_execution', 'daily_dashboards'],
    cta: 'Explore Pilot',
  },
  {
    id: 'production',
    name: 'Production',
    href: '/commercial/',
    price: '$3,200/bench/mo',
    badge: 'Recommended',
    description:
      'Scale from a single reference camera into mixed-camera coverage. Production includes the analytics and calibration controls teams expect before wider rollout.',
    fit: 'Fabrication yards, multi-bench shops, and operators who need repeatable validation with cleaner economics.',
    includedUsage: {
      cameras: '1 reference camera (included) — add context or LiDAR devices as needed',
      storage: 'Pooled capture storage sized for daily production workflows',
      overage: 'Transparent add-ons for higher camera density or heavier storage volumes',
    },
    highlights: [
      'Mixed fleet orchestration',
      'Includes analytics_qa + custom_calibration',
      'Per-bench economics visibility',
      'Clear upgrade path for LiDAR precision',
    ],
    moduleIds: ['ar_execution', 'daily_dashboards', 'analytics_qa', 'custom_calibration'],
    cta: 'Explore Production',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    href: '/industrial/',
    price: '$4,800/bench/mo',
    badge: 'Scale',
    description:
      'Standardize execution across yards and plants with governance, auditability, and scoped hardware/storage pools that reflect the real rollout. Enterprise includes the export and audit controls larger programs expect.',
    fit: 'High-volume plants, ERP-connected operations, and multi-site programs that need formal controls.',
    includedUsage: {
      cameras: '1 reference camera (included) — scoped device allocation by site and validation scope',
      storage: 'Contracted storage pools for long-run traceability and exports',
      overage: 'Custom overage schedules agreed during technical review',
    },
    highlights: [
      'Compliance-grade records',
      'Includes compliance_export + audit_trails',
      'Deployment governance for larger fleets',
    ],
    moduleIds: [
      'ar_execution',
      'daily_dashboards',
      'analytics_qa',
      'custom_calibration',
      'compliance_export',
      'audit_trails',
    ],
    cta: 'Explore Enterprise',
  },
];

export const pricingNarrative = {
  eyebrow: 'Per-Bench Economics',
  title: 'Price around the station that creates or prevents scrap',
  body: 'A bench is one active fabrication station with its own operators, capture workflow, and validation history. Pricing follows the bench so buyers can connect setup effort, included usage, and measured value without guessing what is bundled.',
  bullets: [
    'Pilot and beta evaluations include a documented review date, tier boundary, and conversion expectation before activation.',
    'Every bench includes one reference camera. Context cameras ($200/mo) and LiDAR-equipped devices ($450/mo) are added per device when wider coverage or precision depth is needed.',
    'Plan-specific modules use "included in [Plan]" language. Where feature gates are still rolling out, the pricing page calls that out explicitly instead of pretending enforcement is already complete.',
    'Advanced safety workflows and stronger protection boundaries are scoped separately from the base offer until the technical and legal limits are explicit.',
  ],
};

export const pricingModuleStatus: PricingModuleStatus[] = [
  {
    id: 'ar_execution',
    name: 'AR Execution Guidance',
    includedIn: 'Pilot, Production, Enterprise',
    enforcementStatus: 'Available now',
    note: 'Core workflow module already live across plans.',
  },
  {
    id: 'daily_dashboards',
    name: 'Daily Dashboards',
    includedIn: 'Pilot, Production, Enterprise',
    enforcementStatus: 'Available now',
    note: 'Core reporting module already live across plans.',
  },
  {
    id: 'analytics_qa',
    name: 'Analytics & QA',
    includedIn: 'Production, Enterprise',
    enforcementStatus: 'Progressive enforcement',
    note: 'Public plan designation is live; feature-gate wiring is still rolling out.',
  },
  {
    id: 'custom_calibration',
    name: 'Custom Calibration',
    includedIn: 'Production, Enterprise',
    enforcementStatus: 'Progressive enforcement',
    note: 'Custom profile gating is documented but not fully wired yet.',
  },
  {
    id: 'compliance_export',
    name: 'Compliance Export',
    includedIn: 'Enterprise',
    enforcementStatus: 'Progressive enforcement',
    note: 'Enterprise designation is public; export gating is still being wired.',
  },
  {
    id: 'audit_trails',
    name: 'Audit Trails',
    includedIn: 'Enterprise',
    enforcementStatus: 'Progressive enforcement',
    note: 'Enterprise designation is public; access enforcement is still rolling out.',
  },
];
