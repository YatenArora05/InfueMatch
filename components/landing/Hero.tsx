"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0F0F0F] pt-20">
      {/* Neon Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0",
          }}
        />
        {/* Grid Glow Effect */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            filter: "blur(0.5px)",
            boxShadow: "inset 0 0 100px rgba(59,130,246,0.1)",
          }}
        />
        {/* Fade edges with radial gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(15,15,15,0.8) 70%, rgba(15,15,15,1) 100%)",
          }}
        />
      </div>

      {/* Background Gradient Blobs - Interactive */}
      <div 
        className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[500px] h-[500px] bg-[#1D4ED8]/40 rounded-full blur-[140px] opacity-70 transition-transform duration-300 z-[1]"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) translate(-12px, 48px)`
        }}
      />
      <div 
        className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[400px] h-[400px] bg-[#2563EB]/30 rounded-full blur-[120px] opacity-70 transition-transform duration-300 z-[1]"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px) translate(-96px, 96px)`
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Modern Badge */}
        <div className="inline-block px-4 py-1.5 mb-3 -mt-4 text-sm font-medium tracking-wide text-[#93C5FD] bg-[#111827] rounded-full border border-[#1D4ED8]/40 animate-fade-in">
          ✨ The #1 Platform for Creator Partnerships
        </div>
         {/* Middle Section */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#E5E7EB] mb-6 tracking-tighter leading-[1.1] transition-transform duration-300 hover:scale-105">
          Match. Collaborate. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]">
            Scale Your Influence.
          </span>
        </h1>
        
        {/* <p className="text-lg md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          The bridge between world-class brands and the creators who define culture. 
          Join the elite network designed for high-impact growth.
        </p> */}
        {/* Main Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/signup?role=brand" className="group relative px-7 py-3.5 bg-[#3B82F6] text-white rounded-xl font-bold text-base hover:bg-[#2563EB] transition-all shadow-xl shadow-blue-900/40 active:scale-95 overflow-hidden inline-block">
            <span className="relative z-10">I am a Brand</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>
          
          <Link href="/signup?role=influencer" className="px-7 py-3.5 bg-transparent text-[#E5E7EB] border border-[#374151] rounded-xl font-bold text-base hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all active:scale-95 shadow-sm inline-block">
            I am an Influencer
          </Link>
        </div>

        {/* Scroll Down Indicator */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block animate-bounce">
          <button
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors group"
            aria-label="Scroll down"
          >
            <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1 group-hover:border-purple-600 transition-colors">
              <ChevronDown size={16} className="animate-pulse" />
            </div>
          </button>
        </div> */}
      </div>
    </section>
  );
}