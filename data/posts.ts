export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  published: boolean;
  content: BlogBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: 'reality-anchors-for-fabrication',
    title: 'Reality Anchors for Fabrication: Calibrated Capture for Rebar Workcells',
    description:
      'What "Reality Anchors" means in fabrication: start with your job specs, capture structured evidence, and improve every rebar run without pretending the bench is fully autonomous on day one.',
    date: '2026-03-14',
    author: 'Reality Anchors',
    tags: ['reality-anchors', 'fabrication', 'rebar'],
    readingTime: '6 min',
    published: true,
    content: [
      {
        type: 'paragraph',
        text: 'In fabrication, Reality Anchors means something concrete: validated runs, auditable proof that every step met spec, and operators who stay in control of the workflow instead of being replaced by it.',
      },
      {
        type: 'heading',
        text: 'Why the term matters in fabrication',
      },
      {
        type: 'paragraph',
        text: 'A fabrication workflow already knows a lot before a camera ever turns on. Bar size, shape code, tolerance, machine profile, operator signoff rules, and work order context are not guesses. Reality Anchors software starts with those job specs and uses structured capture to verify that each step actually happened the way it was supposed to.',
      },
      {
        type: 'list',
        items: [
          'Job specs are entered once, then used to validate every capture automatically.',
          'Customer-supplied cameras collect evidence without forcing a rip-and-replace hardware project.',
          'Mixed fleets are practical because reference, context, and depth devices each serve different jobs.',
        ],
      },
      {
        type: 'heading',
        text: 'How this shows up in a rebar cut-and-bend deployment',
      },
      {
        type: 'paragraph',
        text: 'A typical rollout starts with one reference camera and a narrow validation loop. The team proves that structured capture and operator-confirmed steps are enough to create useful, auditable records. Only after that baseline is stable do additional cameras or precision depth upgrades enter the workflow.',
      },
      {
        type: 'list',
        items: [
          'Step 1: one-camera baseline for structured capture at the bench.',
          'Step 2: add context cameras where throughput or coverage makes them useful.',
          'Step 3: add LiDAR only for precision depth checks that justify the extra cost.',
          'Step 4: upload verified captures so the next run starts with better reference data.',
        ],
      },
      {
        type: 'quote',
        text: 'Reality Anchors in fabrication is not a slogan. It is the operating principle that keeps capture tied to the job and gives operators auditable proof of every validated run.',
      },
      {
        type: 'heading',
        text: 'What buyers should expect',
      },
      {
        type: 'paragraph',
        text: 'Public pricing should mirror this reality. Pilot gets the smallest validated capture loop, Production adds analytics and calibration controls, and Enterprise adds governance and audit exports. The point is not to sell autonomy theater. The point is to make the capture path honest, measurable, and expandable.',
      },
    ],
  },
  {
    slug: 'calibrated-validation-vs-best-guess-filtering',
    title: 'Calibrated Validation vs. Best-Guess Filtering',
    description:
      'Why fabrication validation needs to be stricter than "looks about right" — and what changes when it is.',
    date: '2026-03-14',
    author: 'Reality Anchors',
    tags: ['technical-note', 'fabrication-validation', 'validation'],
    readingTime: '7 min',
    published: true,
    content: [
      {
        type: 'paragraph',
        text: 'Most industrial AI demos show you what "looks plausible." A bar that looks about the right length. A bend that seems close enough. For sorting photos or summarizing documents, that is fine. For fabrication, where cuts and bends are irreversible, "looks about right" is not good enough.',
      },
      {
        type: 'heading',
        text: 'The problem with "good enough" validation',
      },
      {
        type: 'paragraph',
        text: 'When a system only checks whether an output looks reasonable, it can approve work that violates the actual job spec. A plausible-looking bar can still be 3 mm out of tolerance. A bend angle that looks close can still fail the structural requirement. The gap between "plausible" and "within spec" is exactly where fabrication scrap lives.',
      },
      {
        type: 'list',
        items: [
          'A plausible answer can still violate the actual job tolerances.',
          'Confidence scores do not tell you whether the part is within spec.',
          'Fabricators need to know what passed and what did not, not what looked similar to something that passed before.',
        ],
      },
      {
        type: 'heading',
        text: 'What changes with strict, calibrated validation',
      },
      {
        type: 'paragraph',
        text: 'When validation is strict enough for irreversible operations, the entire workflow shifts. Operators get a clear pass/fail at each hold point. Supervisors can review exactly which checks were applied and what the results were. And when something does fail, the record shows precisely where and why — not a vague flag that something looked off.',
      },
      {
        type: 'list',
        items: [
          'Irreversible steps like cuts and bends get explicit pass/fail gates before work continues.',
          'Every validation result is recorded with the specific checks that were applied, creating an auditable trail.',
          'When a run goes wrong, the captured evidence pinpoints the step — no guessing, no finger-pointing.',
        ],
      },
      {
        type: 'heading',
        text: 'Why auditable records matter',
      },
      {
        type: 'paragraph',
        text: 'In fabrication, a validated record is not just useful for quality control. It is useful for customer disputes, insurance claims, regulatory audits, and continuous improvement. If you cannot replay exactly what was checked and what the result was, you do not have validation — you have a suggestion. Reality Anchors builds the record that stands up to scrutiny.',
      },
    ],
  },
  {
    slug: 'why-scrap-rates-lie',
    title: 'Why Published Scrap Rates Lie - And What to Measure Instead',
    description:
      'Industry scrap benchmarks hide fabrication waste in overhead. Execution-level measurement reveals the economics bench by bench.',
    date: '2026-03-07',
    author: 'Reality Anchors',
    tags: ['fabrication', 'scrap-reduction', 'measurement'],
    readingTime: '5 min',
    published: true,
    content: [
      {
        type: 'paragraph',
        text: 'Published scrap rates are useful as rough baselines, but they flatten the real causes of waste. They rarely show where the loss came from, which bench created it, or which part of the workflow should change next.',
      },
      {
        type: 'heading',
        text: 'What to measure instead',
      },
      {
        type: 'list',
        items: [
          'Preventable miscuts and rework events by bench.',
          'Declared-versus-observed execution drift.',
          'Offcut reuse quality and remnant visibility.',
          'Time spent on repetitive setup versus productive work.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Bench-level economics make pricing and rollout conversations more honest because buyers can see exactly what is being measured and where a calibrated capture workflow changes the result.',
      },
    ],
  },
];

export function getPublishedPosts(): BlogPost[] {
  return posts.filter((post) => post.published).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug && post.published);
}

export function getAllTags(): string[] {
  const tagSet = new Set(posts.filter((post) => post.published).flatMap((post) => post.tags));
  return Array.from(tagSet).sort();
}
