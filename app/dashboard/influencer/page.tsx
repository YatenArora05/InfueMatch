"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { Mail } from 'lucide-react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

function parseFollowers(value: string): number {
  if (!value || value === '0') return 0;
  const cleaned = value.replace(/,/g, '').replace(/\$/g, '').trim();
  if (cleaned.toLowerCase().endsWith('k')) return parseFloat(cleaned.toLowerCase().replace('k', '')) * 1000;
  if (cleaned.toLowerCase().endsWith('m')) return parseFloat(cleaned.toLowerCase().replace('m', '')) * 1000000;
  return parseFloat(cleaned) || 0;
}

export default function InfluencerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [progressData, setProgressData] = useState(() => {
    const base = [
      { name: 'Mon', score: 42 },
      { name: 'Tue', score: 55 },
      { name: 'Wed', score: 48 },
      { name: 'Thu', score: 62 },
      { name: 'Fri', score: 58 },
      { name: 'Sat', score: 71 },
      { name: 'Sun', score: 65 },
    ];
    return base;
  });

  const fetchUser = async () => {
    try {
      const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!id) {
        setIsProfileComplete(false);
        setLoading(false);
        return;
      }
      setUserId(id);
      const response = await axios.get(`/api/user?id=${id}`);
      if (response.data?.user) {
        setUser(response.data.user);
        setIsProfileComplete(response.data.user.profileComplete === true);
      } else {
        setIsProfileComplete(false);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // If profile setup is not done, show the same profile setup (redirect to profile page)
  useEffect(() => {
    if (!loading && isProfileComplete === false) {
      router.replace('/dashboard/influencer/profile');
    }
  }, [loading, isProfileComplete, router]);

  useEffect(() => {
    if (!isProfileComplete) return;
    const interval = setInterval(() => {
      setProgressData((prev) =>
        prev.map((d) => ({
          ...d,
          score: Math.min(100, Math.max(0, d.score + (Math.random() * 6 - 3))),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isProfileComplete]);

  const fullName = useMemo(() => {
    if (!user?.details) return user?.name || '';
    const first = user.details.firstName || '';
    const last = user.details.lastName || '';
    return `${first} ${last}`.trim() || user?.name || '';
  }, [user]);

  const email = user?.email || '';
  const niche = user?.details?.niche || [];
  const estimatedRate = user?.details?.estimatedRate || 'Not specified';
  const socials = user?.details?.socials || {};
  const instagramFollowers = socials.instagram?.followers || '0';
  const youtubeSubscribers = socials.youtube?.subscribers || '0';
  const facebookFollowers = socials.facebook?.followers || '0';
  const twitterFollowers = socials.twitter?.followers || '0';

  const socialMediaData = useMemo(
    () => [
      { name: 'Instagram', value: parseFollowers(instagramFollowers), color: '#E1306C' },
      { name: 'YouTube', value: parseFollowers(youtubeSubscribers), color: '#FF0000' },
      { name: 'Facebook', value: parseFollowers(facebookFollowers), color: '#1877F2' },
      { name: 'Twitter', value: parseFollowers(twitterFollowers), color: '#1DA1F2' },
    ],
    [instagramFollowers, youtubeSubscribers, facebookFollowers, twitterFollowers]
  );

  const totalReach = socialMediaData.reduce((s, d) => s + d.value, 0);
  const totalReachStr = totalReach >= 1000000 ? `${(totalReach / 1000000).toFixed(1)}M` : totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : String(totalReach);

  const defaultPieData = [
    { name: 'Instagram', value: 0, color: '#E1306C' },
    { name: 'YouTube', value: 0, color: '#FF0000' },
    { name: 'Facebook', value: 0, color: '#1877F2' },
    { name: 'Twitter', value: 0, color: '#1DA1F2' },
  ];
  const pieData = socialMediaData.some((d) => d.value > 0) ? socialMediaData : defaultPieData;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

      <main className="relative z-10 w-full h-full overflow-y-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2">Influencer Dashboard</h1>
            <p className="text-gray-600 text-xs md:text-sm font-medium">Your overview and performance</p>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            {userId && (
              <NotificationBell userId={userId} variant="header" />
            )}
            <div className="flex items-center gap-2 md:gap-3 md:border-l md:border-purple-100 md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-gray-900">{fullName || 'Influencer'}</p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate max-w-[140px]">{email || '—'}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-600 p-0.5 flex items-center justify-center text-white font-bold text-sm">
                {(fullName || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-20">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-sm md:text-base">Loading dashboard...</p>
            </div>
          </div>
        ) : !isProfileComplete ? (
          /* Redirecting to profile setup – show same dialog there; avoid flash of card */
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={18} className="text-purple-600" />
                <span className="text-sm font-semibold">Email:</span>
                <span className="text-sm text-gray-900 truncate max-w-[240px] md:max-w-none">{email || '—'}</span>
              </div>
              {niche.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {niche.map((n: string) => (
                    <span
                      key={n}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <StatCard title="Total Reach" value={totalReachStr} trend="+12%" color="purple" />
              <StatCard title="Est. Rate" value={estimatedRate} trend="—" color="purple" />
              <StatCard title="Content Niches" value={String(niche.length || 0)} trend="—" color="purple" />
              <StatCard title="Profile" value="Active" trend="✓" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900">Influencer Progress (Live)</h3>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">Updating</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #E9D5FF',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                        itemStyle={{ color: '#9333EA' }}
                        formatter={(value: number | undefined) => [value != null ? `${Math.round(value)}%` : '—', 'Score']}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#9333EA"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#9333EA' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6 text-gray-900">Social Media Reach</h3>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #E9D5FF',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value: number | undefined) => (value ? value.toLocaleString() : '0')}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-700 font-medium w-full max-w-xs">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
