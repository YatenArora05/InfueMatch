"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LoginForm() {
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

  // Validation functions
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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    // Clear submit error
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
      const response = await axios.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store user ID in localStorage for fetching user data later
      if (response.data.user?.id) {
        localStorage.setItem('userId', response.data.user.id);
      }

      // Redirect based on role
      if (response.data.user.role === 'influencer') {
        router.push('/dashboard/influencer');
      } else if (response.data.user.role === 'brand') {
        // Send brands to profile setup first
        router.push('/dashboard/brand/profile');
      } else {
        setSubmitError('Invalid user role');
        setIsLoading(false);
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5">Email Address</label>
        <div className="relative group">
          <input
            type="email"
            className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
              errors.email
                ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                : 'border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50'
            }`}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Mail className={`absolute left-3 top-3 transition-colors ${errors.email ? 'text-red-400' : 'text-[#6B7280] group-focus-within:text-[#3B82F6]'}`} size={16} />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-400 px-1">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-semibold text-[#E5E7EB] mb-1.5">Password</label>
        <div className="relative group">
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border rounded-xl focus:ring-2 focus:bg-[#111827] transition-all outline-none text-sm placeholder:text-[#6B7280] ${
              errors.password
                ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                : 'border-[#1F2937] focus:ring-[#3B82F6] focus:border-[#3B82F6]/50'
            }`}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <Lock className={`absolute left-3 top-3 transition-colors ${errors.password ? 'text-red-400' : 'text-[#6B7280] group-focus-within:text-[#3B82F6]'}`} size={16} />
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-400 px-1">{errors.password}</p>}
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA]"
        >
          Forgot password?
        </button>
      </div>

      {submitError && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-400 text-center">{submitError}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full py-3 text-base"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

