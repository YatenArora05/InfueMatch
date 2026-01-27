"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { Mail, Lock, ShieldCheck, Briefcase, Users, ArrowRight, User } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SignupFormProps {
  initialRole?: 'brand' | 'influencer';
}

export default function SignupForm({ initialRole = 'brand' }: SignupFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<'brand' | 'influencer'>(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain at least one special character
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasMinLength && hasSpecialChar;
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    // Real-time validation for confirm password
    if (field === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      } else {
        setErrors({ ...errors, confirmPassword: '' });
      }
    }
    if (field === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      } else {
        setErrors({ ...errors, confirmPassword: '' });
      }
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
      const response = await axios.post('/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      });

      // Store user ID in localStorage for fetching user data later
      if (response.data.user?.id) {
        localStorage.setItem('userId', response.data.user.id);
      }

      // Redirect based on role
      if (role === 'influencer') {
        router.push('/dashboard/influencer');
      } else {
        // For brands, start at the profile setup page instead of the dashboard
        router.push('/dashboard/brand/profile');
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection Toggle */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => setRole('brand')}
          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
            role === 'brand' 
            ? 'border-purple-600 bg-purple-50/50 ring-4 ring-purple-100' 
            : 'border-gray-100 bg-white hover:border-purple-200'
          }`}
        >
          <Briefcase className={role === 'brand' ? 'text-purple-600' : 'text-gray-400'} size={20} />
          <span className={`font-bold text-sm ${role === 'brand' ? 'text-purple-900' : 'text-gray-500'}`}>Brand</span>
          {role === 'brand' && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />}
        </button>

        <button
          type="button"
          onClick={() => setRole('influencer')}
          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
            role === 'influencer' 
            ? 'border-purple-600 bg-purple-50/50 ring-4 ring-purple-100' 
            : 'border-gray-100 bg-white hover:border-purple-200'
          }`}
        >
          <Users className={role === 'influencer' ? 'text-purple-600' : 'text-gray-400'} size={20} />
          <span className={`font-bold text-sm ${role === 'influencer' ? 'text-purple-900' : 'text-gray-500'}`}>Influencer</span>
          {role === 'influencer' && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />}
        </button>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5 px-1">Full Name</label>
        <div className="relative group">
          <input 
            type="text" 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 ${
              errors.name 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
            }`}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <User className={`absolute left-3 top-3 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} size={16} />
        </div>
        {errors.name && <p className="mt-1 text-xs text-red-500 px-1">{errors.name}</p>}
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5 px-1">Email Address</label>
        <div className="relative group">
          <input 
            type="email" 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 ${
              errors.email 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
            }`}
            placeholder="e.g. alex@creator.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Mail className={`absolute left-3 top-3 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} size={16} />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500 px-1">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5 px-1">Create Password</label>
        <div className="relative group">
          <input 
            type="password" 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 ${
              errors.password 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
            }`}
            placeholder="Min. 8 characters with special char"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <Lock className={`absolute left-3 top-3 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} size={16} />
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-500 px-1">{errors.password}</p>}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5 px-1">Confirm Password</label>
        <div className="relative group">
          <input 
            type="password" 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-900 ${
              errors.confirmPassword 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
            }`}
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          <ShieldCheck className={`absolute left-3 top-3 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} size={16} />
        </div>
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 px-1">{errors.confirmPassword}</p>}
      </div>

      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 text-center">{submitError}</p>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full py-3 text-base mt-3 group"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
        {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
      </Button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
      </div>

      {/* Google Sign Up */}
      <button 
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-medium text-gray-700 text-sm"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
        Sign up with Google
      </button>
    </form>
  );
}