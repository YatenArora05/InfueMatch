"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import axios from "axios";
import InfluencerCard from "@/components/brand/InfluencerCard";

interface Influencer {
  id: string;
  name: string;
  niche: string;
  niches?: string[];
  followers: string;
  rate: string;
  profilePic?: string | null;
  email?: string;
}

const AVAILABLE_NICHES = ["Sports", "Tech", "Fashion", "Coding", "Food", "Travel"];

function parseFollowers(value: string): number {
  if (!value || value === "0") return 0;
  const cleaned = value.replace(/,/g, "").replace(/\$/g, "").trim();
  if (cleaned.toLowerCase().endsWith("k")) {
    return parseFloat(cleaned.toLowerCase().replace("k", "")) * 1000;
  }
  if (cleaned.toLowerCase().endsWith("m")) {
    return parseFloat(cleaned.toLowerCase().replace("m", "")) * 1000000;
  }
  return parseFloat(cleaned) || 0;
}

/** Best-effort single number from rate strings like "$500 - $1000" or "7154" */
function parseRateRough(rate: string): number | null {
  if (!rate || /not specified/i.test(rate)) return null;
  const nums = rate.match(/\d[\d,]*/g);
  if (!nums?.length) return null;
  return Math.max(...nums.map((n) => parseInt(n.replace(/,/g, ""), 10)));
}

type FollowersTier = "" | "1k" | "10k" | "100k";
type RateTier = "" | "under5k" | "5k-25k" | "25kplus";
type SortKey = "best" | "name" | "followers";
type TimeFilter = "" | "week" | "month";

function pillSelectClass() {
  return [
    "h-10 min-w-0 max-w-full cursor-pointer appearance-none rounded-full border border-[#3a3d46] bg-[#0f1115] py-2 pl-3 pr-9 text-left text-[13px] font-medium text-[#E5E7EB]",
    "outline-none transition-colors hover:border-[#4b5563] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40",
  ].join(" ");
}

