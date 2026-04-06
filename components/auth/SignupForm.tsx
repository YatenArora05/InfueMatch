"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, User } from "lucide-react";
import Button from "@/components/ui/Button";

const DEFAULT_SIGNUP_ROLE = "influencer" as const;

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    if (field === "password" && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      } else {
        setErrors({ ...errors, confirmPassword: "" });
      }
    }
    if (field === "confirmPassword") {
      if (value !== formData.password) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      } else {
        setErrors({ ...errors, confirmPassword: "" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: DEFAULT_SIGNUP_ROLE,
      });

      if (response.data.user?.id) {
        localStorage.setItem("userId", response.data.user.id);
      }

      router.push("/dashboard/influencer");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setSubmitError(err.response?.data?.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5 px-1">Full Name</label>
          <div className="relative group">
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
                errors.name
                  ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                  : "border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50"
              }`}
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <User
              className={`absolute left-3 top-3 transition-colors ${errors.name ? "text-red-400" : "text-[#6B7280] group-focus-within:text-[#3B82F6]"}`}
              size={16}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-400 px-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5 px-1">Email Address</label>
          <div className="relative group">
            <input
              type="email"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
                errors.email
                  ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                  : "border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50"
              }`}
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              placeholder="e.g. alex@creator.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Mail
              className={`absolute left-3 top-3 transition-colors ${errors.email ? "text-red-400" : "text-[#6B7280] group-focus-within:text-[#3B82F6]"}`}
              size={16}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400 px-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5 px-1">Create Password</label>
          <div className="relative group">
            <input
              type="password"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
                errors.password
                  ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                  : "border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50"
              }`}
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              placeholder="Min. 8 characters with special char"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Lock
              className={`absolute left-3 top-3 transition-colors ${errors.password ? "text-red-400" : "text-[#6B7280] group-focus-within:text-[#3B82F6]"}`}
              size={16}
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400 px-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5 px-1">Confirm Password</label>
          <div className="relative group">
            <input
              type="password"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
                errors.confirmPassword
                  ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                  : "border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50"
              }`}
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
            <ShieldCheck
              className={`absolute left-3 top-3 transition-colors ${errors.confirmPassword ? "text-red-400" : "text-[#6B7280] group-focus-within:text-[#3B82F6]"}`}
              size={16}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400 px-1">{errors.confirmPassword}</p>
          )}
        </div>

        {submitError && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400 text-center">{submitError}</p>
          </div>
        )}

        <Button type="submit" className="w-full py-3 text-base mt-3 group" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
          {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
        </Button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#1F2937]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#020617] px-2 text-[#9CA3AF]">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard/influencer" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#1F2937] rounded-xl hover:bg-[#0B1120] transition-all active:scale-95 font-medium text-[#E5E7EB] text-sm bg-[#020617]"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
          Sign up with Google
        </button>
      </motion.div>
    </form>
  );
}
