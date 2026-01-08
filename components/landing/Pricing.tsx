"use client";

import React from 'react';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 'Free',
    period: 'forever',
    description: 'Perfect for new creators and small brands',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-200',
    features: [
      'Profile creation',
      'Basic brand discovery',
      'Up to 5 connections/month',
      'Standard support',
      'Basic analytics'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Professional',
    icon: Rocket,
    price: '$49',
    period: '/month',
    description: 'For growing influencers and established brands',
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-300',
    features: [
      'Everything in Starter',
      'Unlimited connections',
      'Priority matching',
      'Advanced analytics',
      'Contract templates',
      'Dedicated support',
      'Payment processing'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations',
    color: 'from-violet-500 to-indigo-600',
    borderColor: 'border-violet-200',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'API access',
      'SLA guarantee',
      'Custom reporting'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-[150px] opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wide text-purple-700 bg-purple-50 rounded-full border border-purple-100">
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Plan</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative group ${
                  plan.popular ? 'md:-mt-4 md:mb-4' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative p-8 bg-white rounded-3xl border-2 ${
                    plan.popular ? plan.borderColor : 'border-gray-200'
                  } shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col ${
                    plan.popular ? 'ring-2 ring-purple-200 ring-opacity-50' : ''
                  } group-hover:scale-105`}
                >
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {plan.price === 'Free' ? (
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      ) : plan.price === 'Custom' ? (
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.price === 'Custom' ? '/contact' : '/signup'}
                    className={`block w-full py-3.5 rounded-xl font-bold text-center transition-all ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day free trial. No credit card required.{' '}
            <a href="#faq" className="text-purple-600 font-semibold hover:underline">
              See FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

