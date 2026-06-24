"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Rocket } from "lucide-react";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-sm text-[#9CA3AF]">
          Loading verification...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 4) {
      setError("Please enter the 4-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/verify-otp", { email, otp });
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid or expired code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    setOtp(digitsOnly);
  };

  return (
    <div className="auth-form-page min-h-screen bg-[#020617] text-[#E5E7EB] flex flex-col justify-center py-4 px-6 lg:px-8 relative overflow-hidden">
      {/* Neon Grid Background */}
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
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.8) 70%, rgba(2,6,23,1) 100%)",
          }}
        />
      </div>

      {/* Background Blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-[#1E3A8A]/45 rounded-full blur-[120px] opacity-80 -z-10" />
      <div className="absolute bottom-[-160px] right-[-40px] w-[480px] h-[480px] bg-[#3B82F6]/35 rounded-full blur-[140px] opacity-80 -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <button onClick={() => router.push("/")}>
              <Rocket className="text-white cursor-pointer" size={20} />
            </button>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-[#E5E7EB] tracking-tight">
          Enter verification code
        </h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          We&apos;ve sent a 4-digit code to{" "}
          <span className="font-semibold text-[#E5E7EB]">{email}</span>.
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-[#020617]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#9CA3AF] mb-1.5">
                4-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="••••"
                className="tracking-[0.5em] text-center text-lg font-semibold w-full px-4 py-3 bg-[#0B1120] border border-[#1F2937] rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all outline-none text-[#E5E7EB] placeholder-[#4B5563]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-semibold shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.01] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify code"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="w-full py-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
            >
              Change email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
