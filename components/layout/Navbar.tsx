"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll: single .navbar--scrolled class drives height, padding, logo, Login visibility, background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = isScrolled;

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle anchor links on the landing page
    if (pathname !== '/') {
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      
      if (element) {
        const offset = 100; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-[padding,top] duration-300 ease-in-out ${
        scrolled ? 'navbar--scrolled top-3 px-4' : 'top-0 px-0'
      }`}
      data-scrolled={scrolled ? 'true' : undefined}
    >
      <div
        className={`mx-auto transition-[background-color,border-color,border-radius,max-width,padding,box-shadow] duration-300 ease-in-out ${
          scrolled
            ? 'max-w-5xl rounded-2xl border border-[#1F2937] bg-[#020617]/85 shadow-lg backdrop-blur-md py-3'
            : 'max-w-7xl rounded-none border-transparent bg-transparent py-7'
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-[padding] duration-300 ease-in-out ${
            scrolled ? 'px-5' : 'px-6'
          }`}
        >
          
          {/* Logo — scales down when scrolled */}
          <Link
            href="/"
            className={`flex items-center gap-2 group transition-all duration-300 ease-in-out ${
              scrolled ? 'gap-1.5' : 'gap-2'
            }`}
          >
            <div
              className={`bg-[#3B82F6] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300 ease-in-out ${
                scrolled ? 'w-8 h-8' : 'w-11 h-11'
              }`}
            >
              <Rocket
                className="text-white navbar-logo-icon"
                size={scrolled ? 18 : 22}
              />
            </div>
            <span
              className={`font-bold tracking-tight text-[#E5E7EB] transition-all duration-300 ease-in-out ${
                scrolled ? 'text-lg' : 'text-xl'
              }`}
            >
              Influe<span className="text-[#3B82F6]">Match</span>
            </span>
          </Link>

          {/* Desktop Navigation — spacing tightens when scrolled */}
          <div
            className={`hidden md:flex items-center transition-[gap] duration-300 ease-in-out ${
              scrolled ? 'gap-5' : 'gap-8'
            }`}
          >
            <Link 
              href="#features" 
              onClick={(e) => handleAnchorClick(e, '#features')}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3B82F6] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="#how-it-works" 
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors relative group"
            >
              How it Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3B82F6] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="#pricing" 
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3B82F6] group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Auth: Login fades + slides upward on scroll (opacity + transform only); Register re-centers naturally */}
          <div className="hidden md:flex items-center justify-end gap-4 min-w-0">
            <div
              className={`overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out ${
                scrolled ? 'max-w-0 opacity-0' : 'max-w-18 opacity-100'
              }`}
            >
              <Link
                href="/login"
                className={`inline-block text-sm font-semibold text-[#E5E7EB] hover:text-[#3B82F6] cursor-pointer whitespace-nowrap transition-[opacity,transform] duration-300 ease-in-out ${
                  scrolled
                    ? 'translate-y-[-6px] opacity-0 pointer-events-none select-none'
                    : 'translate-y-0 opacity-100'
                }`}
              >
                Login
              </Link>
            </div>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-[#3B82F6] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] hover:shadow-md transition-[color,background-color,box-shadow,transform] duration-300 ease-in-out active:scale-[0.98] cursor-pointer shrink-0"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-[#E5E7EB]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 p-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-[#020617] rounded-2xl shadow-xl border border-[#1F2937] p-6 flex flex-col gap-4">
              <Link 
                href="#features" 
                onClick={(e) => handleAnchorClick(e, '#features')}
                className="text-lg font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                className="text-lg font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-colors"
              >
                How it Works
              </Link>
              <Link 
                href="#pricing" 
                onClick={(e) => handleAnchorClick(e, '#pricing')}
                className="text-lg font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-colors"
              >
                Pricing
              </Link>
              <hr className="my-2 border-[#1F2937]" />
              <Link href="/login" className="w-full py-3 text-center font-semibold text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Login</Link>
              <Link href="/signup" className="w-full py-3 bg-[#3B82F6] text-white rounded-xl font-semibold text-center hover:bg-[#1D4ED8] transition-colors">Join Now</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}