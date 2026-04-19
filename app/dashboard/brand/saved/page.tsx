"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import InfluencerCard from "@/components/brand/InfluencerCard";
import { BRAND_SAVED_INFLUENCERS_EVENT } from "@/lib/brandSavedEvents";

type Influencer = {
  id: string;
  name: string;
  niche: string;
  followers: string;
  rate: string;
  profilePic?: string | null;
};

export default function BrandSavedInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      setInfluencers([]);
      setSavedIds([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`/api/brand/saved-influencers?userId=${userId}`);
      setInfluencers(res.data?.influencers || []);
      setSavedIds(res.data?.savedIds || []);
    } catch {
      setInfluencers([]);
      setSavedIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onChange = () => load();
    window.addEventListener(BRAND_SAVED_INFLUENCERS_EVENT, onChange);
    return () => window.removeEventListener(BRAND_SAVED_INFLUENCERS_EVENT, onChange);
  }, [load]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#E5E7EB] md:text-3xl">Saved creators</h1>
        <p className="mt-1 text-sm text-[#9CA3AF]">Influencers you bookmarked from Find Influencer.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-12 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent" />
        </div>
      ) : influencers.length === 0 ? (
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B1120]/80 px-6 py-16 text-center">
          <p className="text-[#9CA3AF]">No saved creators yet. Use the bookmark on a card in Find Influencer.</p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:mx-auto xl:max-w-[1600px]">
          {influencers.map((inf) => (
            <InfluencerCard
              key={inf.id}
              id={inf.id}
              name={inf.name}
              niche={inf.niche}
              followers={inf.followers}
              rate={inf.rate}
              profilePic={inf.profilePic}
              initialSaved={savedIds.includes(inf.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
