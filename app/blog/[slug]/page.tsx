import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts, getPostBySlug } from '@/data/posts';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <main id="main-content" className="min-h-screen bg-bg pt-28 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-10">
            <Link
              href="/blog/"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-accent hover:text-accent-2 transition-colors mb-4 inline-block"
            >
              &larr; Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-accent bg-accent/10 rounded px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-txt leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{post.author}</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>{post.readingTime} read</span>
            </div>
          </header>

          <div className="prose prose-invert max-w-none text-muted [&_h2]:text-txt [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-txt [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:text-txt [&_a]:text-accent [&_a:hover]:text-accent-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted/80">
            <p className="text-lg text-txt/90 leading-relaxed mb-6">
              {post.description}
            </p>
            <p className="text-muted">
              Full article content coming soon. This post is a placeholder to demonstrate the blog infrastructure.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
