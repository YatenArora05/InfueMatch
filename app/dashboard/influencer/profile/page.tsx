"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, User, Mail, Phone,
  Instagram, Youtube, Facebook, Twitter, ListChecks, MessageSquare, DollarSign
} from 'lucide-react';
import axios from 'axios';
import Button from '@/components/ui/Button';

export default function InfluencerProfilePage() {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (typeof window === 'undefined') return;
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) return;
        setUserId(storedUserId);
        const response = await axios.get(`/api/user?id=${storedUserId}`);
        const user = response.data.user;
        if (user?.name) setUserName(user.name);
        if (user?.email) setUserEmail(user.email);
        if (user?.details) {
          setUserDetails(user.details);
          setHasBeenSaved(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isOnboarding || !userDetails) return;
    const formElement = document.querySelector('form') as HTMLFormElement | null;
    if (!formElement) return;
    const details = userDetails;
    const socials = details.socials || {};
    const setInputValue = (selector: string, value?: string) => {
      const el = formElement.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && typeof value === 'string' && value.length > 0) (el as any).value = value;
    };
    setInputValue('[name="email"]', userEmail);
    setInputValue('[name="firstName"]', details.firstName);
    setInputValue('[name="lastName"]', details.lastName);
    setInputValue('[name="gender"]', details.gender);
    setInputValue('[name="dob"]', details.dob);
    setInputValue('[name="phone"]', details.phone);
    setInputValue('[name="address"]', details.address);
    setInputValue('[name="city"]', details.city);
    setInputValue('[name="state"]', details.state);
    setInputValue('[name="zip"]', details.zip);
    setInputValue('[name="bio"]', details.bio);
    setInputValue('[name="estimatedRate"]', details.estimatedRate);
    setInputValue('[name="instagramUsername"]', socials.instagram?.username);
    setInputValue('[name="instagramFollowers"]', socials.instagram?.followers);
    setInputValue('[name="youtubeChannel"]', socials.youtube?.channel);
    setInputValue('[name="youtubeSubscribers"]', socials.youtube?.subscribers);
    setInputValue('[name="facebookUsername"]', socials.facebook?.username);
    setInputValue('[name="facebookFollowers"]', socials.facebook?.followers);
    setInputValue('[name="twitterUsername"]', socials.twitter?.username);
    setInputValue('[name="twitterFollowers"]', socials.twitter?.followers);
    if (Array.isArray(details.niche)) {
      const nicheValues: string[] = details.niche;
      const nicheCheckboxes = formElement.querySelectorAll('input[name="niche"]') as NodeListOf<HTMLInputElement>;
      nicheCheckboxes.forEach((cb) => { cb.checked = nicheValues.includes(cb.value); });
    }
  }, [isOnboarding, userDetails, userEmail]);

  if (!isOnboarding && !isCompleted) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Subtle blue grid background - slightly dulled for dashboard */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59,130,246,0.28) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59,130,246,0.28) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              backgroundPosition: "0 0",
            }}
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59,130,246,0.10) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59,130,246,0.10) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              filter: "blur(0.5px)",
              boxShadow: "inset 0 0 90px rgba(15,23,42,0.85)",
            }}
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.85) 70%, rgba(2,6,23,1) 100%)",
            }}
          />
        </div>

        <div className="max-w-2xl text-center w-full relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-4 md:mb-6 text-[#E5E7EB]">
            <span className="inline-flex items-baseline justify-center gap-2 max-w-full whitespace-nowrap">
              <span className="text-inherit">Welcome,</span>
              <span
                className="bg-gradient-to-r from-[#F9FAFB] via-[#E5E7EB] to-[#3B82F6] bg-clip-text text-transparent truncate max-w-[50vw] sm:max-w-[60vw]"
                title={isLoadingUser ? '...' : userName || 'User'}
              >
                {isLoadingUser ? '...' : userName || 'User'}
              </span>
            </span>
          </h1>
          <p className="text-base md:text-xl text-[#9CA3AF] mb-6 md:mb-10 leading-relaxed max-w-xl mx-auto">
            Let&apos;s set up your profile so brands can quickly understand your audience, content style, and collaboration fit.
          </p>
          <Button
            onClick={() => setIsOnboarding(true)}
            className="inline-flex items-center justify-center px-6 py-3.5 md:px-10 md:py-4 text-base md:text-lg font-semibold rounded-xl bg-[#3B82F6] text-white border border-[#2563EB] hover:bg-[#2563EB] hover:border-[#60A5FA] transition-colors"
          >
            Setup Influencer Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-profile-page max-w-5xl mx-auto w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col animate-in slide-in-from-bottom-8 duration-700">
      <div className="mb-4 md:mb-6 text-center flex-shrink-0 px-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#E5E7EB] mb-1 md:mb-2">
          Complete Your Profile
        </h2>
        <p className="text-[#9CA3AF] font-medium tracking-wide uppercase text-[10px] md:text-xs">
          Step 1: Identity &amp; Reach
        </p>
      </div>

      <div className="bg-[#0B1220]/90 rounded-2xl md:rounded-[3rem] border border-[#1F2937] p-4 md:p-8 lg:p-12 shadow-xl shadow-blue-900/10 flex-1 overflow-y-auto">
        {saveMessage && (
          <div className={`mb-4 p-4 rounded-xl ${
            saveMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p className="text-sm font-semibold text-center">{saveMessage.text}</p>
          </div>
        )}
        <form className="space-y-6 md:space-y-10" onSubmit={async (e) => {
          e.preventDefault();
          setIsSaving(true);
          setSaveMessage(null);
          try {
            const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
            if (!storedUserId) {
              setSaveMessage({ type: 'error', text: 'User ID not found. Please log in again.' });
              setIsSaving(false);
              return;
            }
            const formElement = e.target as HTMLFormElement;
            const email = (formElement.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
            const firstName = (formElement.querySelector('[name="firstName"]') as HTMLInputElement)?.value || '';
            const lastName = (formElement.querySelector('[name="lastName"]') as HTMLInputElement)?.value || '';
            const gender = (formElement.querySelector('[name="gender"]') as HTMLSelectElement)?.value || '';
            const dob = (formElement.querySelector('[name="dob"]') as HTMLInputElement)?.value || '';
            const phone = (formElement.querySelector('[name="phone"]') as HTMLInputElement)?.value || '';
            const address = (formElement.querySelector('[name="address"]') as HTMLInputElement)?.value || '';
            const city = (formElement.querySelector('[name="city"]') as HTMLInputElement)?.value || '';
            const state = (formElement.querySelector('[name="state"]') as HTMLInputElement)?.value || '';
            const zip = (formElement.querySelector('[name="zip"]') as HTMLInputElement)?.value || '';
            const instagramUsername = (formElement.querySelector('[name="instagramUsername"]') as HTMLInputElement)?.value || '';
            const instagramFollowers = (formElement.querySelector('[name="instagramFollowers"]') as HTMLInputElement)?.value || '';
            const youtubeChannel = (formElement.querySelector('[name="youtubeChannel"]') as HTMLInputElement)?.value || '';
            const youtubeSubscribers = (formElement.querySelector('[name="youtubeSubscribers"]') as HTMLInputElement)?.value || '';
            const facebookUsername = (formElement.querySelector('[name="facebookUsername"]') as HTMLInputElement)?.value || '';
            const facebookFollowers = (formElement.querySelector('[name="facebookFollowers"]') as HTMLInputElement)?.value || '';
            const twitterUsername = (formElement.querySelector('[name="twitterUsername"]') as HTMLInputElement)?.value || '';
            const twitterFollowers = (formElement.querySelector('[name="twitterFollowers"]') as HTMLInputElement)?.value || '';
            const bio = (formElement.querySelector('[name="bio"]') as HTMLTextAreaElement)?.value || '';
            const estimatedRate = (formElement.querySelector('[name="estimatedRate"]') as HTMLInputElement)?.value || '';
            const nicheCheckboxes = formElement.querySelectorAll('[name="niche"]:checked') as NodeListOf<HTMLInputElement>;
            const niche = Array.from(nicheCheckboxes).map(cb => cb.value);

            const response = await axios.post('/api/influencer/profile', {
              userId: storedUserId, email, firstName, lastName, gender, dob, phone, address, city, state, zip,
              instagramUsername, instagramFollowers, youtubeChannel, youtubeSubscribers,
              facebookUsername, facebookFollowers, twitterUsername, twitterFollowers, niche, bio, estimatedRate,
            });

            if (response.data.message === 'Profile saved successfully') {
              setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
              setIsCompleted(true);
              setIsOnboarding(false);
              setHasBeenSaved(true);
              setTimeout(() => setSaveMessage(null), 3000);
            }
          } catch (error: any) {
            setSaveMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save profile. Please try again.' });
          } finally {
            setIsSaving(false);
          }
        }}>
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold text-[#3B82F6] flex items-center gap-2 border-b border-[#1F2937] pb-2">
              <User size={18} className="md:w-5 md:h-5 text-[#3B82F6]" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase mb-1 md:mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
                  />
                  <Mail className="absolute left-3 md:left-4 top-3 md:top-4 text-[#4B5563] group-focus-within:text-[#3B82F6] w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase mb-1 md:mb-2 ml-1">Profile Pic</label>
                <input
                  type="file"
                  name="profilePic"
                  className="w-full text-xs md:text-sm text-[#E5E7EB]/80 file:mr-2 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-2 md:file:px-4 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-black file:bg-[#1E3A8A]/25 file:text-[#E5E7EB] hover:file:bg-[#1E3A8A]/40"
                />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <select
                name="gender"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base"
              >
                <option value="">Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="dob"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base"
              />
              <div className="relative group lg:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
                />
                <Phone className="absolute left-3 md:left-4 top-3 md:top-4 text-[#4B5563] group-focus-within:text-[#3B82F6] w-4 h-4 md:w-[18px] md:h-[18px]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <input
                type="text"
                name="address"
                placeholder="Address (Optional)"
                className="md:col-span-3 w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <input
                type="text"
                name="zip"
                placeholder="Zip"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold text-[#3B82F6] flex items-center gap-2 border-b border-[#1F2937] pb-2">
              <Sparkles size={18} className="md:w-5 md:h-5 text-[#3B82F6]" /> Social Media Reach
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="instagramUsername"
                    placeholder="Instagram Username"
                    className="w-full pl-9 md:pl-10 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                  <Instagram className="absolute left-2.5 md:left-3 top-3 md:top-4 text-pink-500 w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="instagramFollowers"
                    placeholder="Followers (e.g., 50K)"
                    className="w-full pl-4 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="youtubeChannel"
                    placeholder="YouTube Channel"
                    className="w-full pl-9 md:pl-10 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                  <Youtube className="absolute left-2.5 md:left-3 top-3 md:top-4 text-red-500 w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="youtubeSubscribers"
                    placeholder="Subscribers (e.g., 100K)"
                    className="w-full pl-4 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="facebookUsername"
                    placeholder="Facebook Username"
                    className="w-full pl-9 md:pl-10 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                  <Facebook className="absolute left-2.5 md:left-3 top-3 md:top-4 text-blue-600 w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="facebookFollowers"
                    placeholder="Followers (e.g., 25K)"
                    className="w-full pl-4 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="twitterUsername"
                    placeholder="Twitter Username"
                    className="w-full pl-9 md:pl-10 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                  <Twitter className="absolute left-2.5 md:left-3 top-3 md:top-4 text-sky-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="twitterFollowers"
                    placeholder="Followers (e.g., 30K)"
                    className="w-full pl-4 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm placeholder:text-[#6B7280]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold text-[#3B82F6] flex items-center gap-2 border-b border-[#1F2937] pb-2">
              <ListChecks size={18} className="md:w-5 md:h-5 text-[#3B82F6]" /> Content Niche
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {['Sports', 'Tech', 'Fashion', 'Coding', 'Food', 'Travel'].map((niche) => (
                <label
                  key={niche}
                  className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-[#020617] rounded-xl md:rounded-2xl cursor-pointer hover:bg-[#111827] transition-colors group border border-[#1F2937]"
                >
                  <input
                    type="checkbox"
                    name="niche"
                    value={niche}
                    className="w-4 h-4 md:w-5 md:h-5 accent-[#3B82F6] rounded"
                  />
                  <span className="text-xs md:text-sm font-bold text-[#E5E7EB] group-hover:text-white">{niche}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-[#E5E7EB] ml-1 flex items-center gap-2">
              <MessageSquare size={14} className="md:w-4 md:h-4 text-[#3B82F6]" /> Bio / Additional Comments
            </label>
            <textarea
              name="bio"
              rows={4}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-[2rem] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none resize-none text-sm md:text-base placeholder:text-[#6B7280]"
              placeholder="Tell us more about your content style..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-[#E5E7EB] ml-1 flex items-center gap-2">
              <DollarSign size={14} className="md:w-4 md:h-4 text-[#3B82F6]" /> Estimated Rate (Approximate)
            </label>
            <div className="relative group">
              <input
                type="text"
                name="estimatedRate"
                placeholder="e.g., $500 - $1000, $1k - $2k, or $5k+"
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-[#020617] border border-[#1F2937] rounded-xl md:rounded-2xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/60 outline-none text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <DollarSign className="absolute left-3 md:left-4 top-3 md:top-4 text-[#4B5563] group-focus-within:text-[#3B82F6] w-4 h-4 md:w-[18px] md:h-[18px]" />
            </div>
            <p className="text-[10px] md:text-xs text-[#9CA3AF] ml-1">
              Approximate rate range you&apos;re willing to work with brands (optional)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button type="submit" disabled={isSaving} className="flex-1 py-4 md:py-5 text-lg md:text-xl">
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
            <button
              type="button"
              disabled={!hasBeenSaved || isSaving}
              onClick={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                setSaveMessage(null);
                try {
                  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
                  if (!storedUserId) { setSaveMessage({ type: 'error', text: 'User ID not found. Please log in again.' }); setIsSaving(false); return; }
                  const formElement = document.querySelector('form') as HTMLFormElement;
                  const email = (formElement.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
                  const firstName = (formElement.querySelector('[name="firstName"]') as HTMLInputElement)?.value || '';
                  const lastName = (formElement.querySelector('[name="lastName"]') as HTMLInputElement)?.value || '';
                  const gender = (formElement.querySelector('[name="gender"]') as HTMLSelectElement)?.value || '';
                  const dob = (formElement.querySelector('[name="dob"]') as HTMLInputElement)?.value || '';
                  const phone = (formElement.querySelector('[name="phone"]') as HTMLInputElement)?.value || '';
                  const address = (formElement.querySelector('[name="address"]') as HTMLInputElement)?.value || '';
                  const city = (formElement.querySelector('[name="city"]') as HTMLInputElement)?.value || '';
                  const state = (formElement.querySelector('[name="state"]') as HTMLInputElement)?.value || '';
                  const zip = (formElement.querySelector('[name="zip"]') as HTMLInputElement)?.value || '';
                  const instagramUsername = (formElement.querySelector('[name="instagramUsername"]') as HTMLInputElement)?.value || '';
                  const instagramFollowers = (formElement.querySelector('[name="instagramFollowers"]') as HTMLInputElement)?.value || '';
                  const youtubeChannel = (formElement.querySelector('[name="youtubeChannel"]') as HTMLInputElement)?.value || '';
                  const youtubeSubscribers = (formElement.querySelector('[name="youtubeSubscribers"]') as HTMLInputElement)?.value || '';
                  const facebookUsername = (formElement.querySelector('[name="facebookUsername"]') as HTMLInputElement)?.value || '';
                  const facebookFollowers = (formElement.querySelector('[name="facebookFollowers"]') as HTMLInputElement)?.value || '';
                  const twitterUsername = (formElement.querySelector('[name="twitterUsername"]') as HTMLInputElement)?.value || '';
                  const twitterFollowers = (formElement.querySelector('[name="twitterFollowers"]') as HTMLInputElement)?.value || '';
                  const bio = (formElement.querySelector('[name="bio"]') as HTMLTextAreaElement)?.value || '';
                  const estimatedRate = (formElement.querySelector('[name="estimatedRate"]') as HTMLInputElement)?.value || '';
                  const nicheCheckboxes = formElement.querySelectorAll('[name="niche"]:checked') as NodeListOf<HTMLInputElement>;
                  const niche = Array.from(nicheCheckboxes).map(cb => cb.value);
                  const response = await axios.post('/api/influencer/profile', {
                    userId: storedUserId, email, firstName, lastName, gender, dob, phone, address, city, state, zip,
                    instagramUsername, instagramFollowers, youtubeChannel, youtubeSubscribers,
                    facebookUsername, facebookFollowers, twitterUsername, twitterFollowers, niche, bio, estimatedRate,
                  });
                  if (response.data.message === 'Profile saved successfully') {
                    setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
                    setTimeout(() => setSaveMessage(null), 3000);
                  }
                } catch (error: any) {
                  setSaveMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile. Please try again.' });
                } finally {
                  setIsSaving(false);
                }
              }}
              className={`flex-1 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                hasBeenSaved && !isSaving
                  ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
