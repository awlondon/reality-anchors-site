import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProofStrip from '@/components/ProofStrip';
import VideoShowcasePlatform from '@/components/VideoShowcasePlatform';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import ValueBridge from '@/components/ValueBridge';
import CaptureLoop from '@/components/CaptureLoop';
import Tiers from '@/components/Tiers';
import FeatureMatrix from '@/components/FeatureMatrix';
import LeadForm from '@/components/LeadForm';
import StickyCTA from '@/components/StickyCTA';
import Footer from '@/components/Footer';
import PhotoDivider from '@/components/PhotoDivider';
import FAQ from '@/components/FAQ';
import { faqStructuredData } from '@/data/faq';
import { getDividersForPage } from '@/data/photoDividers';

export const metadata: Metadata = {
  title: 'Fabrication Execution Software for Rebar and Industrial Workcells',
  description:
    'Reality Anchors is fabrication execution software for rebar and industrial workcells. Guides operators, validates work before irreversible actions, and records every outcome.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Reality Anchors | Fabrication Capture Software',
    description:
      'Execution guidance and validation for fabrication teams. Validates work before irreversible actions and records every outcome.',
  },
};

export default async function Home() {
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
            description:
              'Execution guidance and validation for steel fabrication. Customer-supplied hardware, operator-confirmed steps, and measurable results that improve with every run.',
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
      <ValueBridge />
      <Metrics />
      <CaptureLoop />
      <Tiers />
      <FeatureMatrix />
      <FAQ />
      <LeadForm />
      <StickyCTA />
      <Footer />
    </main>
  );
}
