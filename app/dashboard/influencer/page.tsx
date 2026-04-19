"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/dashboard/NotificationBell";
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  TrendingUp,
  Check,
} from "lucide-react";
import axios from "axios";
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
} from "recharts";
import { getAvatarBackgroundColorFromName } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function parseFollowers(value: string): number {
  if (!value || value === "0") return 0;
  const cleaned = value.replace(/,/g, "").replace(/\$/g, "").trim();
  if (cleaned.toLowerCase().endsWith("k"))
    return parseFloat(cleaned.toLowerCase().replace("k", "")) * 1000;
  if (cleaned.toLowerCase().endsWith("m"))
    return parseFloat(cleaned.toLowerCase().replace("m", "")) * 1000000;
  return parseFloat(cleaned) || 0;
}

function formatReachShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(Math.round(n));
}

function formatAxisTick(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(Math.round(n));
}

function buildWeekSeries(totalReach: number) {
  const base = totalReach > 0 ? totalReach : 205_000;
  const lo = Math.round(base * 0.69);
  const hi = Math.round(base * 0.93);
  return DAYS.map((name, i) => {
    const t = i / (DAYS.length - 1);
    const wave = Math.sin((i / 2) * Math.PI) * base * 0.012;
    const reach = Math.round(lo + (hi - lo) * t + wave);
    return { name, reach };
  });
}

type Accent = "blue" | "indigo" | "cyan" | "green";

function MetricCard({
  label,
  value,
  badge,
  badgeVariant,
  accent,
}: {
  label: string;
  value: string;
  badge: React.ReactNode;
  badgeVariant: "green" | "blue" | "cyan" | "muted";
  accent: Accent;
}) {
  const accentBar = {
    blue: "bg-[#3b82f6]",
    indigo: "bg-[#6366f1]",
    cyan: "bg-[#22d3ee]",
    green: "bg-[#22c55e]",
  }[accent];

  const badgeClass = {
    green: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    blue: "border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#93c5fd]",
    cyan: "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    muted: "border border-[#141428] bg-[#0a0a18] text-[#9ca3af]",
  }[badgeVariant];

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#141428] bg-[#0a0a18] p-5 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
        {label}
      </p>
      <div className="mt-2 flex items-start justify-between gap-2">
        <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">{value}</p>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold sm:text-xs ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${accentBar}`} aria-hidden />
    </div>
  );
}

