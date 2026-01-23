"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Rocket } from "lucide-react";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-sm text-gray-500">
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-4 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <Rocket className="text-white" size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Enter verification code
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          We&apos;ve sent a 4-digit code to <span className="font-semibold text-gray-900">{email}</span>.
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                4-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="••••"
                className="tracking-[0.5em] text-center text-lg font-semibold w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-gray-900 border-gray-200 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.01] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify code"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              Change email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


