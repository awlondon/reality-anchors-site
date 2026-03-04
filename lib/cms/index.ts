/**
 * Headless CMS abstraction layer — scaffold.
 *
 * Currently reads content from local JSON/TS files.
 * To connect a CMS (Contentful, Sanity, Keystatic, etc.):
 *   1. Install the CMS SDK
 *   2. Implement the ContentProvider interface below
 *   3. Swap the `localProvider` for your CMS provider
 *
 * This keeps all content access centralized so switching
 * CMS providers requires changes in this file only.
 */

import type { Testimonial } from '@/data/testimonials';

export interface ContentProvider {
  getRegimes(): Promise<Record<string, unknown>[]>;
  getRegimeBySlug(slug: string): Promise<Record<string, unknown> | null>;
  getFAQs(): Promise<{ question: string; answer: string }[]>;
  getTestimonials(): Promise<Testimonial[]>;
}

/**
 * Local content provider — reads from data/ directory.
 * This is the default provider until a CMS is connected.
 */
class LocalContentProvider implements ContentProvider {
  async getRegimes(): Promise<Record<string, unknown>[]> {
    const { default: regimes } = await import('@/data/regimes.json');
    return regimes;
  }

  async getRegimeBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const regimes = await this.getRegimes();
    return regimes.find((r) => r.id === slug) ?? null;
  }

  async getFAQs(): Promise<{ question: string; answer: string }[]> {
    const { faqs } = await import('@/data/faq');
    return faqs;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    const { getTestimonialsForPage } = await import('@/data/testimonials');
    return getTestimonialsForPage('home');
  }
}

// Export the active provider — swap this when connecting a CMS
export const content: ContentProvider = new LocalContentProvider();