export default function InfluencerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [progressData, setProgressData] = useState(() => buildWeekSeries(0));

  const fetchUser = async () => {
    try {
      const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
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
      console.error("Error fetching user:", err);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && isProfileComplete === false) {
      router.replace("/dashboard/influencer/profile");
    }
  }, [loading, isProfileComplete, router]);

  const fullName = useMemo(() => {
    if (!user?.details) return user?.name || "";
    const first = user.details.firstName || "";
    const last = user.details.lastName || "";
    return `${first} ${last}`.trim() || user?.name || "";
  }, [user]);

  const niche = user?.details?.niche || [];
  const estimatedRate = user?.details?.estimatedRate || "Not specified";
  const socials = user?.details?.socials || {};
  const instagramFollowers = socials.instagram?.followers || "0";
  const youtubeSubscribers = socials.youtube?.subscribers || "0";
  const facebookFollowers = socials.facebook?.followers || "0";
  const twitterFollowers = socials.twitter?.followers || "0";
  const instagramUser = socials.instagram?.username || "";
  const youtubeChannel = socials.youtube?.channel || "";
  const facebookUser = socials.facebook?.username || "";
  const twitterUser = socials.twitter?.username || "";

  const socialMediaData = useMemo(
    () => [
      { name: "Instagram", value: parseFollowers(instagramFollowers), color: "#E1306C" },
      { name: "YouTube", value: parseFollowers(youtubeSubscribers), color: "#FF4500" },
      { name: "Facebook", value: parseFollowers(facebookFollowers), color: "#1877F2" },
      { name: "Twitter", value: parseFollowers(twitterFollowers), color: "#38bdf8" },
    ],
    [instagramFollowers, youtubeSubscribers, facebookFollowers, twitterFollowers]
  );

  const totalReach = socialMediaData.reduce((s, d) => s + d.value, 0);
  const totalReachStr =
    totalReach >= 1000000
      ? `${(totalReach / 1000000).toFixed(1)}M`
      : totalReach >= 1000
        ? `${(totalReach / 1000).toFixed(1)}K`
        : String(Math.round(totalReach));

  const defaultPieData = [
    { name: "Instagram", value: 1, color: "#E1306C" },
    { name: "YouTube", value: 1, color: "#FF4500" },
    { name: "Facebook", value: 1, color: "#1877F2" },
    { name: "Twitter", value: 1, color: "#38bdf8" },
  ];
  const pieData = socialMediaData.some((d) => d.value > 0) ? socialMediaData : defaultPieData;

  const syncSeriesFromReach = useCallback((reach: number) => {
    setProgressData(buildWeekSeries(reach));
  }, []);

  useEffect(() => {
    if (!isProfileComplete || !user) return;
    const tr = socialMediaData.reduce((s, d) => s + d.value, 0);
    syncSeriesFromReach(tr);
  }, [isProfileComplete, user, socialMediaData, syncSeriesFromReach]);

  useEffect(() => {
    if (!isProfileComplete) return;
    const interval = setInterval(() => {
      setProgressData((prev) =>
        prev.map((d) => ({
          ...d,
          reach: Math.max(5000, Math.round(d.reach + (Math.random() * 5000 - 2500))),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isProfileComplete]);

  const yDomain = useMemo(() => {
    const vals = progressData.map((d) => d.reach);
    if (!vals.length) return [0, 100_000] as [number, number];
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const span = Math.max(maxV - minV, maxV * 0.08, 20_000);
    const pad = span * 0.12;
    const lo = Math.floor((minV - pad) / 5000) * 5000;
    const hi = Math.ceil((maxV + pad) / 5000) * 5000;
    if (hi <= lo) return [Math.max(0, lo - 50_000), lo + 50_000] as [number, number];
    return [Math.max(0, lo), hi] as [number, number];
  }, [progressData]);

  const displayName = fullName || "Influencer";
  const handleSlug =
    instagramUser ||
    twitterUser ||
    (user?.email ? String(user.email).split("@")[0] : "") ||
    "creator";
  const handleDisplay = `@${String(handleSlug).replace(/^@/, "")}`;

  const avatarLetter = (displayName || "U").trim().charAt(0).toUpperCase();
  const avatarBg = getAvatarBackgroundColorFromName(displayName);

  const rateDisplay =
    estimatedRate && estimatedRate !== "Not specified"
      ? String(estimatedRate).trim().startsWith("$")
        ? String(estimatedRate).trim()
        : `$${String(estimatedRate).trim()}`
      : "—";

  const platformGrowth = ["+8%", "+15%", "+5%", "+12%"];

  return (
    <div className="relative w-full min-h-0 text-[#e5e7eb]">
      <main className="relative z-10 w-full pb-10">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Influencer Dashboard
              </h1>
              <p className="mt-1.5 text-sm font-medium text-[#9ca3af]">
                Your overview and performance metrics
              </p>
            </div>
            {niche.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {niche.map((n: string) => (
                  <span
                    key={n}
                    className="rounded-full border border-[#3b82f6]/35 bg-[#0a0a18] px-3 py-1 text-xs font-semibold text-[#93c5fd]"
                  >
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* <div className="text-right">
              <p className="text-sm font-bold text-white">{displayName}</p>
              <p className="text-xs text-[#6b7280]">{handleDisplay}</p>
            </div> */}
            {/* <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white shadow-lg ring-2 ring-[#3b82f6]/40"
              style={{ backgroundColor: avatarBg }}
            >
              {avatarLetter}
            </div> */}
            {userId ? (
              <NotificationBell userId={userId} variant="header" theme="dark" />
            ) : null}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent" />
              <p className="text-sm font-medium text-[#9ca3af]">Loading dashboard…</p>
            </div>
          </div>
        ) : !isProfileComplete ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total reach"
                value={totalReachStr}
                accent="blue"
                badgeVariant="green"
                badge={
                  <>
                    <TrendingUp className="size-3" strokeWidth={2.5} />
                    +12%
                  </>
                }
              />
              <MetricCard
                label="Est. rate"
                value={estimatedRate !== "Not specified" ? rateDisplay : "—"}
                accent="indigo"
                badgeVariant="blue"
                badge={<>Per campaign</>}
              />
              <MetricCard
                label="Content niches"
                value={String(niche.length || 0)}
                accent="cyan"
                badgeVariant="cyan"
                badge={<>Active niches</>}
              />
              <MetricCard
                label="Profile status"
                value={user?.isBlocked ? "Limited" : "Active"}
                accent="green"
                badgeVariant="green"
                badge={
                  user?.profileComplete ? (
                    <>
                      <Check className="size-3" strokeWidth={2.5} />
                      Verified
                    </>
                  ) : (
                    <>In progress</>
                  )
                }
              />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#141428] bg-[#0a0a18] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white sm:text-lg">Influencer progress</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
                <div className="h-[280px] w-full sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="reachAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                          <stop offset="55%" stopColor="#2563eb" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#060d24" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="#141428"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={yDomain}
                        tickFormatter={formatAxisTick}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={44}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0a0a18",
                          border: "1px solid #141428",
                          borderRadius: "12px",
                          color: "#e5e7eb",
                        }}
                        formatter={(v: number | undefined) =>
                          v != null ? [formatReachShort(v), "Reach"] : ["—", "Reach"]
                        }
                      />
                      <Area
                        type="natural"
                        dataKey="reach"
                        stroke="none"
                        fill="url(#reachAreaFill)"
                        fillOpacity={1}
                      />
                      <Line
                        type="natural"
                        dataKey="reach"
                        stroke="#60a5fa"
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: "#0a0a18",
                          stroke: "#93c5fd",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-[#141428] bg-[#0a0a18] p-5 sm:p-6">
                <h3 className="mb-4 text-base font-bold text-white sm:text-lg">Social media reach</h3>
                <div className="relative mx-auto h-[220px] max-w-[280px] sm:h-[240px] sm:max-w-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="82%"
                        paddingAngle={3}
                        stroke="#0a0a18"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0a0a18",
                          border: "1px solid #141428",
                          borderRadius: "12px",
                          color: "#e5e7eb",
                        }}
                        formatter={(value: number | undefined) =>
                          value != null ? formatReachShort(value) : "0"
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
                    <span className="text-2xl font-black leading-none text-white sm:text-3xl">
                      {totalReachStr}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
                      Total
                    </span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="min-w-0 flex-1 truncate font-medium text-[#9ca3af]">
                        {entry.name}{" "}
                        <span className="font-bold text-white">
                          {formatReachShort(entry.value)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                Platforms
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Instagram",
                    icon: Instagram,
                    handle: instagramUser ? `@${instagramUser.replace(/^@/, "")}` : "—",
                    metric: instagramFollowers,
                    suffix: "followers",
                    tint: "from-pink-600/25 to-[#0a0a18]",
                    growth: platformGrowth[0],
                  },
                  {
                    label: "YouTube",
                    icon: Youtube,
                    handle: youtubeChannel || "—",
                    metric: youtubeSubscribers,
                    suffix: "subscribers",
                    tint: "from-red-600/25 to-[#0a0a18]",
                    growth: platformGrowth[1],
                  },
                  {
                    label: "Facebook",
                    icon: Facebook,
                    handle: facebookUser || "—",
                    metric: facebookFollowers,
                    suffix: "followers",
                    tint: "from-blue-600/25 to-[#0a0a18]",
                    growth: platformGrowth[2],
                  },
                  {
                    label: "Twitter",
                    icon: Twitter,
                    handle: twitterUser ? `@${twitterUser.replace(/^@/, "")}` : "—",
                    metric: twitterFollowers,
                    suffix: "followers",
                    tint: "from-sky-600/25 to-[#0a0a18]",
                    growth: platformGrowth[3],
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="flex flex-col rounded-2xl border border-[#141428] bg-[#0a0a18] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl bg-linear-to-br ${p.tint} border border-white/5`}
                      >
                        <p.icon className="size-5 text-white" strokeWidth={1.75} />
                      </div>
                      <span className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        {p.growth}
                      </span>
                    </div>
                    <p className="truncate text-sm font-bold text-white">{p.handle}</p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      <span className="font-semibold text-[#9ca3af]">{p.metric || "0"}</span>{" "}
                      {p.suffix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
