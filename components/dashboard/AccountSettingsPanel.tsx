"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

type UserPayload = {
  name?: string;
  email?: string;
  role?: string;
};

function formatRole(role: string | undefined) {
  if (!role) return "—";
  const r = role.toLowerCase();
  if (r === "influencer") return "Influencer";
  if (r === "brand") return "Brand";
  if (r === "admin") return "Admin";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function SettingsRow({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 md:py-4 first:pt-0 last:pb-0 border-b border-[#1F2937]/80 last:border-0">
      <span className="text-sm text-[#9CA3AF] shrink-0">{label}</span>
      <span className={`text-sm text-right font-medium break-all ${valueClassName ?? "text-[#E5E7EB]"}`}>{value}</span>
    </div>
  );
}

export default function AccountSettingsPanel() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!storedId) {
      setError("No account session found. Please sign in again.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/api/user?id=${storedId}`);
        const u = res.data?.user;
        if (cancelled) return;
        if (!u) {
          setError("Could not load your profile.");
          return;
        }
        setUser({
          name: u.name ?? "—",
          email: u.email ?? "—",
          role: u.role,
        });
      } catch {
        if (!cancelled) setError("Could not load your profile. Try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full ">
      <h1 className="text-2xl md:text-3xl font-bold text-[#E5E7EB] tracking-tight mb-6 md:mb-8">Settings</h1>

      {loading && (
        <div className="flex items-center justify-center py-20 rounded-2xl border border-[#1F2937] bg-[#0B1120]/60 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" aria-hidden />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-4 text-sm text-red-400">{error}</div>
      )}

      {!loading && !error && user && (
        <div
          className="rounded-2xl border border-[#1F2937] bg-gradient-to-br from-[#0B1120]/90 via-[#020617]/95 to-[#0F172A]/90 backdrop-blur-xl px-5 py-5 md:px-8 md:py-6 shadow-xl shadow-blue-950/20"
          style={{
            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.06), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <SettingsRow label="Name" value={user.name || "—"} />
          <SettingsRow label="Email" value={user.email || "—"} />
          <SettingsRow
            label="Role"
            value={formatRole(user.role).toUpperCase()}
            valueClassName="inline-block bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent font-bold tracking-wide"
          />
        </div>
      )}
    </div>
  );
}
