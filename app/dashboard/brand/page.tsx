"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { Bell, Search, AlertCircle, User } from 'lucide-react';
import axios from 'axios';
import Button from '@/components/ui/Button';

export default function BrandDashboard() {
  const router = useRouter();
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        if (!userId) {
          setIsProfileComplete(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/brand/profile?userId=${userId}`);
        if (response.data?.brand) {
          setBrandProfile(response.data.brand);
          // Check if profile is complete
          if (response.data.brand.profileComplete === true) {
            setIsProfileComplete(true);
          } else {
            setIsProfileComplete(false);
          }
        } else {
          setIsProfileComplete(false);
        }
      } catch (error: any) {
        // Brand profile doesn't exist yet (404 is expected for new brands)
        if (error?.response?.status === 404) {
          setIsProfileComplete(false);
        } else {
          console.error('Error fetching brand profile:', error);
          setIsProfileComplete(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProfile();
  }, []);

  // Get stats from brand profile or use defaults
  const totalCampaigns = brandProfile?.totalCampaigns || "0";
  const activeInfluencers = brandProfile?.activeInfluencers || "0";
  const totalReach = brandProfile?.totalReach || "0";
  const totalSpend = brandProfile?.totalSpend || "$0";

  // Get social media followers
  const socials = brandProfile?.socials || {};
  const instagramFollowers = socials.instagram?.followers || "0";
  const youtubeSubscribers = socials.youtube?.subscribers || "0";
  const facebookFollowers = socials.facebook?.followers || "0";
  const twitterFollowers = socials.twitter?.followers || "0";

  // Helper function to parse follower count to number
  const parseFollowers = (value: string): number => {
    if (!value || value === "0") return 0;
    // Remove commas and parse
    const cleaned = value.replace(/,/g, '').replace(/\$/g, '').trim();
    // Handle K, M suffixes
    if (cleaned.toLowerCase().endsWith('k')) {
      return parseFloat(cleaned.toLowerCase().replace('k', '')) * 1000;
    }
    if (cleaned.toLowerCase().endsWith('m')) {
      return parseFloat(cleaned.toLowerCase().replace('m', '')) * 1000000;
    }
    return parseFloat(cleaned) || 0;
  };

  const socialMediaData = [
    { name: 'Instagram', value: parseFollowers(instagramFollowers), color: '#E1306C' },
    { name: 'YouTube', value: parseFollowers(youtubeSubscribers), color: '#FF0000' },
    { name: 'Facebook', value: parseFollowers(facebookFollowers), color: '#1877F2' },
    { name: 'Twitter', value: parseFollowers(twitterFollowers), color: '#1DA1F2' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      
      <main className="relative z-10 w-full h-full overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2">Brand Dashboard</h1>
            <p className="text-gray-600 text-xs md:text-sm font-medium">Welcome back! Here's your overview</p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64 text-gray-900 placeholder:text-gray-400 text-sm"
              />
            </div>
            <button className="p-2 md:p-2.5 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl hover:bg-white transition-colors shadow-sm">
              <Bell size={20} className="text-purple-600" />
            </button>
            <div className="flex items-center gap-2 md:gap-3 md:border-l md:border-purple-100 md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-gray-900">Brand Manager</p>
                <p className="text-[10px] md:text-xs text-gray-500">Admin</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brand" alt="profile" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Check */}
        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-20">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium text-sm md:text-base">Checking profile status...</p>
            </div>
          </div>
        ) : !isProfileComplete ? (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-2xl p-6 md:p-8 text-center shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-600 rounded-full mb-4 md:mb-6">
                <AlertCircle size={32} className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">Profile Setup Required</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                You have to first set up your profile to access the dashboard and connect with top-tier influencers.
              </p>
              <Button
                onClick={() => router.push('/dashboard/brand/profile')}
                className="w-full py-3 md:py-3.5 text-base md:text-lg shadow-xl shadow-purple-100 flex items-center justify-center gap-2"
              >
                <User size={20} className="w-5 h-5 md:w-5 md:h-5" /> Go to Profile Setup
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <StatCard title="Total Campaigns" value={totalCampaigns || "0"} trend="+12%" color="purple" />
              <StatCard title="Active Influencers" value={activeInfluencers || "0"} trend="+5%" color="purple" />
              <StatCard title="Total Reach" value={totalReach || "0"} trend="+18%" color="purple" />
              <StatCard title="Total Spend" value={totalSpend || "$0"} trend="-2%" color="purple" />
            </div>

            {/* Charts Section */}
            <AnalyticsCharts socialMediaData={socialMediaData} />
          </>
        )}
      </main>
    </div>
  );
}