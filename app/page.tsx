import Hero from '@/components/Hero';
import VideoShowcase from '@/components/VideoShowcase';
import ValueBridge from '@/components/ValueBridge';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import AdaptiveNarrative from '@/components/AdaptiveNarrative';
import Tiers from '@/components/Tiers';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import TestimonialBreak from '@/components/TestimonialBreak';
import FAQ from '@/components/FAQ';
import { faqStructuredData } from '@/data/faq';
import { getRegimes } from '@/lib/getRegimes';
import { getTestimonialsForPage } from '@/data/testimonials';

export default async function Home() {
  const regimes = await getRegimes();
  const testimonials = getTestimonialsForPage('home');

  return (
    <main id="main-content" className="snap-y">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Reality Anchors Limited',
            url: 'https://ra.primarydesignco.com',
            description: 'AI-assisted operational validation for fabrication, field, and operations teams.',
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
      <VideoShowcase />
      {testimonials[0] && (
        <TestimonialBreak
          id={testimonials[0].id}
          quote={testimonials[0].quote}
          attribution={testimonials[0].attribution}
          company={testimonials[0].company}
          backgroundSrc={testimonials[0].backgroundSrc}
        />
      )}
      <ValueBridge />
      <HowItWorks />
      <Features />
      <AdaptiveNarrative initialRegimes={regimes} />
      {testimonials[1] && (
        <TestimonialBreak
          id={testimonials[1].id}
          quote={testimonials[1].quote}
          attribution={testimonials[1].attribution}
          company={testimonials[1].company}
          backgroundSrc={testimonials[1].backgroundSrc}
        />
      )}
      <Metrics />
      <Tiers />
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
      <Footer />
    </main>
  );
}
