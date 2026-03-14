import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/data/posts';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fabrication Execution Blog',
  description:
    'Technical notes and field perspectives on fabrication capture, deterministic validation, scrap reduction, and Reality Anchors deployment strategy.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndex() {
  const posts = getPublishedPosts();

  return (
    <>
      <main id="main-content" className="min-h-screen bg-bg pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Resources</p>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-txt md:text-5xl">Fabrication Execution Blog</h1>
            <p className="max-w-2xl text-lg text-muted">
              Fabrication capture insights, deterministic validation notes, pricing logic, and technical positioning
              from the Reality Anchors team.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-sm text-muted">Posts coming soon.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="group block rounded-xl border border-line p-6 transition-all hover:border-accent/40 hover:bg-card/50"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded px-2 py-0.5 text-xs font-mono text-accent bg-accent/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-txt transition-colors group-hover:text-accent-2">
                    {post.title}
                  </h2>
                  <p className="mb-3 text-sm text-muted">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted/70">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span>{post.readingTime} read</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
