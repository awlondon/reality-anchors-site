export type TierAvailability = true | false | 'limited' | 'custom';

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Advanced' | 'Enterprise';
  tiers: {
    personal: TierAvailability;
    commercial: TierAvailability;
    industrial: TierAvailability;
  };
}

export const featureCategories = ['Core', 'Advanced', 'Enterprise'] as const;

export const features: Feature[] = [
  // Core
  {
    id: 'ar_execution',
    name: 'AR Execution Guidance',
    description: 'Step-by-step augmented reality overlays for cut, bend, and assembly verification at the bench.',
    category: 'Core',
    tiers: { personal: true, commercial: true, industrial: true },
  },
  {
    id: 'daily_dashboards',
    name: 'Daily Dashboards',
    description: 'Shift-level production summaries with scrap, throughput, and quality KPIs.',
    category: 'Core',
    tiers: { personal: true, commercial: true, industrial: true },
  },
  {
    id: 'offline_support',
    name: 'Offline-First Operation',
    description: 'Full functionality without internet. Syncs automatically when connectivity resumes.',
    category: 'Core',
    tiers: { personal: true, commercial: true, industrial: true },
  },
  {
    id: 'email_support',
    name: 'Email Support',
    description: 'Technical support via email with guaranteed response times.',
    category: 'Core',
    tiers: { personal: 'limited', commercial: true, industrial: true },
  },
  {
    id: 'seat_capacity',
    name: 'Bench Capacity',
    description: 'Number of concurrent operator benches supported per license.',
    category: 'Core',
    tiers: { personal: 'limited', commercial: true, industrial: true },
  },
  // Advanced
  {
    id: 'analytics_qa',
    name: 'Analytics & QA',
    description: 'Statistical process control, trend analysis, and quality assurance dashboards across all benches.',
    category: 'Advanced',
    tiers: { personal: false, commercial: true, industrial: true },
  },
  {
    id: 'custom_calibration',
    name: 'Custom Calibration',
    description: 'Design and store custom die profiles for unlimited SKUs. Machine-specific calibration governance.',
    category: 'Advanced',
    tiers: { personal: false, commercial: true, industrial: true },
  },
  {
    id: 'priority_support',
    name: 'Priority Support (24h)',
    description: 'Dedicated priority queue with 24-hour response guarantee and phone escalation.',
    category: 'Advanced',
    tiers: { personal: false, commercial: true, industrial: true },
  },
  {
    id: 'scrap_reduction',
    name: 'Scrap Reduction Engine',
    description: 'AI-optimized cut plans that minimize material waste across job batches.',
    category: 'Advanced',
    tiers: { personal: false, commercial: true, industrial: true },
  },
  // Enterprise
  {
    id: 'compliance_export',
    name: 'Compliance Export',
    description: 'Export audit-ready compliance reports for regulatory submissions and third-party audits.',
    category: 'Enterprise',
    tiers: { personal: false, commercial: false, industrial: true },
  },
  {
    id: 'audit_trails',
    name: 'Audit Trails',
    description: 'Immutable, timestamped records of every operator action for traceability and accountability.',
    category: 'Enterprise',
    tiers: { personal: false, commercial: false, industrial: true },
  },
  {
    id: 'dedicated_am',
    name: 'Dedicated Account Manager',
    description: 'Named account manager with quarterly business reviews and proactive optimization recommendations.',
    category: 'Enterprise',
    tiers: { personal: false, commercial: false, industrial: true },
  },
  {
    id: 'sla_uptime',
    name: 'SLA-Backed Uptime',
    description: 'Contractual uptime guarantee with financial remedies for service-level breaches.',
    category: 'Enterprise',
    tiers: { personal: false, commercial: false, industrial: true },
  },
  {
    id: 'erp_integration',
    name: 'ERP Integration',
    description: 'Bi-directional data sync with SAP, Oracle, or custom ERP systems for unified production planning.',
    category: 'Enterprise',
    tiers: { personal: false, commercial: false, industrial: true },
  },
];

export function getFeaturesByCategory(category: Feature['category']): Feature[] {
  return features.filter((f) => f.category === category);
}
