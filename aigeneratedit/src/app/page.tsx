import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import FeatureGrid from "@/components/FeatureGrid";
import TrustBar from "@/components/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import ComparisonTable from "@/components/ComparisonTable";
import UseCaseTabs from "@/components/UseCaseTabs";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#F5F5F7" }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <TrustBar />
      <HowItWorks />
      <ComparisonTable />
      <UseCaseTabs />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  );
}
