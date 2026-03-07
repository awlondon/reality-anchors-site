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
    id: 'structural-fab-midwest',
    title: 'Structural fabricator, Midwest US',
    industry: 'Structural steel',
    before: [
      { label: 'Scrap rate', value: '9.2%' },
      { label: 'Rework hours / week', value: '38 hrs' },
      { label: 'Traceability', value: 'Manual logs' },
    ],
    after: [
      { label: 'Scrap rate', value: '4.1%' },
      { label: 'Rework hours / week', value: '11 hrs' },
      { label: 'Traceability', value: 'Automated per-piece' },
    ],
    payback: '< 4 months',
  },
  {
    id: 'precast-southeast',
    title: 'Precast concrete producer, Southeast US',
    industry: 'Precast concrete',
    before: [
      { label: 'Calibration drift events / mo', value: '12' },
      { label: 'QA documentation time', value: '6 hrs / day' },
      { label: 'Scrap rate', value: '7.8%' },
    ],
    after: [
      { label: 'Calibration drift events / mo', value: '2' },
      { label: 'QA documentation time', value: '1.5 hrs / day' },
      { label: 'Scrap rate', value: '3.9%' },
    ],
    payback: '< 6 months',
  },
  {
    id: 'rebar-multi-plant',
    title: 'Multi-plant rebar operation, Texas',
    industry: 'Rebar fabrication',
    before: [
      { label: 'Miscut rate', value: '5.6%' },
      { label: 'Plan-to-cut latency', value: '18 min' },
      { label: 'Shift-to-shift variance', value: 'High' },
    ],
    after: [
      { label: 'Miscut rate', value: '1.2%' },
      { label: 'Plan-to-cut latency', value: '4 s' },
      { label: 'Shift-to-shift variance', value: 'Minimal' },
    ],
    payback: '< 3 months',
  },
];

export default caseStudies;
