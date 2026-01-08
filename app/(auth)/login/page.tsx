"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import LoginForm from '@/components/auth/loginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-4 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <Rocket className="text-white" size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="mt-1 text-sm text-gray-500">Sign in to manage your partnerships</p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl">
          <LoginForm />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
          </div>

          {/* Google Sign In */}
          <button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-medium text-gray-700 text-sm"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            New here? <Link href="/signup" className="font-bold text-purple-600 hover:text-purple-700">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}