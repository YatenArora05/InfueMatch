"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, Clock, Globe } from "lucide-react";
import { getAvatarBackgroundColorFromName } from "@/lib/utils";
import { dispatchBrandSavedInfluencersChanged } from "@/lib/brandSavedEvents";
import axios from "axios";
import InfluencerProfileModal from "./InfluencerProfileModal";

interface InfluencerCardProps {
  id: string;
  name: string;
  niche: string;
  followers: string;
  rate: string;
  profilePic?: string | null;
  platform?: string;
  color?: string;
  /** e.g. "4d ago" */
  postedAt?: string;
  tags?: string[];
  showHiddenGem?: boolean;
  shortlistMatch?: "Low" | "Medium" | "High";
  viewedToday?: number;
  /** When provided, bookmark reflects saved state (e.g. from parent batch fetch). */
  initialSaved?: boolean;
}

function formatNumberish(value: string): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "0";
  const n = raw.replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(n)) return raw;
  return Number(n).toLocaleString("en-US");
}

export default function InfluencerCard({
  id,
  name,
  niche,
  followers,
  rate,
  profilePic,
  color,
  postedAt = "4d ago",
  tags,
  showHiddenGem = false,
  initialSaved = false,
}: InfluencerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saveBusy, setSaveBusy] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved, id]);

  const initial = (name || "U").trim().charAt(0).toUpperCase();

  const accentColor = color || getAvatarBackgroundColorFromName(name);

  const displayTags = useMemo(() => {
    if (tags?.length) return tags;
    return ["Instagram", "YouTube", "X", "Facebook"];
  }, [tags]);

  const nicheLine = niche?.trim() || "No niche specified";

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId || saveBusy) return;
    const next = !isSaved;
    setSaveBusy(true);
    try {
      await axios.post("/api/brand/saved-influencers", {
        userId,
        influencerId: id,
        save: next,
      });
      setIsSaved(next);
      dispatchBrandSavedInfluencersChanged();
    } catch {
      setIsSaved(!next);
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <>
      <div className="relative w-full min-w-0 rounded-2xl border border-[#2d2f3d] bg-[#1a1b26] p-6 shadow-sm transition-colors hover:border-[#3f4254]">
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save influencer"}
          aria-pressed={isSaved}
          disabled={saveBusy}
          onClick={toggleSave}
          className={`absolute right-5 top-5 rounded-lg p-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 ${
            isSaved ? "text-[#60A5FA]" : "text-[#9CA3AF] hover:text-[#E5E7EB]"
          }`}
        >
          <Bookmark className="h-5 w-5" strokeWidth={1.75} fill={isSaved ? "currentColor" : "none"} />
        </button>

        <div className="flex gap-4 pr-10">
          <div
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
            style={
              profilePic
                ? { boxShadow: `0 0 0 2px ${accentColor}99` }
                : { backgroundColor: accentColor }
            }
          >
            {profilePic ? (
              <img src={profilePic} className="h-full w-full object-cover" alt="" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                {initial}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <h4 className="text-lg font-bold leading-tight tracking-tight text-white">{name}</h4>
            <div className="flex items-start gap-2 text-sm text-[#9CA3AF]">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" strokeWidth={1.75} />
              <span className="leading-snug">{nicheLine}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Clock className="h-4 w-4 shrink-0 text-[#6B7280]" strokeWidth={1.75} />
              <span>{postedAt}</span>
            </div>
          </div>
        </div>

        <div className="my-5 border-t border-[#2d2f3d]" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
              Instagram Followers
            </p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-white">
              {formatNumberish(followers || "0")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
              Est. Rate
            </p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-white">
              {formatNumberish(rate || "0")}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {displayTags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="rounded-full border border-[#3f4254] bg-[#14151f] px-3 py-1 text-xs font-medium text-[#E5E7EB]"
            >
              {t}
            </span>
          ))}
          {showHiddenGem && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#7C3AED]/60 bg-[#5B21B6]/35 px-3 py-1 text-xs font-semibold text-[#EDE9FE]">
              <span aria-hidden className="text-[10px]">
                ✦
              </span>
              Hidden Gem
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full rounded-xl border border-[#3f4254] bg-transparent py-3 text-sm font-semibold text-white transition-colors hover:border-[#6B7280] hover:bg-white/4 active:scale-[0.99]"
        >
          View Profile
        </button>
      </div>

      <InfluencerProfileModal influencerId={id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
