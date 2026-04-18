import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import UserToggle from '@/components/landing/UserToggle';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import ScrollReveal from '@/components/landing/ScrollReveal';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden [overflow-anchor:none] bg-black text-[#E5E7EB] selection:bg-[#3B82F6]/40 landing-icon-scope">
        <ScrollReveal y={0}>
          <Hero />
        </ScrollReveal>
        <ScrollReveal delay={0.04}>
          <UserToggle />
        </ScrollReveal>
        <ScrollReveal delay={0.06}>
          <Features />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Pricing />
        </ScrollReveal>
        <Footer />
      </main>
    </>
  );
}