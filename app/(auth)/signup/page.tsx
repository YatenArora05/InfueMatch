"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Rocket } from "lucide-react";
import SignupForm from "@/components/auth/SignupForm";
import { useRouter } from "next/navigation";

function SignupHero() {
  const router = useRouter();

  return (
    <div className="bg-[#020617]/90 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20 w-full max-w-7xl mx-auto relative overflow-hidden mt-[-60px]">
      <div className="hidden md:block absolute bottom-0 left-8 w-full h-[70%] pointer-events-none z-0 opacity-25 sm:opacity-30 md:opacity-35">
        <Image
          src="/Sign up cover Image.png"
          alt="Sign up cover"
          fill
          className="object-contain object-left-bottom"
          quality={95}
          priority={false}
        />
      </div>

      <div className="grid gap-6 sm:gap-8 lg:gap-10 md:grid-cols-2 items-start relative z-10">
        <div className="space-y-4 sm:space-y-6 text-left">
          <div className="mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#3B82F6] rounded-xl shadow-xl shadow-blue-900/40 mb-3">
              <button type="button" onClick={() => router.push("/")} aria-label="Home">
                <Rocket className="text-white cursor-pointer" size={20} />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E5E7EB] tracking-tight">
              Join the Network
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#9CA3AF] font-medium">
              Create your account to connect with brands and grow your influence. You can request a brand account later
              through our team.
            </p>
          </div>
        </div>

        <div className="w-full min-w-0">
          <SignupForm />

          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-[#1F2937] text-center">
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">
              Already have an account?{" "}
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
  );
}

export default function SignupPage() {
  return (
    <div className="auth-form-page min-h-screen bg-[#020617] text-[#E5E7EB] flex flex-col justify-center pt-24 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.8) 70%, rgba(2,6,23,1) 100%)",
          }}
        />
      </div>

      <div className="absolute top-[-140px] right-[-60px] w-[520px] h-[520px] bg-[#1E3A8A]/45 rounded-full blur-[130px] opacity-80 -z-10" />
      <div className="absolute bottom-[-160px] left-[-40px] w-[460px] h-[460px] bg-[#3B82F6]/35 rounded-full blur-[140px] opacity-80 -z-10" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <SignupHero />
      </div>
    </div>
  );
}
