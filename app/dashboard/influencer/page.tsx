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
  Area,
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
    <div className="relative w-full bg-[#020617] overflow-hidden">
      <main className="relative z-10 w-full pb-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#E5E7EB] mb-2">Influencer Dashboard</h1>
            <p className="text-[#9CA3AF] text-xs md:text-sm font-medium">Your overview and performance</p>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            {userId && (
              <NotificationBell userId={userId} variant="header" theme="dark" />
            )}
            <div className="flex items-center gap-2 md:gap-3 md:border-l md:border-[#1F2937] md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-[#E5E7EB]">{fullName || 'Influencer'}</p>
                <p className="text-[10px] md:text-xs text-[#9CA3AF] truncate max-w-[140px]">{email || '—'}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#2563EB] p-0.5 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                {(fullName || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-20">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#9CA3AF] font-medium text-sm md:text-base">Loading dashboard...</p>
            </div>
          </div>
        ) : !isProfileComplete ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Mail size={18} className="text-[#3B82F6]" />
                <span className="text-sm font-semibold">Email:</span>
                <span className="text-sm text-[#E5E7EB] truncate max-w-[240px] md:max-w-none">{email || '—'}</span>
              </div>
              {niche.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {niche.map((n: string) => (
                    <span
                      key={n}
                      className="px-3 py-1 bg-[#1F2937] text-[#3B82F6] rounded-full text-xs font-bold border border-[#374151]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <StatCard title="Total Reach" value={totalReachStr} trend="+12%" color="purple" theme="dark" />
              <StatCard title="Est. Rate" value={estimatedRate} trend="—" color="purple" theme="dark" />
              <StatCard title="Content Niches" value={String(niche.length || 0)} trend="—" color="purple" theme="dark" />
              <StatCard title="Profile" value="Active" trend="✓" color="purple" theme="dark" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#0B1220]/90 backdrop-blur-sm p-6 rounded-3xl border border-[#1F2937] shadow-xl shadow-blue-900/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-[#E5E7EB]">Influencer Progress (Live)</h3>
                  <span className="text-xs font-semibold text-[#3B82F6] bg-[#1E3A8A]/40 px-2 py-1 rounded-lg border border-[#3B82F6]/30">Updating</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <defs>
                        <linearGradient id="progressAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                          <stop offset="60%" stopColor="#2563EB" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#020617" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="2 6"
                        stroke="#1F2937"
                        vertical={false}
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 10', 'dataMax + 10']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1220',
                          border: '1px solid #1F2937',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          color: '#E5E7EB',
                        }}
                        itemStyle={{ color: '#3B82F6' }}
                        formatter={(value: number | undefined) => [value != null ? `${Math.round(value)}%` : '—', 'Score']}
                      />
                      <Area
                        type="linear"
                        dataKey="score"
                        stroke="none"
                        fill="url(#progressAreaFill)"
                        fillOpacity={1}
                      />
                      <Line
                        type="linear"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dot={(props) => {
                          const { cx, cy } = props;
                          if (cx == null || cy == null) return null;
                          return (
                            <>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={6}
                                fill="rgba(59, 130, 246, 0.18)"
                              />
                              <circle
                                cx={cx}
                                cy={cy}
                                r={3.5}
                                fill="#DBEAFE"
                                stroke="#3B82F6"
                                strokeWidth={1.5}
                                style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.85))' }}
                              />
                            </>
                          );
                        }}
                        activeDot={(props) => {
                          const { cx, cy } = props;
                          if (cx == null || cy == null) return null;
                          return (
                            <>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={8}
                                fill="rgba(59, 130, 246, 0.25)"
                              />
                              <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill="#DBEAFE"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                style={{ filter: 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.95))' }}
                              />
                            </>
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0B1220]/90 backdrop-blur-sm p-6 rounded-3xl border border-[#1F2937] shadow-xl shadow-blue-900/10">
                <h3 className="font-bold text-lg mb-6 text-[#E5E7EB]">Social Media Reach</h3>
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
                          backgroundColor: '#0B1220',
                          border: '1px solid #1F2937',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          color: '#E5E7EB',
                        }}
                        itemStyle={{
                          color: '#E5E7EB',
                          fontWeight: 600,
                        }}
                        labelStyle={{
                          color: '#E5E7EB',
                          fontWeight: 600,
                        }}
                        formatter={(value: number | undefined) =>
                          value ? value.toLocaleString() : '0'
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-[#9CA3AF] font-medium w-full max-w-xs">
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
