"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import InfluencerCard from '@/components/brand/InfluencerCard';

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

const AVAILABLE_NICHES = ['Sports', 'Tech', 'Fashion', 'Coding', 'Food', 'Travel'];

export default function FindInfluencer() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/influencers');
        if (response.data?.influencers) {
          setInfluencers(response.data.influencers);
        }
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  // Filter influencers based on search query and selected niche
  const filteredInfluencers = influencers.filter((influencer) => {
    // Search filter (name or niche)
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || (
      influencer.name.toLowerCase().includes(query) ||
      influencer.niche.toLowerCase().includes(query) ||
      (influencer.niches && influencer.niches.some(n => n.toLowerCase().includes(query)))
    );

    // Niche filter
    const matchesNiche = !selectedNiche || (
      influencer.niche.toLowerCase() === selectedNiche.toLowerCase() ||
      (influencer.niches && influencer.niches.some(n => n.toLowerCase() === selectedNiche.toLowerCase()))
    );

    return matchesSearch && matchesNiche;
  });

  return (
    <div className="brand-find-influencer-page space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <style dangerouslySetInnerHTML={{ __html: `
        #brand-find-influencer-search,
        #brand-find-influencer-search:-webkit-autofill,
        #brand-find-influencer-search:-webkit-autofill:hover,
        #brand-find-influencer-search:-webkit-autofill:focus,
        #brand-find-influencer-search:-webkit-autofill:active {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }
      `}} />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-lg mt-5 ml-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input 
            id="brand-find-influencer-search"
            type="text" 
            placeholder="Search creators by niche or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            className="w-full pl-12 pr-4 py-4 bg-[#0B1120] border border-[#1F2937] rounded-2xl shadow-lg shadow-blue-900/10 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-white placeholder-[#9CA3AF]"
          />
        </div>
        <div className="relative mt-5 mr-5">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-4 bg-[#0B1120] border border-[#1F2937] rounded-2xl font-bold text-[#E5E7EB] hover:bg-[#3B82F6] hover:text-white transition-all shadow-lg shadow-blue-900/10"
          >
            <Filter size={18} /> {showFilters ? 'Hide Filters' : 'More Filters'}
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#020617]/95 backdrop-blur-xl border border-[#1F2937] rounded-2xl shadow-xl shadow-blue-900/20 p-6 z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#E5E7EB]">Filter by Niche</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-[#0B1120] rounded-lg transition-colors text-[#9CA3AF] hover:text-[#E5E7EB]"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedNiche('')}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedNiche === ''
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-900/30'
                      : 'bg-[#0B1120] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB] border border-[#1F2937]'
                  }`}
                >
                  All Niches
                </button>
                {AVAILABLE_NICHES.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`w-full text-left px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedNiche === niche
                        ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-900/30'
                        : 'bg-[#0B1120] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB] border border-[#1F2937]'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              {selectedNiche && (
                <button
                  onClick={() => setSelectedNiche('')}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-xl transition-colors border border-[#3B82F6]/30"
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Badge */}
      {selectedNiche && (
        <div className="flex items-center gap-2 ml-5">
          <span className="text-sm text-[#9CA3AF] font-medium">Active Filter:</span>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30 rounded-lg font-bold text-sm">
            {selectedNiche}
            <button
              onClick={() => setSelectedNiche('')}
              className="hover:bg-[#3B82F6]/30 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#9CA3AF] font-medium">Loading influencers...</p>
          </div>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-[#9CA3AF] font-medium text-lg">
              {searchQuery || selectedNiche 
                ? 'No influencers found matching your search or filter criteria.' 
                : 'No influencers available at the moment.'}
            </p>
            {(searchQuery || selectedNiche) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedNiche('');
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors border border-[#3B82F6]/30"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-5">
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