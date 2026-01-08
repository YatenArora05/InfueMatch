"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Building2, Mail, Phone, 
  Globe, Instagram, Youtube, Facebook, Twitter, DollarSign, MessageSquare, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import Button from '@/components/ui/Button';

export default function BrandProfilePage() {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [brandName, setBrandName] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [brandProfile, setBrandProfile] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Fetch user + brand profile details once (on mount)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (typeof window === 'undefined') return;

        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) return;

        setUserId(storedUserId);

        // Fetch user info
        const userResponse = await axios.get(`/api/user?id=${storedUserId}`);
        const user = userResponse.data.user;

        if (user?.name) {
          setBrandName(user.name);
        }

        if (user?.email) {
          setUserEmail(user.email);
        }

        // Fetch brand profile
        try {
          const brandResponse = await axios.get(`/api/brand/profile?userId=${storedUserId}`);
          if (brandResponse.data?.brand) {
            setBrandProfile(brandResponse.data.brand);
            setHasBeenSaved(true); // profile already exists
          }
        } catch (error: any) {
          // Brand profile doesn't exist yet (404 is expected)
          if (error?.response?.status !== 404) {
            console.error('Error fetching brand profile:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // When the onboarding form becomes visible AND we have brandProfile, pre-fill the inputs
  useEffect(() => {
    if (!isOnboarding || !brandProfile) return;

    const formElement = document.querySelector('form') as HTMLFormElement | null;
    if (!formElement) return;

    const profile = brandProfile;
    const socials = profile.socials || {};

    const setInputValue = (selector: string, value?: string) => {
      const el = formElement.querySelector(selector) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      if (el && typeof value === 'string' && value.length > 0) {
        (el as any).value = value;
      }
    };

    // Basic info
    setInputValue('[name="email"]', profile.email || userEmail);
    setInputValue('[name="companyName"]', profile.companyName);
    setInputValue('[name="industry"]', profile.industry);
    setInputValue('[name="website"]', profile.website);
    setInputValue('[name="phone"]', profile.phone);
    setInputValue('[name="address"]', profile.address);
    setInputValue('[name="city"]', profile.city);
    setInputValue('[name="state"]', profile.state);
    setInputValue('[name="zip"]', profile.zip);
    setInputValue('[name="bio"]', profile.bio);
    setInputValue('[name="budgetRange"]', profile.budgetRange);
    setInputValue('[name="targetAudience"]', profile.targetAudience);
    setInputValue('[name="totalCampaigns"]', profile.totalCampaigns);
    setInputValue('[name="activeInfluencers"]', profile.activeInfluencers);
    setInputValue('[name="totalReach"]', profile.totalReach);
    setInputValue('[name="totalSpend"]', profile.totalSpend);

    // Socials
    setInputValue('[name="instagramUsername"]', socials.instagram?.username);
    setInputValue('[name="instagramFollowers"]', socials.instagram?.followers);
    setInputValue('[name="youtubeChannel"]', socials.youtube?.channel);
    setInputValue('[name="youtubeSubscribers"]', socials.youtube?.subscribers);
    setInputValue('[name="facebookUsername"]', socials.facebook?.username);
    setInputValue('[name="facebookFollowers"]', socials.facebook?.followers);
    setInputValue('[name="twitterUsername"]', socials.twitter?.username);
    setInputValue('[name="twitterFollowers"]', socials.twitter?.followers);
  }, [isOnboarding, brandProfile, userEmail]);

      // Welcome State
  if (!isOnboarding && !isCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-500 px-4 md:px-6">
        <div className="max-w-2xl text-center w-full">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-100 text-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 animate-bounce">
            <Sparkles size={32} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tighter mb-3 sm:mb-4 md:mb-6">
            Welcome, <span className="text-purple-600">{isLoadingUser ? '...' : brandName || 'Brand'}!</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-6 md:mb-10 leading-relaxed px-2 sm:px-4">
            Let's set up your brand profile to connect with top-tier influencers and grow your reach.
          </p>
          <Button onClick={() => setIsOnboarding(true)} className="px-5 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl group shadow-2xl shadow-purple-200">
            Setup Brand Profile <ArrowRight size={20} className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  // Profile Form State
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!storedUserId) {
        setSaveMessage({ type: 'error', text: 'User ID not found. Please log in again.' });
        setIsSaving(false);
        return;
      }

      const profileData = {
        userId: storedUserId,
        email: formData.get('email') as string,
        companyName: formData.get('companyName') as string,
        industry: formData.get('industry') as string,
        website: formData.get('website') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        bio: formData.get('bio') as string,
        budgetRange: formData.get('budgetRange') as string,
        targetAudience: formData.get('targetAudience') as string,
        totalCampaigns: formData.get('totalCampaigns') as string,
        activeInfluencers: formData.get('activeInfluencers') as string,
        totalReach: formData.get('totalReach') as string,
        totalSpend: formData.get('totalSpend') as string,
        instagramUsername: formData.get('instagramUsername') as string,
        instagramFollowers: formData.get('instagramFollowers') as string,
        youtubeChannel: formData.get('youtubeChannel') as string,
        youtubeSubscribers: formData.get('youtubeSubscribers') as string,
        facebookUsername: formData.get('facebookUsername') as string,
        facebookFollowers: formData.get('facebookFollowers') as string,
        twitterUsername: formData.get('twitterUsername') as string,
        twitterFollowers: formData.get('twitterFollowers') as string,
      };

      const response = await axios.post('/api/brand/profile', profileData);

      if (response.data?.message === 'Profile saved successfully') {
        setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
        setHasBeenSaved(true);
        setIsCompleted(true);
        // Update brand profile state with the saved data
        if (response.data?.brand) {
          setBrandProfile(response.data.brand);
        }
      }
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to save profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const formElement = document.querySelector('form') as HTMLFormElement;
      
      if (!formElement) {
        setSaveMessage({ type: 'error', text: 'Form not found.' });
        setIsSaving(false);
        return;
      }

      const formData = new FormData(formElement);

      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!storedUserId) {
        setSaveMessage({ type: 'error', text: 'User ID not found. Please log in again.' });
        setIsSaving(false);
        return;
      }

      const profileData = {
        userId: storedUserId,
        email: formData.get('email') as string,
        companyName: formData.get('companyName') as string,
        industry: formData.get('industry') as string,
        website: formData.get('website') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        bio: formData.get('bio') as string,
        budgetRange: formData.get('budgetRange') as string,
        targetAudience: formData.get('targetAudience') as string,
        totalCampaigns: formData.get('totalCampaigns') as string,
        activeInfluencers: formData.get('activeInfluencers') as string,
        totalReach: formData.get('totalReach') as string,
        totalSpend: formData.get('totalSpend') as string,
        instagramUsername: formData.get('instagramUsername') as string,
        instagramFollowers: formData.get('instagramFollowers') as string,
        youtubeChannel: formData.get('youtubeChannel') as string,
        youtubeSubscribers: formData.get('youtubeSubscribers') as string,
        facebookUsername: formData.get('facebookUsername') as string,
        facebookFollowers: formData.get('facebookFollowers') as string,
        twitterUsername: formData.get('twitterUsername') as string,
        twitterFollowers: formData.get('twitterFollowers') as string,
      };

      const response = await axios.post('/api/brand/profile', profileData);

      if (response.data?.message === 'Profile saved successfully') {
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update brand profile state with the updated data
        if (response.data?.brand) {
          setBrandProfile(response.data.brand);
        }
      }
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] flex flex-col animate-in slide-in-from-bottom-8 duration-700">
      <div className="mb-4 md:mb-6 text-center shrink-0 px-2 md:px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-1 md:mb-2">Complete Your Brand Profile</h2>
        <p className="text-gray-500 font-medium tracking-wide uppercase text-[10px] md:text-xs">Step 1: Brand Identity & Information</p>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-[3rem] border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-50 flex-1 overflow-y-auto mb-4 md:mb-0">
        {saveMessage && (
          <div className={`mb-4 p-4 rounded-xl ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Company Information */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <Building2 size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Company/Brand Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. Nike Inc."
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Industry *</label>
                <select
                  name="industry"
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                >
                  <option value="">Select Industry</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Tech">Tech</option>
                  <option value="Sports">Sports</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Travel">Travel</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="https://www.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={userEmail}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <Phone size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Brand Description */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <MessageSquare size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Brand Description
            </h3>
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">About Your Brand *</label>
              <textarea
                name="bio"
                required
                rows={4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none resize-none"
                placeholder="Tell us about your brand, mission, and values..."
              />
            </div>
          </div>

          {/* Marketing Information */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <DollarSign size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Marketing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget Range</label>
                <select
                  name="budgetRange"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                >
                  <option value="">Select Budget Range</option>
                  <option value="$1k - $5k">$1k - $5k</option>
                  <option value="$5k - $10k">$5k - $10k</option>
                  <option value="$10k - $25k">$10k - $25k</option>
                  <option value="$25k - $50k">$25k - $50k</option>
                  <option value="$50k+">$50k+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. 18-35, Fashion Enthusiasts"
                />
              </div>
            </div>
          </div>

          {/* Campaign Statistics */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Campaign Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Campaigns</label>
                <input
                  type="text"
                  name="totalCampaigns"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. 12,567"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Active Influencers</label>
                <input
                  type="text"
                  name="activeInfluencers"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. 2,475"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Reach</label>
                <input
                  type="text"
                  name="totalReach"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. 1.2M"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Spend</label>
                <input
                  type="text"
                  name="totalSpend"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                  placeholder="e.g. $150,000"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
              <Globe size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 text-purple-600" /> Social Media Presence
            </h3>
            <div className="space-y-3 md:space-y-4">
              {/* Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    <Instagram size={16} className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500" /> Instagram Username
                  </label>
                  <input
                    type="text"
                    name="instagramUsername"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="@yourbrand"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Instagram Followers
                  </label>
                  <input
                    type="text"
                    name="instagramFollowers"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="e.g. 50K, 1.2M"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    <Youtube size={16} className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" /> YouTube Channel
                  </label>
                  <input
                    type="text"
                    name="youtubeChannel"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="Channel Name"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    YouTube Subscribers
                  </label>
                  <input
                    type="text"
                    name="youtubeSubscribers"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="e.g. 100K, 2.5M"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    <Facebook size={16} className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" /> Facebook Page Name
                  </label>
                  <input
                    type="text"
                    name="facebookUsername"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="Page Name"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Facebook Followers
                  </label>
                  <input
                    type="text"
                    name="facebookFollowers"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="e.g. 25K, 500K"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    <Twitter size={16} className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" /> Twitter Username
                  </label>
                  <input
                    type="text"
                    name="twitterUsername"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="@yourbrand"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Twitter Followers
                  </label>
                  <input
                    type="text"
                    name="twitterFollowers"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
                    placeholder="e.g. 30K, 750K"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
            {!hasBeenSaved ? (
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 md:py-3.5 text-base md:text-lg shadow-xl shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Profile & Enter Dashboard'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="flex-1 py-3 md:py-3.5 text-base md:text-lg shadow-xl shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Updating...' : 'Update Profile'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

