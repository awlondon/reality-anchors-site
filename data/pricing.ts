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

export const pricingTiers: PricingTier[] = [
  {
    id: 'pilot',
    name: 'Pilot',
    href: '/personal/',
    price: '$1,200/bench/mo',
    badge: 'Start Here',
    description:
      'Start with deterministic capture on one bench. Bring your own compatible camera, declare known facts once, and prove fit before you expand.',
    fit: 'Single benches, small crews, and beta evaluations that need a clean path into paid production use.',
    includedUsage: {
      cameras: '1 reference camera',
      storage: 'Starter capture storage for one active bench',
      overage: 'Additional cameras or storage can be added without changing tiers',
    },
    highlights: [
      'One-camera baseline',
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
      'Scale from a single reference camera into mixed-camera coverage. Production adds the analytics and calibration controls teams expect before wider rollout.',
    fit: 'Fabrication yards, multi-bench shops, and operators who need repeatable validation with cleaner economics.',
    includedUsage: {
      cameras: 'Mixed-camera starter coverage for active benches',
      storage: 'Pooled capture storage sized for daily production workflows',
      overage: 'Transparent add-ons for higher camera density or heavier storage volumes',
    },
    highlights: [
      'Mixed fleet orchestration',
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
      'Standardize execution across yards and plants with governance, auditability, and scoped hardware/storage pools that reflect the real rollout.',
    fit: 'High-volume plants, ERP-connected operations, and multi-site programs that need formal controls.',
    includedUsage: {
      cameras: 'Scoped camera allocation by site, bench density, and validation scope',
      storage: 'Contracted storage pools for long-run traceability and exports',
      overage: 'Custom overage schedules agreed during technical review',
    },
    highlights: ['Compliance-grade records', 'ERP and QA export support', 'Deployment governance for larger fleets'],
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
    'Reality Anchors software orchestrates the capture workflow; customers bring their own compatible cameras and add LiDAR only where precision depth matters.',
    'Advanced safety workflows and stronger protection boundaries are scoped separately from the base offer until the technical and legal limits are explicit.',
  ],
};
