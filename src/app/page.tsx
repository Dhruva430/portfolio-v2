import MainSequence from "@/components/MainSequence";
import WorksSection from "@/components/WorksSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FooterLore from "@/components/FooterLore";
import ScrollToTop from "@/components/ScrollToTop";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-neutral-100 selection:bg-red-900 selection:text-white overflow-x-hidden">
      <MainSequence />
      <ServicesSection />
      <WorksSection />
      <ContactSection />
      <FooterLore />
      <Footer />
      <ScrollToTop />
    </main>
  );
}