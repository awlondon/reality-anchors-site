export type PhotoDividerData = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  body: string;
  imagePosition: 'left' | 'right';
  frameVariant: 'angle' | 'notch' | 'measure';
  imageObjectPosition?: string;
};

type PageDividers = {
  page: string;
  dividers: PhotoDividerData[];
};

const allDividers: PageDividers[] = [
  {
    page: 'home',
    dividers: [
      {
        id: 'home-team',
        imageSrc: '/images/people/fabrication-team-planning.jpg',
        imageAlt: 'Fabrication team reviewing cut list on tablet at workstation',
        eyebrow: 'Built by Operators, for Operators',
        heading: 'Your crew already knows the work. We make it trackable.',
        body: 'Reality Anchors was designed alongside fabrication teams — not imposed on them. Every workflow starts from how operators actually move through a job.',
        imagePosition: 'left',
        frameVariant: 'angle',
      },
      {
        id: 'home-engineer',
        imageSrc: '/images/people/engineer-reviewing-data.jpg',
        imageAlt: 'Engineer reviewing execution data on dual monitors',
        eyebrow: 'Execution Intelligence',
        heading: 'From shop floor data to boardroom decisions.',
        body: 'Execution records flow from the bench into structured reports. Quality managers, plant directors, and finance teams get the visibility they need without chasing paper.',
        imagePosition: 'right',
        frameVariant: 'notch',
      },
    ],
  },
  {
    page: 'rebar',
    dividers: [
      {
        id: 'rebar-operator',
        imageSrc: '/images/people/rebar-operator-measuring.jpg',
        imageAlt: 'Rebar operator measuring bar length with digital caliper',
        eyebrow: 'Precision at the Bench',
        heading: 'Every measurement confirmed. Every bend angle verified.',
        body: 'Operators follow guided sequences on a ruggedized tablet. The system validates each step against the cut list — catching errors before material is wasted.',
        imagePosition: 'left',
        frameVariant: 'measure',
      },
      {
        id: 'rebar-yard',
        imageSrc: '/images/people/yard-supervisor-team.jpg',
        imageAlt: 'Yard supervisor discussing production schedule with crew',
        eyebrow: 'Crew Coordination',
        heading: 'One view of every job, every bench, every shift.',
        body: 'Supervisors see real-time progress across work orders without walking the yard. Exception alerts surface problems before they compound.',
        imagePosition: 'right',
        frameVariant: 'angle',
      },
    ],
  },
  {
    page: 'commercial',
    dividers: [
      {
        id: 'commercial-quality',
        imageSrc: '/images/people/quality-inspector-checking.jpg',
        imageAlt: 'Quality inspector verifying fabricated steel components',
        eyebrow: 'Commercial Grade Quality',
        heading: 'Audit-ready records from the first cut to the last delivery.',
        body: 'Every fabrication action is logged with operator, timestamp, and measurement context. QA teams review structured data instead of chasing handwritten notes.',
        imagePosition: 'left',
        frameVariant: 'notch',
      },
    ],
  },
  {
    page: 'industrial',
    dividers: [
      {
        id: 'industrial-controls',
        imageSrc: '/images/people/plant-engineer-control-room.jpg',
        imageAlt: 'Plant engineer monitoring execution dashboards in control room',
        eyebrow: 'Enterprise Controls',
        heading: 'Compliance documentation the system produces automatically.',
        body: 'From machine calibration profiles to per-run trace logs, Reality Anchors generates audit artifacts at every level — without manual data entry.',
        imagePosition: 'right',
        frameVariant: 'angle',
      },
      {
        id: 'industrial-team',
        imageSrc: '/images/people/multi-facility-leadership.jpg',
        imageAlt: 'Leadership team reviewing multi-plant performance metrics',
        eyebrow: 'Scale with Confidence',
        heading: 'Deploy once. Replicate across every facility.',
        body: 'Standardized execution workflows and centralized reporting mean the same operational discipline scales from one plant to twenty.',
        imagePosition: 'left',
        frameVariant: 'measure',
      },
    ],
  },
  {
    page: 'personal',
    dividers: [
      {
        id: 'personal-solo',
        imageSrc: '/images/people/solo-operator-workshop.jpg',
        imageAlt: 'Solo operator working with tablet guidance in small workshop',
        eyebrow: 'Start Small, Build Habits',
        heading: 'Professional execution discipline from day one.',
        body: 'Even a one-person shop benefits from guided workflows. Build repeatable habits, capture proof of work, and create the foundation for growth.',
        imagePosition: 'left',
        frameVariant: 'angle',
      },
    ],
  },
];

export function getDividersForPage(page: string): PhotoDividerData[] {
  return allDividers.find((p) => p.page === page)?.dividers ?? [];
}
