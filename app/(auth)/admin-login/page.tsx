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

