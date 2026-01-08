"use client";

import { CheckCircle, Zap, Shield, BarChart, Sparkles } from 'lucide-react';

const brandFeatures = ["AI Influencer Discovery", "Campaign ROI Tracking", "Contract Management"];
const influencerFeatures = ["Exclusive Brand Deals", "Media Kit Builder", "Automated Invoicing"];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-40 translate-x-1/2 translate-y-1/2" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wide text-purple-700 bg-purple-50 rounded-full border border-purple-100">
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Everything You Need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Succeed</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for brands and creators who demand excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Brands */}
          <div className="group p-8 bg-white rounded-3xl shadow-sm border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-purple-200">
              <BarChart size={26} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Brands</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Find the perfect voice for your brand using our data-driven matching engine.</p>
            <ul className="space-y-3">
              {brandFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700 group/item">
                  <CheckCircle className="text-purple-500 flex-shrink-0 group-hover/item:scale-110 transition-transform" size={20} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Influencers */}
          <div className="group p-8 bg-white rounded-3xl shadow-sm border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-200">
              <Zap size={26} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Influencers</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Monetize your reach and partner with brands that align with your values.</p>
            <ul className="space-y-3">
              {influencerFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700 group/item">
                  <CheckCircle className="text-indigo-500 flex-shrink-0 group-hover/item:scale-110 transition-transform" size={20} />
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