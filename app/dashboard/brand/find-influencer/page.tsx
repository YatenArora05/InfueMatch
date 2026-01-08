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
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-lg mt-5 ml-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search creators by niche or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>
        <div className="relative mt-5 mr-5">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-purple-50 transition-all shadow-sm"
          >
            <Filter size={18} /> {showFilters ? 'Hide Filters' : 'More Filters'}
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-6 z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filter by Niche</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedNiche('')}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedNiche === ''
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
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
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              {selectedNiche && (
                <button
                  onClick={() => setSelectedNiche('')}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
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
          <span className="text-sm text-gray-600 font-medium">Active Filter:</span>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-bold text-sm">
            {selectedNiche}
            <button
              onClick={() => setSelectedNiche('')}
              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading influencers...</p>
          </div>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-500 font-medium text-lg">
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
                className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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