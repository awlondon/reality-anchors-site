import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProofStrip from '@/components/ProofStrip';
import VideoShowcasePlatform from '@/components/VideoShowcasePlatform';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import StickyCTA from '@/components/StickyCTA';
import Footer from '@/components/Footer';
import TestimonialBreak from '@/components/TestimonialBreak';
import FAQ from '@/components/FAQ';
import { faqStructuredData } from '@/data/faq';
import { getTestimonialsForPage } from '@/data/testimonials';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const testimonials = getTestimonialsForPage('home');

  return (
    <main id="main-content" className="snap-y">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Reality Anchors',
            url: 'https://realityanchorsltd.com',
            description: 'AI-guided execution validation for industrial fabrication teams. Reduce scrap, eliminate rework, and build traceable execution records across every workcell.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData()),
        }}
      />
      <Hero />
      <ProofStrip />
      <VideoShowcasePlatform />
      {testimonials[0] && (
        <TestimonialBreak
          id={testimonials[0].id}
          quote={testimonials[0].quote}
          attribution={testimonials[0].attribution}
          company={testimonials[0].company}
          backgroundSrc={testimonials[0].backgroundSrc}
        />
      )}
      <HowItWorks />
      <Features />
      <Metrics />
      {testimonials[1] && (
        <TestimonialBreak
          id={testimonials[1].id}
          quote={testimonials[1].quote}
          attribution={testimonials[1].attribution}
          company={testimonials[1].company}
          backgroundSrc={testimonials[1].backgroundSrc}
        />
      )}
      <Tiers />
      <FAQ />
      <LeadForm />
      <StickyCTA />
      <Footer />
    </main>
  );
}
