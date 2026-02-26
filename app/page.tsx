import HeroWebGL from "@/components/HeroWebGL";
import Logos from "@/components/Logos";
import Features from "@/components/Features";
import Metrics from "@/components/Metrics";
import CaseStudies from "@/components/CaseStudies";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroWebGL />
      <Logos />
      <Features />
      <Metrics />
      <CaseStudies />
      <LeadForm />
      <Footer />
    </>
  );
}
