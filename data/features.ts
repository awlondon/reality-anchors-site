export type TierAvailability = true | false | 'limited' | 'custom';

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Advanced' | 'Enterprise';
  tiers: {
    pilot: TierAvailability;
    production: TierAvailability;
    enterprise: TierAvailability;
  };
}

export const featureCategories = ['Core', 'Advanced', 'Enterprise'] as const;

export const features: Feature[] = [
  // Core
  {
    id: 'ar_execution',
    name: 'AR Execution Guidance',
    description:
      'Step-by-step execution guidance and hold points that keep validation tied to the live job at the bench.',
    category: 'Core',
    tiers: { pilot: true, production: true, enterprise: true },
  },
  {
    id: 'daily_dashboards',
    name: 'Daily Dashboards',
    description: 'Shift-level bench economics with scrap, throughput, capture usage, and quality KPIs.',
    category: 'Core',
    tiers: { pilot: true, production: true, enterprise: true },
  },
  {
    id: 'offline_support',
    name: 'Offline-First Operation',
    description: 'Full functionality without internet. Syncs automatically when connectivity resumes.',
    category: 'Core',
    tiers: { pilot: true, production: true, enterprise: true },
  },
  {
    id: 'email_support',
    name: 'Email Support (48h)',
    description: 'Technical support via email with 48-hour guaranteed response time.',
    category: 'Core',
    tiers: { pilot: true, production: true, enterprise: true },
  },
  {
    id: 'bench_capacity',
    name: 'Bench Capacity',
    description: 'Number of concurrent operator benches supported per license.',
    category: 'Core',
    tiers: { pilot: 'limited', production: true, enterprise: true },
  },
  // Advanced
  {
    id: 'analytics_qa',
    name: 'Analytics & QA',
    description: 'Statistical process control, trend analysis, and quality assurance dashboards across all benches.',
    category: 'Advanced',
    tiers: { pilot: false, production: true, enterprise: true },
  },
  {
    id: 'custom_calibration',
    name: 'Custom Calibration',
    description:
      'Stays calibrated to your specific machines and tolerances so validation matches the real bench.',
    category: 'Advanced',
    tiers: { pilot: false, production: true, enterprise: true },
  },
  {
    id: 'priority_support',
    name: 'Priority Support (24h)',
    description: 'Dedicated priority queue with 24-hour response guarantee and phone escalation.',
    category: 'Advanced',
    tiers: { pilot: false, production: true, enterprise: true },
  },
  {
    id: 'scrap_reduction',
    name: 'Scrap Reduction Engine',
    description:
      'Modeled optimization workflows that reduce preventable waste and improve reuse decisions across job batches.',
    category: 'Advanced',
    tiers: { pilot: false, production: true, enterprise: true },
  },
  // Enterprise
  {
    id: 'compliance_export',
    name: 'Compliance Export',
    description: 'Export audit-ready compliance reports for regulatory submissions and third-party audits.',
    category: 'Enterprise',
    tiers: { pilot: false, production: false, enterprise: true },
  },
  {
    id: 'audit_trails',
    name: 'Audit Trails',
    description: 'Immutable, timestamped records of every operator action for traceability and accountability.',
    category: 'Enterprise',
    tiers: { pilot: false, production: false, enterprise: true },
  },
  {
    id: 'dedicated_am',
    name: 'Dedicated Account Manager',
    description: 'Named account manager with quarterly business reviews and proactive optimization recommendations.',
    category: 'Enterprise',
    tiers: { pilot: false, production: false, enterprise: true },
  },
  {
    id: 'sla_uptime',
    name: 'SLA-Backed Uptime',
    description: 'Contractual uptime guarantee with financial remedies for service-level breaches.',
    category: 'Enterprise',
    tiers: { pilot: false, production: false, enterprise: true },
  },
  {
    id: 'erp_integration',
    name: 'ERP Integration',
    description: 'Bi-directional data sync with SAP, Oracle, or custom ERP systems for unified production planning.',
    category: 'Enterprise',
    tiers: { pilot: false, production: false, enterprise: true },
  },
];

export function getFeaturesByCategory(category: Feature['category']): Feature[] {
  return features.filter((f) => f.category === category);
}
