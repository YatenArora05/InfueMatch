"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/admin/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem('adminId', response.data.adminId);
        router.push('/dashboard/admin/brands');
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-page min-h-screen flex flex-col items-center justify-center bg-[#020617] text-[#E5E7EB] px-4 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0 1000px #0B1120 inset !important;
          box-shadow: 0 0 0 1000px #0B1120 inset !important;
        }

        .grid-light-overlay {
          --pulse-size: 140px;
          --line-thickness: 2px;
          --pulse-duration-x: 7.5s;
          --pulse-duration-y: 9s;
          position: absolute;
          inset: 0;
          overflow: hidden;
          mix-blend-mode: screen;
          opacity: 0.9;
        }

        .grid-light-overlay::before,
        .grid-light-overlay::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          background: radial-gradient(circle, rgba(34, 211, 238, 0.95) 0%, rgba(59, 130, 246, 0.62) 45%, rgba(14, 165, 233, 0.25) 70%, rgba(14, 165, 233, 0) 100%);
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-fill-mode: both;
        }

        .grid-light-overlay::before {
          width: var(--pulse-size);
          height: var(--line-thickness);
          left: calc(var(--pulse-size) * -1);
          top: calc(22% - (var(--line-thickness) / 2));
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.65), 0 0 48px rgba(59, 130, 246, 0.35);
          animation-name: travel-x, pulse-flicker;
          animation-duration: var(--pulse-duration-x), 1.8s;
          animation-delay: 0s, 0.1s;
        }

        .grid-light-overlay::after {
          width: var(--line-thickness);
          height: var(--pulse-size);
          top: calc(var(--pulse-size) * -1);
          left: calc(74% - (var(--line-thickness) / 2));
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.6), 0 0 48px rgba(56, 189, 248, 0.32);
          animation-name: travel-y, pulse-flicker;
          animation-duration: var(--pulse-duration-y), 2.3s;
          animation-delay: 1.2s, 0.4s;
        }

        .grid-light-overlay .pulse-line-x,
        .grid-light-overlay .pulse-line-y {
          position: absolute;
          border-radius: 999px;
          filter: blur(9px);
          background: linear-gradient(90deg, rgba(14, 165, 233, 0), rgba(34, 211, 238, 0.9), rgba(59, 130, 246, 0.3), rgba(14, 165, 233, 0));
          opacity: 0.82;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .grid-light-overlay .pulse-line-x {
          width: 180px;
          height: 1.5px;
          left: -180px;
          top: calc(68% - 1px);
          animation-name: travel-x-delayed, pulse-flicker;
          animation-duration: 10s, 2.6s;
          animation-delay: 0.8s, 0s;
        }

        .grid-light-overlay .pulse-line-y {
          width: 1.5px;
          height: 180px;
          top: -180px;
          left: calc(30% - 1px);
          animation-name: travel-y-delayed, pulse-flicker;
          animation-duration: 11.5s, 2.1s;
          animation-delay: 2.4s, 0.2s;
        }

        @keyframes travel-x {
          0%, 12% { transform: translate3d(0, 0, 0); opacity: 0; }
          20% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translate3d(calc(100vw + var(--pulse-size)), 0, 0); opacity: 0; }
        }

        @keyframes travel-y {
          0%, 10% { transform: translate3d(0, 0, 0); opacity: 0; }
          18% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate3d(0, calc(100vh + var(--pulse-size)), 0); opacity: 0; }
        }

        @keyframes travel-x-delayed {
          0%, 16% { transform: translate3d(0, 0, 0); opacity: 0; }
          24% { opacity: 0.85; }
          78% { opacity: 0.85; }
          100% { transform: translate3d(calc(100vw + 180px), 0, 0); opacity: 0; }
        }

        @keyframes travel-y-delayed {
          0%, 14% { transform: translate3d(0, 0, 0); opacity: 0; }
          22% { opacity: 0.85; }
          80% { opacity: 0.85; }
          100% { transform: translate3d(0, calc(100vh + 180px), 0); opacity: 0; }
        }

        @keyframes pulse-flicker {
          0%, 100% { filter: blur(8px); opacity: 0.75; }
          45% { filter: blur(11px); opacity: 1; }
          70% { filter: blur(9px); opacity: 0.82; }
        }
      `}} />
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
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.8) 70%, rgba(2,6,23,1) 100%)",
          }}
        />
        <div className="grid-light-overlay">
          <span className="pulse-line-x" />
          <span className="pulse-line-y" />
        </div>
      </div>

      {/* Background Decorative Blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-[#1E3A8A]/45 rounded-full blur-[120px] opacity-80 -z-10" />
      <div className="absolute bottom-[-160px] right-[-40px] w-[480px] h-[480px] bg-[#3B82F6]/35 rounded-full blur-[140px] opacity-80 -z-10" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-3xl border border-[#1F2937] shadow-2xl shadow-blue-900/20 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3B82F6] text-white rounded-2xl mb-4 shadow-lg shadow-blue-900/40">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-[#E5E7EB] mb-2">Admin Login</h1>
            <p className="text-[#9CA3AF] text-sm">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ color: '#ffffff' }}
                  className={`w-full pl-12 pr-4 py-3 bg-[#0B1120] border border-[#1F2937] rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-sm text-white placeholder-[#9CA3AF] [&::-webkit-input-placeholder]:text-[#9CA3AF] ${
                    errors.email ? 'ring-2 ring-red-500 border-red-500/50' : ''
                  }`}
                  placeholder="admin@example.com"
                />
                <Mail className="absolute left-4 top-3.5 text-[#6B7280] w-5 h-5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 ml-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ color: '#ffffff' }}
                  className={`w-full pl-12 pr-4 py-3 bg-[#0B1120] border border-[#1F2937] rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-sm text-white placeholder-[#9CA3AF] [&::-webkit-input-placeholder]:text-[#9CA3AF] ${
                    errors.password ? 'ring-2 ring-red-500 border-red-500/50' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-3.5 text-[#6B7280] w-5 h-5" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 ml-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

