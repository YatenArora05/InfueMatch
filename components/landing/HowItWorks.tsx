"use client";

import React from 'react';
import { Search, Handshake, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover & Match',
    description: 'AI-powered platform matches brands with influencers based on niche, audience, and engagement metrics.',
    color: 'bg-purple-600',
    delay: '0'
  },
  {
    icon: Handshake,
    title: 'Connect & Collaborate',
    description: 'Direct messaging, contract management, and secure payments all in one streamlined workflow.',
    color: 'bg-indigo-600',
    delay: '100'
  },
  {
    icon: TrendingUp,
    title: 'Scale & Succeed',
    description: 'Track performance, analyze ROI, and build long-term partnerships that drive real results.',
    color: 'bg-violet-600',
    delay: '200'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] opacity-50 translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wide text-purple-700 bg-purple-50 rounded-full border border-purple-100">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your brand partnerships or creator career
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="group relative"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 h-full group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>

                  {/* Arrow - hidden on mobile, visible on hover */}
                  <div className="hidden md:flex items-center gap-2 text-purple-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
            <div className="text-left">
              <h3 className="font-bold text-gray-900 mb-1">Ready to get started?</h3>
              <p className="text-sm text-gray-600">Join thousands of brands and creators already on the platform</p>
            </div>
            <a
              href="/signup"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Start Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

