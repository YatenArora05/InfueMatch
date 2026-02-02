import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import UserToggle from '@/components/landing/UserToggle';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F0F0F] text-[#E5E7EB] selection:bg-[#3B82F6]/40 landing-icon-scope">
      <Navbar />
      <Hero />
      <UserToggle /> 
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}