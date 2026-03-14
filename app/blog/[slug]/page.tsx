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
    alternates: { canonical: `/blog/${slug}/` },
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
              className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-2"
            >
              &larr; Back to Blog
            </Link>
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded px-2 py-0.5 text-xs font-mono text-accent bg-accent/10">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-txt md:text-4xl">{post.title}</h1>
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

          <div className="prose prose-invert max-w-none text-muted [&_h2]:text-txt [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:text-txt [&_a]:text-accent [&_a:hover]:text-accent-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted/80">
            <p className="mb-6 text-lg leading-relaxed text-txt/90">{post.description}</p>
            {post.content.map((block, index) => {
              if (block.type === 'heading') {
                return <h2 key={`${block.type}-${index}`}>{block.text}</h2>;
              }

              if (block.type === 'list') {
                return (
                  <ul key={`${block.type}-${index}`}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (block.type === 'quote') {
                return <blockquote key={`${block.type}-${index}`}>{block.text}</blockquote>;
              }

              return <p key={`${block.type}-${index}`}>{block.text}</p>;
            })}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
