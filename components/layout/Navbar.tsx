"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
      ? 'top-4 px-4' 
      : 'top-0 px-0'
    }`}>
      <div className={`mx-auto max-w-7xl transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg rounded-2xl border border-white/20 py-3' 
        : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Rocket className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Influe<span className="text-purple-600">Match</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="#features" 
              onClick={(e) => handleAnchorClick(e, '#features')}
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="#how-it-works" 
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors relative group"
            >
              How it Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="#pricing" 
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Auth Buttons */}
          
          <div className="hidden md:flex items-center gap-4">
            
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors cursor-pointer">
              Login
            </Link>
            <Link href="/signup" className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 hover:shadow-md transition-all active:scale-95 cursor-pointer">
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 p-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col gap-4">
              <Link 
                href="#features" 
                onClick={(e) => handleAnchorClick(e, '#features')}
                className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors"
              >
                How it Works
              </Link>
              <Link 
                href="#pricing" 
                onClick={(e) => handleAnchorClick(e, '#pricing')}
                className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors"
              >
                Pricing
              </Link>
              <hr className="my-2" />
              <Link href="/login" className="w-full py-3 text-center font-semibold text-gray-700 hover:text-purple-600 transition-colors">Login</Link>
              <Link href="/signup" className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold text-center hover:bg-purple-700 transition-colors">Join Now</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}