/**
 * Client-side search index for site-wide search.
 * Maps keywords to pages so users can find content without a server.
 */

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

const searchEntries: SearchResult[] = [
  {
    title: 'Platform Overview',
    description: 'AI-guided execution validation: Guide, Validate, Record.',
    href: '/platform/',
    category: 'Platform',
  },
  {
    title: 'Rebar Cut & Bend',
    description: 'Flagship workcell for rebar fabrication execution validation.',
    href: '/industries/rebar-cut-bend/',
    category: 'Industries',
  },
  {
    title: 'Industries & Workcells',
    description: 'Explore fabrication workcells: rebar, plate, pipe, precast.',
    href: '/industries/',
    category: 'Industries',
  },
  {
    title: 'Personal Plans',
    description: 'Entry-level plans for independent fabricators and small shops.',
    href: '/personal/',
    category: 'Pricing',
  },
  {
    title: 'Commercial Solutions',
    description: 'Execution intelligence for yards and mid-size operations.',
    href: '/commercial/',
    category: 'Pricing',
  },
  {
    title: 'Industrial & Enterprise',
    description: 'Enterprise validation with ERP integration and compliance controls.',
    href: '/industrial/',
    category: 'Pricing',
  },
  {
    title: 'Quick Estimate Calculator',
    description: 'Estimate scrap savings in under 60 seconds.',
    href: '/calculator/',
    category: 'Tools',
  },
  {
    title: 'Margin Impact Model',
    description: 'Interactive financial model: material, labor, throughput, EBITDA.',
    href: '/margin-impact/',
    category: 'Tools',
  },
  {
    title: 'Pricing Methodology',
    description: 'Published baselines, conservative deltas, transparent pricing.',
    href: '/pricing-methodology/',
    category: 'Pricing',
  },
  {
    title: 'Board Strategy',
    description: 'Executive-level value narrative and margin impact positioning.',
    href: '/board-strategy/',
    category: 'Strategy',
  },
  {
    title: 'Blog',
    description: 'Insights on fabrication execution and operational validation.',
    href: '/blog/',
    category: 'Resources',
  },
  {
    title: 'Privacy Policy',
    description: 'How we handle your data.',
    href: '/privacy/',
    category: 'Legal',
  },
  {
    title: 'Terms of Service',
    description: 'Site usage, liability, and legal terms.',
    href: '/terms/',
    category: 'Legal',
  },
];

export function search(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/);

  return searchEntries
    .map((entry) => {
      const text = `${entry.title} ${entry.description} ${entry.category}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (text.includes(term)) score += 1;
        if (entry.title.toLowerCase().includes(term)) score += 2;
      }
      return { ...entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
