import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProofStrip from '@/components/ProofStrip';
import VideoShowcasePlatform from '@/components/VideoShowcasePlatform';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import Tiers from '@/components/Tiers';
import FeatureMatrix from '@/components/FeatureMatrix';
import LeadForm from '@/components/LeadForm';
import StickyCTA from '@/components/StickyCTA';
import Footer from '@/components/Footer';
// TODO: Re-enable with real testimonials
// import TestimonialBreak from '@/components/TestimonialBreak';
import PhotoDivider from '@/components/PhotoDivider';
import FAQ from '@/components/FAQ';
import { faqStructuredData } from '@/data/faq';
import { getDividersForPage } from '@/data/photoDividers';
// import { getTestimonialsForPage } from '@/data/testimonials';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  // const testimonials = getTestimonialsForPage('home');
  const dividers = getDividersForPage('home');

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
      {dividers[0] && <PhotoDivider {...dividers[0]} />}
      <HowItWorks />
      <Features />
      <Metrics />
      {dividers[1] && <PhotoDivider {...dividers[1]} />}
      <Tiers />
      <FeatureMatrix />
      {testimonials[3] && (
        <TestimonialBreak
          id={testimonials[3].id}
          quote={testimonials[3].quote}
          attribution={testimonials[3].attribution}
          company={testimonials[3].company}
          backgroundSrc={testimonials[3].backgroundSrc}
        />
      )}
      <FAQ />
      <LeadForm />
      <StickyCTA />
      <Footer />
    </main>
  );
}