export default function FindInfluencer() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [followersTier, setFollowersTier] = useState<FollowersTier>("");
  const [rateTier, setRateTier] = useState<RateTier>("");
  const [sortBy, setSortBy] = useState<SortKey>("best");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/influencers");
        if (response.data?.influencers) {
          setInfluencers(response.data.influencers);
        }
      } catch (error) {
        console.error("Error fetching influencers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (searchQuery.trim()) n += 1;
    if (selectedNiche) n += 1;
    if (followersTier) n += 1;
    if (rateTier) n += 1;
    if (sortBy !== "best") n += 1;
    return n;
  }, [searchQuery, selectedNiche, followersTier, rateTier, sortBy]);

  const filteredInfluencers = useMemo(() => {
    const minFollowers =
      followersTier === "1k" ? 1000 : followersTier === "10k" ? 10000 : followersTier === "100k" ? 100000 : 0;

    let list = influencers.filter((influencer) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        influencer.name.toLowerCase().includes(query) ||
        influencer.niche.toLowerCase().includes(query) ||
        (influencer.niches && influencer.niches.some((n) => n.toLowerCase().includes(query)));

      const matchesNiche =
        !selectedNiche ||
        influencer.niche.toLowerCase() === selectedNiche.toLowerCase() ||
        (influencer.niches &&
          influencer.niches.some((n) => n.toLowerCase() === selectedNiche.toLowerCase()));

      const f = parseFollowers(influencer.followers || "0");
      const matchesFollowers = !followersTier || f >= minFollowers;

      const r = parseRateRough(influencer.rate || "");
      let matchesRate = true;
      if (rateTier && r !== null) {
        if (rateTier === "under5k") matchesRate = r < 5000;
        else if (rateTier === "5k-25k") matchesRate = r >= 5000 && r < 25000;
        else if (rateTier === "25kplus") matchesRate = r >= 25000;
      } else if (rateTier && r === null) {
        matchesRate = false;
      }

      return matchesSearch && matchesNiche && matchesFollowers && matchesRate;
    });

    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "followers") {
      list = [...list].sort((a, b) => parseFollowers(b.followers) - parseFollowers(a.followers));
    }

    return list;
  }, [influencers, searchQuery, selectedNiche, followersTier, rateTier, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedNiche("");
    setFollowersTier("");
    setRateTier("");
    setSortBy("best");
    setTimeFilter("");
  };

  const filterChips = useMemo(() => {
    const items: { key: string; label: string }[] = [];
    const q = searchQuery.trim();
    if (q) items.push({ key: "search", label: q });
    if (selectedNiche) items.push({ key: "niche", label: selectedNiche });
    if (followersTier === "1k") items.push({ key: "followers", label: "1K+ followers" });
    if (followersTier === "10k") items.push({ key: "followers", label: "10K+ followers" });
    if (followersTier === "100k") items.push({ key: "followers", label: "100K+ followers" });
    if (timeFilter === "week") items.push({ key: "time", label: "This week" });
    if (timeFilter === "month") items.push({ key: "time", label: "This month" });
    if (rateTier === "under5k") items.push({ key: "rate", label: "Under $5k" });
    if (rateTier === "5k-25k") items.push({ key: "rate", label: "$5k – $25k" });
    if (rateTier === "25kplus") items.push({ key: "rate", label: "$25k+" });
    if (sortBy === "name") items.push({ key: "sort", label: "Name A–Z" });
    if (sortBy === "followers") items.push({ key: "sort", label: "Followers (high)" });
    return items;
  }, [searchQuery, selectedNiche, followersTier, rateTier, sortBy, timeFilter]);

  const removeChip = useCallback((key: string) => {
    if (key === "search") setSearchQuery("");
    else if (key === "niche") setSelectedNiche("");
    else if (key === "followers") setFollowersTier("");
    else if (key === "time") setTimeFilter("");
    else if (key === "rate") setRateTier("");
    else if (key === "sort") setSortBy("best");
  }, []);

  return (
    <div className="brand-find-influencer-page space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #brand-find-influencer-search,
        #brand-find-influencer-search:-webkit-autofill,
        #brand-find-influencer-search:-webkit-autofill:hover,
        #brand-find-influencer-search:-webkit-autofill:focus,
        #brand-find-influencer-search:-webkit-autofill:active {
          color: #e5e7eb !important;
          -webkit-text-fill-color: #e5e7eb !important;
          box-shadow: 0 0 0 1000px #1a1d21 inset !important;
        }
      `,
        }}
      />

      <LayoutGroup>
        <div className="mx-5 mt-5 flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-stretch gap-3">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 z-10 size-[18px] -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={1.75}
                aria-hidden
              />
              <input
                id="brand-find-influencer-search"
                type="text"
                placeholder="Search creators, niches, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-[#1A1D21] py-3 pl-11 pr-4 text-[15px] text-[#E5E7EB] shadow-none outline-none ring-0 placeholder:text-[#9CA3AF] focus-visible:ring-2 focus-visible:ring-white/10"
              />
            </div>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-label={showFilters ? "Close filters" : "Open filters"}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A1D21] text-white transition-colors hover:bg-[#252830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
              >
                <SlidersHorizontal className="size-5" strokeWidth={1.75} />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[11px] font-bold leading-none text-white">
                    {activeFilterCount > 9 ? "9+" : activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false} mode="sync">
            {filterChips.length > 0 && (
              <motion.div
                key="filter-chips-row"
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-0.5 pt-0">
                  <AnimatePresence initial={false} mode="popLayout">
                    {filterChips.map((chip) => (
                      <motion.span
                        layout
                        key={`${chip.key}-${chip.label}`}
                        initial={{ opacity: 0, y: -8, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#3a3d46] bg-[#1A1D21] py-1.5 pl-3 pr-1 text-sm font-medium text-[#F8FAFC] shadow-sm"
                      >
                        <span className="min-w-0 truncate">{chip.label}</span>
                        <button
                          type="button"
                          onClick={() => removeChip(chip.key)}
                          className="flex shrink-0 rounded-full p-1 text-[#9CA3AF] transition-colors hover:bg-white/10 hover:text-white"
                          aria-label={`Remove ${chip.label}`}
                        >
                          <X className="size-3.5" strokeWidth={2.5} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {showFilters && (
          <div className="rounded-xl border border-[#2a2d35] bg-[#1a1c20] px-3 py-3 sm:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
              <div className="relative min-w-[140px] flex-1 sm:min-w-[160px]">
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className={pillSelectClass() + " w-full"}
                  aria-label="Niche"
                >
                  <option value="">All niches</option>
                  {AVAILABLE_NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <div className="relative min-w-[140px] flex-1 sm:min-w-[160px]">
                <select
                  value={followersTier}
                  onChange={(e) => setFollowersTier(e.target.value as FollowersTier)}
                  className={pillSelectClass() + " w-full"}
                  aria-label="Followers"
                >
                  <option value="">All audiences</option>
                  <option value="1k">1K+ followers</option>
                  <option value="10k">10K+ followers</option>
                  <option value="100k">100K+ followers</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <div className="relative min-w-[140px] flex-1 sm:min-w-[160px]">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                  className={pillSelectClass() + " w-full"}
                  aria-label="Time"
                >
                  <option value="">Any time</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <div className="relative min-w-[140px] flex-1 sm:min-w-[160px]">
                <select
                  value={rateTier}
                  onChange={(e) => setRateTier(e.target.value as RateTier)}
                  className={pillSelectClass() + " w-full"}
                  aria-label="Estimated rate"
                >
                  <option value="">Any budget</option>
                  <option value="under5k">Under $5k</option>
                  <option value="5k-25k">$5k – $25k</option>
                  <option value="25kplus">$25k+</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <div className="relative min-w-[140px] flex-1 sm:min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className={pillSelectClass() + " w-full"}
                  aria-label="Sort"
                >
                  <option value="best">Best match</option>
                  <option value="name">Name A–Z</option>
                  <option value="followers">Followers (high)</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="flex shrink-0 items-center gap-1.5 self-center text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#E5E7EB] lg:ml-auto"
              >
                <X className="size-4" strokeWidth={2} aria-hidden />
                Clear all
              </button>
            </div>
          </div>
            )}
          </motion.div>
        </div>
      </LayoutGroup>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent"></div>
            <p className="font-medium text-[#9CA3AF]">Loading influencers...</p>
          </div>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg font-medium text-[#9CA3AF]">
              {searchQuery || selectedNiche || followersTier || rateTier || sortBy !== "best" || timeFilter
                ? "No influencers found matching your search or filter criteria."
                : "No influencers available at the moment."}
            </p>
            {(searchQuery || selectedNiche || followersTier || rateTier || sortBy !== "best" || timeFilter) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 rounded-lg border border-[#3B82F6]/30 px-4 py-2 text-sm font-medium text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/10"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-5 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:mx-auto xl:max-w-[1600px]">
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              id={influencer.id}
              name={influencer.name}
              niche={influencer.niche}
              followers={influencer.followers}
              rate={influencer.rate}
              profilePic={influencer.profilePic}
            />
          ))}
        </div>
      )}
    </div>
  );
}
