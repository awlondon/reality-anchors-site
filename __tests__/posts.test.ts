import { describe, it, expect } from 'vitest';
import { getPublishedPosts, getPostBySlug, getAllTags, posts } from '@/data/posts';

describe('posts data', () => {
  it('has at least one post', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('all posts have required fields', () => {
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.author).toBeTruthy();
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.readingTime).toBeTruthy();
    }
  });
});

describe('getPublishedPosts', () => {
  it('returns only published posts', () => {
    const published = getPublishedPosts();
    for (const p of published) {
      expect(p.published).toBe(true);
    }
  });

  it('sorts by date descending', () => {
    const published = getPublishedPosts();
    for (let i = 1; i < published.length; i++) {
      expect(new Date(published[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(published[i].date).getTime(),
      );
    }
  });
});

describe('getPostBySlug', () => {
  it('returns a post for valid slug', () => {
    const post = getPostBySlug('why-scrap-rates-lie');
    expect(post).toBeDefined();
    expect(post?.title).toContain('Scrap Rates');
  });

  it('returns undefined for invalid slug', () => {
    expect(getPostBySlug('nonexistent')).toBeUndefined();
  });
});

describe('getAllTags', () => {
  it('returns sorted unique tags', () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i - 1].localeCompare(tags[i])).toBeLessThanOrEqual(0);
    }
  });
});
