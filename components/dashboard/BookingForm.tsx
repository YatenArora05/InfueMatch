"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Calendar, Camera, Link as LinkIcon, DollarSign, Type, Send, AlertCircle, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const router = useRouter();

  // Check if profile is complete on component mount
  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const influencerId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        
        if (!influencerId) {
          setIsProfileComplete(false);
          setIsCheckingProfile(false);
          return;
        }

        const response = await axios.get(`/api/user?id=${influencerId}`);
        const user = response.data.user;

        if (user?.profileComplete === true) {
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        setIsProfileComplete(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfileStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if profile is not complete
    if (!isProfileComplete) {
      setMessage({
        type: 'error',
        text: 'You must set up your profile first before posting future bookings.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const campaignName = (formData.get('campaignName') as string || '').trim();
      const eventName = (formData.get('eventName') as string || '').trim();
      const postingDate = formData.get('postingDate') as string;
      const agreedRateRaw = formData.get('agreedRate') as string;
      const notes = (formData.get('notes') as string || '').trim();
      const assetLink = (formData.get('assetLink') as string || '').trim();

      const agreedRate = agreedRateRaw ? Number(agreedRateRaw) : 0;

      if (!campaignName || !eventName || !postingDate) {
        setMessage({
          type: 'error',
          text: 'Please fill Campaign Name, Event / Brand Name and Posting Date.',
        });
        setLoading(false);
        return;
      }

      const influencerId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      const response = await axios.post('/api/bookings', {
        influencerId,
        campaignName,
        eventName,
        postingDate,
        agreedRate,
        notes,
        assetLink,
      });

      if (response.data?.message === 'Booking saved successfully') {
        setMessage({ type: 'success', text: 'Booking saved successfully!' });
        form.reset();
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error?.response?.data?.message ||
          'Failed to save booking. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking profile
  if (isCheckingProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Checking profile status...</p>
        </div>
      </div>
    );
  }

  // Show profile incomplete message if profile is not set up
  if (!isProfileComplete) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-2xl p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Profile Setup Required</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You have to first set up your profile to post your future upcoming bookings for any of the brand collaboration.
          </p>
          <Button
            onClick={() => router.push('/dashboard/influencer')}
            className="w-full py-3.5 text-lg shadow-xl shadow-purple-100 flex items-center justify-center gap-2"
          >
            <User size={20} /> Go to Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Campaign/Post Name */}
        <div className="space-y-2">
          <label className="text-base font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Type size={18} className="text-purple-600" /> Campaign Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Summer Collection Launch"
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-base"
            required
            name="campaignName"
          />
        </div>

        {/* Brand / Event Name */}
        <div className="space-y-2">
          <label className="text-base font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Camera size={18} className="text-purple-600" /> Event / Brand Name
          </label>
          <input
            type="text"
            placeholder="e.g. Nike Summer Launch Event"
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-base"
            required
            name="eventName"
          />
        </div>

        {/* Event/Post Date */}
        <div className="space-y-2">
          <label className="text-base font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Calendar size={18} className="text-purple-600" /> Posting Date
          </label>
          <input 
            type="date" 
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-base"
            required
            name="postingDate"
          />
        </div>

        {/* Agreed Rate */}
        <div className="space-y-2">
          <label className="text-base font-bold text-gray-700 ml-1 flex items-center gap-2">
            <DollarSign size={18} className="text-purple-600" /> Agreed Rate ($)
          </label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-base"
            name="agreedRate"
          />
        </div>
      </div>

      {/* Campaign Requirements / Notes */}
      <div className="space-y-2">
        <label className="text-base font-bold text-gray-700 ml-1">Collaboration Details & Notes</label>
        <textarea 
          rows={4}
          placeholder="Describe the content type (Reel, Story, Post) and specific hashtags or requirements..."
          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all resize-none text-base"
          name="notes"
        ></textarea>
      </div>

      {/* Dynamic Link Field */}
      <div className="space-y-2">
        <label className="text-base font-bold text-gray-700 ml-1 flex items-center gap-2">
          <LinkIcon size={18} className="text-purple-600" /> Campaign Asset Link (Optional)
        </label>
        <input 
          type="url" 
          placeholder="https://drive.google.com/..."
          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-base"
          name="assetLink"
        />
      </div>

      {message && (
        <div
          className={`mt-2 p-3 rounded-xl text-sm font-semibold text-center ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="pt-2 mt-auto">
        <Button 
          type="submit" 
          className="w-full py-3.5 text-lg shadow-xl shadow-purple-100 flex gap-2"
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm Booking"} <Send size={20} />
        </Button>
      </div>
    </form>
  );
}