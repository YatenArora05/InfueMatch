"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LoginForm from '@/components/auth/loginForm';

export default function LoginPage() {
  return (
    <div className="auth-form-page min-h-screen bg-[#020617] text-[#E5E7EB] flex flex-col justify-center pt-24 pb-4 px-6 lg:px-8 relative overflow-hidden">
      <Navbar />
      {/* Neon Grid Background - duller resolution */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.3) 1px, transparent 1px)
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
              linear-gradient(to right, rgba(59,130,246,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            filter: "blur(0.5px)",
            boxShadow: "inset 0 0 100px rgba(59,130,246,0.06)",
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
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-[#1E3A8A]/45 rounded-full blur-[120px] opacity-80 -z-10" />
      <div className="absolute bottom-[-160px] right-[-40px] w-[480px] h-[480px] bg-[#3B82F6]/35 rounded-full blur-[140px] opacity-80 -z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Rocket className="text-white" size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-[#E5E7EB] tracking-tight">Welcome Back</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Sign in to manage your partnerships</p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-[#020617]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20">
          <LoginForm />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#1F2937]"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#020617] px-2 text-[#9CA3AF]">Or continue with</span></div>
          </div>

          {/* Google Sign In */}
          <button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#1F2937] rounded-xl hover:bg-[#0B1120] transition-all active:scale-95 font-medium text-[#E5E7EB] text-sm bg-[#020617]"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          <p className="mt-5 text-center text-sm text-[#9CA3AF]">
            New here? <Link href="/signup" className="font-bold text-[#3B82F6] hover:text-[#60A5FA]">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}