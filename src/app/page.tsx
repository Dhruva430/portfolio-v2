import MainSequence from "@/components/MainSequence";
import WorksSection from "@/components/WorksSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FooterLore from "@/components/FooterLore";
import ScrollToTop from "@/components/ScrollToTop";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-neutral-100 selection:bg-red-900 selection:text-white overflow-x-hidden">
      <MainSequence />
      <WorksSection />
      <TestimonialsSection />
      <CTASection />
      <FooterLore />
      <Footer />
      <ScrollToTop />
    </main>
  );
}