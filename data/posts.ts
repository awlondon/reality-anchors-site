export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  published: boolean;
}

/**
 * Blog post index — add entries here as posts are written.
 * Actual post content lives in app/blog/[slug]/content.tsx as React components.
 * This keeps the blog working with static export (no MDX runtime needed).
 */
export const posts: BlogPost[] = [
  {
    slug: 'why-scrap-rates-lie',
    title: 'Why Published Scrap Rates Lie — And What to Measure Instead',
    description:
      'Industry scrap benchmarks hide fabrication waste in overhead. Here is how execution-level measurement changes the math.',
    date: '2026-03-07',
    author: 'Reality Anchors',
    tags: ['fabrication', 'scrap-reduction', 'measurement'],
    readingTime: '5 min',
    published: true,
  },
];

export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug && p.published);
}

export function getAllTags(): string[] {
  const tagSet = new Set(posts.filter((p) => p.published).flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}
