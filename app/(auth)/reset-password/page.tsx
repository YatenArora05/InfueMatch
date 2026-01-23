"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Lock, Rocket } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-sm text-gray-500">
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-4 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <Rocket className="text-white" size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a strong password you haven&apos;t used before on this site.
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                New password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 border-gray-200 focus:ring-purple-500 focus:border-transparent"
                />
                <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm new password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 border-gray-200 focus:ring-purple-500 focus:border-transparent"
                />
                <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500" size={16} />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 text-center">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.01] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


