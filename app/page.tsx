import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import UserToggle from '@/components/landing/UserToggle';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen selection:bg-purple-200 overflow-x-hidden">
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