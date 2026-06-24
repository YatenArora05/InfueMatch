"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Lock, Rocket } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-sm text-[#9CA3AF]">
          Loading reset password...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !otp) {
      router.replace("/forgot-password");
    }
  }, [email, otp, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password should be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      setMessage(res.data?.message || "Password reset successful.");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while resetting your password."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          Choose a strong password you haven&apos;t used before on this site.
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-[#020617]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#9CA3AF] mb-1.5">
                New password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent focus:bg-[#0B1120] transition-all outline-none text-sm text-[#E5E7EB] placeholder-[#4B5563]"
                />
                <Lock
                  className="absolute left-3 top-3 text-[#4B5563] group-focus-within:text-[#3B82F6] transition-colors"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#9CA3AF] mb-1.5">
                Confirm new password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent focus:bg-[#0B1120] transition-all outline-none text-sm text-[#E5E7EB] placeholder-[#4B5563]"
                />
                <Lock
                  className="absolute left-3 top-3 text-[#4B5563] group-focus-within:text-[#3B82F6] transition-colors"
                  size={16}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-900/30 border border-green-700/50 rounded-xl">
                <p className="text-sm text-green-400 text-center">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-semibold shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.01] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
