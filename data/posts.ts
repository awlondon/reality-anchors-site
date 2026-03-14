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
    title: 'Reality Anchors for Fabrication: Deterministic Capture for Rebar Workcells',
    description:
      'What "Reality Anchors" means in fabrication: start from known facts, capture structured evidence, and improve every rebar run without pretending the bench is fully autonomous on day one.',
    date: '2026-03-14',
    author: 'Reality Anchors',
    tags: ['reality-anchors', 'fabrication', 'rebar'],
    readingTime: '6 min',
    published: true,
    content: [
      {
        type: 'paragraph',
        text: 'In fabrication, Reality Anchors means something concrete: declared facts that stay fixed while the system captures, validates, and learns from what actually happened at the bench.',
      },
      {
        type: 'heading',
        text: 'Why the term matters in fabrication',
      },
      {
        type: 'paragraph',
        text: 'A fabrication workflow already knows a lot before a camera ever turns on. Bar size, shape code, tolerance, machine profile, operator signoff rules, and work order context are not guesses. They are anchors. Reality Anchors software starts there instead of asking a model to hallucinate the job from pixels alone.',
      },
      {
        type: 'list',
        items: [
          'Known facts are declared once, then reused across capture and validation.',
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
        text: 'A typical rollout starts with one reference camera and a narrow validation loop. The team proves that declared bar data, operator-confirmed steps, and structured capture are enough to create useful records. Only after that baseline is stable do additional cameras or precision depth upgrades enter the workflow.',
      },
      {
        type: 'list',
        items: [
          'Step 1: one-camera baseline for deterministic capture at the bench.',
          'Step 2: add context cameras where throughput or coverage makes them useful.',
          'Step 3: add LiDAR only for precision depth checks that justify the extra cost.',
          'Step 4: upload verified captures so the next run starts smarter.',
        ],
      },
      {
        type: 'quote',
        text: 'Reality Anchors in fabrication is not a slogan. It is the operating principle that keeps capture tied to the job instead of to model guesswork.',
      },
      {
        type: 'heading',
        text: 'What buyers should expect',
      },
      {
        type: 'paragraph',
        text: 'Public pricing should mirror this reality. Pilot gets the smallest deterministic loop, Production adds analytics and calibration controls, and Enterprise adds governance and audit exports. The point is not to sell autonomy theater. The point is to make the capture path honest, measurable, and expandable.',
      },
    ],
  },
  {
    slug: 'deterministic-constraint-anchoring-vs-plausibility-filtering',
    title: 'Deterministic Constraint Anchoring vs. Probabilistic Plausibility Filtering',
    description:
      'A technical note on why fabrication systems should anchor to declared constraints first, then use machine learning to improve inside those boundaries.',
    date: '2026-03-14',
    author: 'Reality Anchors',
    tags: ['technical-note', 'fabrication-ai', 'validation'],
    readingTime: '7 min',
    published: true,
    content: [
      {
        type: 'paragraph',
        text: 'Most AI demos for industrial capture talk about what looks plausible. Fabrication systems need something stricter: what is allowable given the known job, machine, and tolerance constraints.',
      },
      {
        type: 'heading',
        text: 'Deterministic constraint anchoring',
      },
      {
        type: 'paragraph',
        text: 'Constraint anchoring means the system starts with declared facts that are not negotiable during inference. Machine profile, bar dimensions, tolerance envelope, work order context, and required hold points form the validation boundary. The model can help interpret observations, but it does not get to rewrite the boundary.',
      },
      {
        type: 'list',
        items: [
          'The anchor comes first.',
          'Capture is interpreted inside that anchor.',
          'Operator signoff resolves ambiguity before irreversible work continues.',
        ],
      },
      {
        type: 'heading',
        text: 'Probabilistic plausibility filtering',
      },
      {
        type: 'paragraph',
        text: 'Plausibility filtering asks a softer question: does the output look reasonable? That can be useful for ranking or summarization, but it is weaker than fabrication validation because a plausible answer can still violate the actual job. A system can sound confident and still be wrong about the thing that matters on the floor.',
      },
      {
        type: 'heading',
        text: 'Why fabrication prefers anchors first',
      },
      {
        type: 'list',
        items: [
          'Irreversible steps such as cuts and bends need deterministic gates.',
          'Auditability depends on being able to replay the exact constraint set used at the time.',
          'Learning improves faster when the training data is tied to verified outcomes instead of loosely plausible labels.',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is why Reality Anchors positions machine learning as an improvement loop, not as permission to skip declared constraints. In fabrication, the safer architecture is to anchor first and learn second.',
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
        text: 'Bench-level economics make pricing and rollout conversations more honest because buyers can see exactly what is being measured and where a deterministic capture workflow changes the result.',
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
