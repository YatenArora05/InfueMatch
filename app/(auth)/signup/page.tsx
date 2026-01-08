"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Rocket } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';

// Component that uses useSearchParams - must be wrapped in Suspense
function SignupContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const initialRole = (roleParam === 'brand' || roleParam === 'influencer') ? roleParam : 'brand';

  return (
    <>
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl shadow-xl shadow-purple-100 mb-3">
          <Rocket className="text-white" size={20} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join the Network</h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">Choose your path and start collaborating.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl shadow-purple-100/50">
        <SignupForm initialRole={initialRole} />

        <div className="mt-5 pt-5 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-bold underline-offset-4 hover:underline">
              Sign in here
            </Link>
          </p>
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
        <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl shadow-xl shadow-purple-100 mb-3">
          <Rocket className="text-white" size={20} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join the Network</h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">Choose your path and start collaborating.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl shadow-purple-100/50">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-4 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Suspense fallback={<SignupLoading />}>
          <SignupContent />
        </Suspense>
        
        <p className="mt-4 text-center text-xs text-gray-400">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}