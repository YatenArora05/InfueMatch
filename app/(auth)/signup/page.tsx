"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Rocket, Briefcase, Users } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';

// Component that uses useSearchParams - must be wrapped in Suspense
function SignupContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const initialRole = (roleParam === 'brand' || roleParam === 'influencer') ? roleParam : 'brand';

  const [role, setRole] = useState<'brand' | 'influencer'>(initialRole);

  return (
    <>
      <div className="bg-[#020617]/90 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20 w-full max-w-7xl mx-auto relative overflow-hidden">
        {/* Decorative Image - Bottom Left Corner Only (hidden on small screens) */}
        <div className="hidden md:block absolute bottom-0 left-8 w-full h-[70%] pointer-events-none z-0 opacity-25 sm:opacity-30 md:opacity-35">
          <Image
            src="/Sign up cover Image.png"
            alt="Sign up cover"
            fill
            className="object-contain object-left-bottom"
            // sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
            quality={95}
            priority={false}
          />
        </div>
        
        <div className="grid gap-6 sm:gap-8 lg:gap-10 md:grid-cols-2 items-start relative z-10">
          {/* Left: Heading + Role Toggle */}
          <div className="space-y-4 sm:space-y-6 text-left">
            <div className="mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#3B82F6] rounded-xl shadow-xl shadow-blue-900/40 mb-3">
                <Rocket className="text-white" size={20} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E5E7EB] tracking-tight">Join the Network</h2>
              <p className="mt-1 text-xs sm:text-sm text-[#9CA3AF] font-medium">
                Choose your path and start collaborating.
              </p>
            </div>

            {/* Role Selection Toggle (left side) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setRole('brand')}
                className={`relative flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all ${
                  role === 'brand'
                    ? 'border-[#3B82F6] bg-[#0B1220] ring-2 ring-[#3B82F6]/30'
                    : 'border-[#1F2937] bg-[#0B1120] hover:border-[#3B82F6]/50'
                }`}
              >
                <Briefcase
                  className={`${role === 'brand' ? 'text-[#3B82F6]' : 'text-[#6B7280]'} w-4 h-4 sm:w-5 sm:h-5`}
                  size={18}
                />
                <span
                  className={`font-bold text-xs sm:text-sm ${
                    role === 'brand' ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'
                  }`}
                >
                  Brand
                </span>
                {role === 'brand' && (
                  <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#3B82F6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole('influencer')}
                className={`relative flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all ${
                  role === 'influencer'
                    ? 'border-[#3B82F6] bg-[#0B1220] ring-2 ring-[#3B82F6]/30'
                    : 'border-[#1F2937] bg-[#0B1120] hover:border-[#3B82F6]/50'
                }`}
              >
                <Users
                                  className={`${role === 'influencer' ? 'text-[#3B82F6]' : 'text-[#6B7280]'} w-4 h-4 sm:w-5 sm:h-5`}
                  size={18}
                />
                <span
                  className={`font-bold text-xs sm:text-sm ${
                    role === 'influencer' ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'
                  }`}
                >
                  Influencer
                </span>
                {role === 'influencer' && (
                  <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#3B82F6] rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Animated Form */}
          <div className="w-full min-w-0">
            <SignupForm role={role} />

            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-[#1F2937] text-center">
              <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-[#3B82F6] hover:text-[#60A5FA] font-bold underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Loading fallback for Suspense
function SignupLoading() {
  return (
    <>
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-[#3B82F6] rounded-xl shadow-xl shadow-blue-900/40 mb-3">
          <Rocket className="text-white" size={20} />
        </div>
        <h2 className="text-3xl font-extrabold text-[#E5E7EB] tracking-tight">Join the Network</h2>
        <p className="mt-1 text-sm text-[#9CA3AF] font-medium">Choose your path and start collaborating.</p>
      </div>

      <div className="bg-[#020617]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-[#1F2937] rounded-xl"></div>
          <div className="h-12 bg-[#1F2937] rounded-xl"></div>
          <div className="h-12 bg-[#1F2937] rounded-xl"></div>
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <div className="auth-form-page min-h-screen bg-[#020617] text-[#E5E7EB] flex flex-col justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Neon Grid Background - enhanced visibility */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.6) 1px, transparent 1px)
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
              linear-gradient(to right, rgba(59,130,246,0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            filter: "blur(0.5px)",
            boxShadow: "inset 0 0 120px rgba(59,130,246,0.15)",
          }}
        />
        {/* Fade edges with radial gradient - blue tinted */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.8) 70%, rgba(2,6,23,1) 100%)",
          }}
        />
      </div>
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-140px] right-[-60px] w-[520px] h-[520px] bg-[#1E3A8A]/45 rounded-full blur-[130px] opacity-80 -z-10" />
      <div className="absolute bottom-[-160px] left-[-40px] w-[460px] h-[460px] bg-[#3B82F6]/35 rounded-full blur-[140px] opacity-80 -z-10" />
      
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<SignupLoading />}>
          <SignupContent />
        </Suspense>
        
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[#6B7280] px-4">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}