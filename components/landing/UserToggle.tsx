"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Users, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../ui/Button';

export default function UserToggle() {
  const [activeTab, setActiveTab] = useState<'brand' | 'influencer'>('brand');

  return (
    <section className="py-16 flex flex-col items-center relative overflow-hidden bg-black">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-black rounded-full blur-[140px] opacity-70 z-[1]" />
      <div className="absolute -bottom-24 right-0 w-[520px] h-[520px] bg-black rounded-full blur-[140px] opacity-70 z-[1]" />
      
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="bg-[#020617] p-1 rounded-2xl flex gap-1 mb-12 border border-[#1F2937] max-w-md mx-auto shadow-sm">
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1 ${
              activeTab === 'brand' 
                ? 'bg-[#0B1220] shadow-md text-[#E5E7EB] scale-105 border border-[#3B82F6]/40' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/5'
            }`}
          >
            <Briefcase size={20} className={activeTab === 'brand' ? 'scale-110 transition-transform text-[#3B82F6]' : ''} /> For Brands
          </button>
          <button
            onClick={() => setActiveTab('influencer')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1 ${
              activeTab === 'influencer' 
                ? 'bg-[#0B1220] shadow-md text-[#E5E7EB] scale-105 border border-[#3B82F6]/40' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/5'
            }`}
          >
            <Users size={20} className={activeTab === 'influencer' ? 'scale-110 transition-transform text-[#3B82F6]' : ''} /> For Influencers
          </button>
        </div>

        <div className="w-full p-8 md:p-12 rounded-3xl bg-[#020617] border border-[#1F2937] shadow-xl text-center hover:shadow-2xl transition-all duration-300 group">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#E5E7EB] leading-tight">
              {activeTab === 'brand' 
                ? "Scale your brand with data-backed creators" 
                : "Turn your audience into a business"}
            </h3>
            <p className="text-[#9CA3AF] max-w-xl mx-auto mb-8 text-base md:text-lg leading-relaxed ">
              {activeTab === 'brand' 
                ? "Access a database of 50k+ influencers with detailed engagement metrics and verified conversion data." 
                : "Connect with premium brands, manage your contracts, and get paid instantly for your content."}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/signup"
                className="group/btn inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-900/40 hover:shadow-xl hover:scale-105 active:scale-95"
              > <center className="flex justify-center items-center">
                Get started
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </center>
              </Link>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}