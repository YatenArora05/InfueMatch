"use client";

import React, { useState } from 'react';
import { Search, Globe, Instagram, Twitter, CheckCircle, Filter, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

// 1. Hardcoded Brand Data with official SimpleIcons slugs
const BRANDS_DATA = [
  { id: 1, name: "Nike", slug: "nike", category: "Sports", budget: "$5k - $10k", followers: "50k+", color: "#000000" },
  { id: 2, name: "Apple", slug: "apple", category: "Tech", budget: "$20k+", followers: "100k+", color: "#555555" },
  { id: 3, name: "Samsung", slug: "samsung", category: "Tech", budget: "$10k - $15k", followers: "75k+", color: "#1428a0" },
  { id: 4, name: "Adidas", slug: "adidas", category: "Sports", budget: "$4k - $8k", followers: "40k+", color: "#000000" },
  { id: 5, name: "Spotify", slug: "spotify", category: "Media", budget: "$3k - $7k", followers: "30k+", color: "#1DB954" },
  { id: 6, name: "Adobe", slug: "adobe", category: "Software", budget: "$8k - $12k", followers: "60k+", color: "#FF0000" },
  { id: 7, name: "Tesla", slug: "tesla", category: "Auto", budget: "$15k - $25k", followers: "120k+", color: "#E31937" },
  { id: 8, name: "Airbnb", slug: "airbnb", category: "Travel", budget: "$5k - $9k", followers: "55k+", color: "#FF5A5F" },
  { id: 9, name: "Coca-Cola", slug: "cocacola", category: "Food", budget: "$10k+", followers: "80k+", color: "#F40009" },
  { id: 10, name: "Sony", slug: "sony", category: "Tech", budget: "$7k - $12k", followers: "50k+", color: "#000000" },
  { id: 11, name: "Red Bull", slug: "redbull", category: "Energy", budget: "$6k - $10k", followers: "45k+", color: "#000B47" },
  { id: 12, name: "Zara", slug: "zara", category: "Fashion", budget: "$2k - $5k", followers: "25k+", color: "#000000" },
  { id: 13, name: "Lululemon", slug: "lululemon", category: "Fitness", budget: "$4k - $7k", followers: "35k+", color: "#D3151A" },
  { id: 14, name: "Amazon", slug: "amazon", category: "E-commerce", budget: "$15k+", followers: "90k+", color: "#FF9900" },
  { id: 15, name: "Netflix", slug: "netflix", category: "Media", budget: "$12k - $18k", followers: "110k+", color: "#E50914" }
];

export default function BrandDetailsPage() {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  const filteredBrands = BRANDS_DATA.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to generate the SVG URL from SimpleIcons
  const getBrandSvg = (slug: string, color: string) => {
    // We use 'cdn.simpleicons.org' to get the clean SVG path
    return `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-4 lg:gap-6 overflow-hidden">
      
      {/* MOBILE BRAND SELECTOR BUTTON */}
      <div className="lg:hidden flex items-center gap-3 p-4 bg-[#0B1220]/90 rounded-2xl border border-[#1F2937] shadow-xl shadow-blue-900/10">
        <button
          onClick={() => setIsMobileListOpen(true)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1F2937] flex items-center justify-center p-2">
            <img src={getBrandSvg(selectedBrand.slug, selectedBrand.color)} alt={selectedBrand.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-[#E5E7EB]">{selectedBrand.name}</p>
            <p className="text-[10px] uppercase font-bold tracking-tighter text-[#9CA3AF]">{selectedBrand.category}</p>
          </div>
          <Filter size={18} className="text-[#9CA3AF]" />
        </button>
      </div>

      {/* MOBILE BRAND LIST OVERLAY */}
      {isMobileListOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileListOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-80 bg-[#0F0F0F] border-r border-[#1F2937] z-50 shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-[#1F2937]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-[#E5E7EB]">Brand Directory</h2>
                <button
                  onClick={() => setIsMobileListOpen(false)}
                  className="p-2 text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search 15+ Brands..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1F2937] rounded-xl text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/50 transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Directory</span>
                <Filter size={14} className="text-[#9CA3AF]" />
              </div>
            </div>
            <div className="p-2 space-y-1">
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setIsMobileListOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                    selectedBrand.id === brand.id 
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${selectedBrand.id === brand.id ? 'bg-white/20' : 'bg-[#1F2937]'}`}>
                    <img src={getBrandSvg(brand.slug, selectedBrand.id === brand.id ? brand.color : '9ca3af')} alt={brand.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm leading-none mb-1">{brand.name}</p>
                    <p className={`text-[10px] uppercase font-bold tracking-tighter ${selectedBrand.id === brand.id ? 'text-blue-200' : 'text-[#9CA3AF]'}`}>
                      {brand.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* MASTER LIST (Left) - Desktop Only */}
      <div className="hidden lg:flex w-80 flex-col bg-[#0B1220]/90 rounded-[2.5rem] border border-[#1F2937] shadow-xl shadow-blue-900/10 overflow-hidden shrink-0">
        <div className="p-5 border-b border-[#1F2937]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
            <input 
              type="text" 
              placeholder="Search 15+ Brands..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-[#1F2937] rounded-2xl text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Directory</span>
            <Filter size={14} className="text-[#9CA3AF]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                selectedBrand.id === brand.id 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30' 
                : 'hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${selectedBrand.id === brand.id ? 'bg-white/20' : 'bg-[#1F2937]'}`}>
                <img src={getBrandSvg(brand.slug, selectedBrand.id === brand.id ? brand.color : '9ca3af')} alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm leading-none mb-1">{brand.name}</p>
                <p className={`text-[10px] uppercase font-bold tracking-tighter ${selectedBrand.id === brand.id ? 'text-blue-200' : 'text-[#9CA3AF]'}`}>
                  {brand.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL VIEW (Right) */}
      <div className="flex-1 bg-[#0B1220]/90 backdrop-blur-sm rounded-2xl lg:rounded-[2.5rem] border border-[#1F2937] shadow-xl shadow-blue-900/10 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10 relative min-w-0">
        <div className="hidden lg:block absolute top-10 right-10 opacity-[0.06] scale-[4] pointer-events-none overflow-hidden">
            <img src={getBrandSvg(selectedBrand.slug, '3B82F6')} alt="" className="w-24" />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-[#1F2937] border border-[#374151] p-4 sm:p-5 lg:p-6 flex items-center justify-center">
              <img src={getBrandSvg(selectedBrand.slug, selectedBrand.color)} alt={selectedBrand.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#E5E7EB] tracking-tight">{selectedBrand.name}</h1>
                <CheckCircle className="text-[#3B82F6] fill-[#3B82F6]/20 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#3B82F6] text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedBrand.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9CA3AF]">
                  <Globe size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Verified Brand
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#1F2937] rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-[#E5E7EB] hover:bg-[#1F2937] transition-all">
                Save Brand
            </button>
            <Button variant="primary" className="w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base shadow-blue-500/30">
                Apply for Deal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {[
            { label: 'Available Budget', value: selectedBrand.budget, desc: 'Per Campaign' },
            { label: 'Minimum Audience', value: selectedBrand.followers, desc: 'Verified Reach' },
            { label: 'Brand Health', value: 'Excellent', desc: 'Fast Payouts' }
          ].map((stat, i) => (
            <div key={i} className="p-4 sm:p-6 lg:p-8 bg-[#1F2937]/50 rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-[#374151]">
              <p className="text-[#9CA3AF] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-black text-[#E5E7EB] mb-1">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-[#3B82F6] font-bold italic">{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl">
          <h3 className="text-lg sm:text-xl font-black text-[#E5E7EB] mb-3 sm:mb-4 tracking-tight">Collaboration Focus</h3>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
            {selectedBrand.name} is looking for creative storytellers in the <span className="text-[#3B82F6] font-bold">{selectedBrand.category}</span> space. 
            We prioritize high-engagement creators who can authentically integrate our mission into their daily lifestyle. 
            Applicants should have a strong track record of audience trust and content quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
               Visit Website <ExternalLink size={14} className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
               View Instagram <Instagram size={14} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}