import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/data/posts';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on fabrication execution, scrap reduction, and operational validation from the Reality Anchors team.',
};

export default function BlogIndex() {
  const posts = getPublishedPosts();

  return (
    <>
      <main id="main-content" className="min-h-screen bg-bg pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-3">
              Resources
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-txt leading-tight mb-4">Blog</h1>
            <p className="text-lg text-muted max-w-2xl">
              Fabrication execution insights, measurement frameworks, and operational validation thinking.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-muted text-sm">Posts coming soon.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="group block border border-line hover:border-accent/40 rounded-xl p-6 transition-all hover:bg-card/50"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-accent bg-accent/10 rounded px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-txt group-hover:text-accent-2 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted mb-3">{post.description}</p>
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
