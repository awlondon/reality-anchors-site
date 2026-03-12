export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  before: { label: string; value: string }[];
  after: { label: string; value: string }[];
  payback: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'structural-fab-scenario',
    title: 'Structural fabrication shop',
    industry: 'Structural steel',
    before: [
      { label: 'Scrap rate', value: '6–10%' },
      { label: 'Rework hours / week', value: '20–40 hrs' },
      { label: 'Traceability', value: 'Manual logs' },
    ],
    after: [
      { label: 'Scrap rate', value: '4–7%' },
      { label: 'Rework hours / week', value: 'Up to 50% reduction' },
      { label: 'Traceability', value: 'Automated per-piece' },
    ],
    payback: 'Modeled at 4–8 months',
  },
  {
    id: 'precast-scenario',
    title: 'Precast concrete producer',
    industry: 'Precast concrete',
    before: [
      { label: 'Calibration drift events / mo', value: '8–15' },
      { label: 'QA documentation time', value: '4–6 hrs / day' },
      { label: 'Scrap rate', value: '5–9%' },
    ],
    after: [
      { label: 'Calibration drift events / mo', value: 'Up to 80% reduction' },
      { label: 'QA documentation time', value: '1–2 hrs / day' },
      { label: 'Scrap rate', value: '3–6%' },
    ],
    payback: 'Modeled at 5–9 months',
  },
  {
    id: 'rebar-multi-plant-scenario',
    title: 'Multi-plant rebar operation',
    industry: 'Rebar fabrication',
    before: [
      { label: 'Miscut rate', value: '4–7%' },
      { label: 'Plan-to-cut latency', value: '10–20 min' },
      { label: 'Shift-to-shift variance', value: 'High' },
    ],
    after: [
      { label: 'Miscut rate', value: '1–3%' },
      { label: 'Plan-to-cut latency', value: '< 5 s' },
      { label: 'Shift-to-shift variance', value: 'Minimal' },
    ],
    payback: 'Modeled at 3–6 months',
  },
];

export default caseStudies;
