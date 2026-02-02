"use client";

import { CheckCircle, Zap, Shield, BarChart, Sparkles } from 'lucide-react';

const brandFeatures = ["AI Influencer Discovery", "Campaign ROI Tracking", "Contract Management"];
const influencerFeatures = ["Exclusive Brand Deals", "Media Kit Builder", "Automated Invoicing"];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 bg-[#050816] relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E3A8A]/40 rounded-full blur-[120px] opacity-60 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B82F6]/30 rounded-full blur-[120px] opacity-60 translate-x-1/2 translate-y-1/2" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wide text-[#93C5FD] bg-[#020617] rounded-full border border-[#1E3A8A]/60">
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#E5E7EB] mb-4 tracking-tight">
            Everything You Need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Built for brands and creators who demand excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Brands */}
          <div className="group p-8 bg-[#020617] rounded-3xl shadow-sm border border-[#1F2937] hover:border-[#3B82F6]/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-blue-900/40">
              <BarChart size={26} className="landing-icon-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#E5E7EB]">
              For Brands
            </h3>
            <p className="text-[#9CA3AF] mb-6 leading-relaxed">
              Find the perfect voice for your brand using our data-driven
              matching engine.
            </p>
            <ul className="space-y-3">
              {brandFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-[#D1D5DB] group/item"
                >
                  <CheckCircle
                    className="text-[#3B82F6] flex-shrink-0 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Influencers */}
          <div className="group p-8 bg-[#020617] rounded-3xl shadow-sm border border-[#1F2937] hover:border-[#3B82F6]/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-blue-900/40">
              <Zap size={26} className="landing-icon-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#E5E7EB]">
              For Influencers
            </h3>
            <p className="text-[#9CA3AF] mb-6 leading-relaxed">
              Monetize your reach and partner with brands that align with your
              values.
            </p>
            <ul className="space-y-3">
              {influencerFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-[#D1D5DB] group/item"
                >
                  <CheckCircle
                    className="text-[#3B82F6] flex-shrink-0 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}