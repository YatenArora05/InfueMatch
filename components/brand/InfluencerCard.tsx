"use client";

import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { generateAvatarSvg, svgToDataUrl } from '@/lib/utils';
import InfluencerProfileModal from './InfluencerProfileModal';

interface InfluencerCardProps {
  id: string;
  name: string;
  niche: string;
  followers: string;
  rate: string;
  profilePic?: string | null;
  platform?: string;
  color?: string;
}

export default function InfluencerCard({ 
  id, 
  name, 
  niche, 
  followers, 
  rate,
  profilePic 
}: InfluencerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Generate avatar SVG if no profile picture
  const avatarUrl = useMemo(() => {
    if (profilePic) {
      return profilePic;
    }
    const svg = generateAvatarSvg(name);
    return svgToDataUrl(svg);
  }, [name, profilePic]);

  return (
    <>
      <div className="bg-[#020617]/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-[#1F2937] shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all group">
        <div className="relative mb-6">
          <div className="w-full h-48 bg-[#0B1120] rounded-3xl overflow-hidden border border-[#1F2937]">
            <img 
              src={avatarUrl} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              alt={name}
            />
          </div>
          <div className="absolute top-3 right-3 bg-[#020617]/90 backdrop-blur-md p-2 rounded-xl text-amber-400 border border-[#1F2937]">
            <Star size={16} fill="currentColor" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xl font-black text-[#E5E7EB] leading-none">{name}</h4>
          <p className="text-sm font-bold text-[#3B82F6]">{niche || "No niche specified"}</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-[#1F2937] mt-4">
            <div>
              <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-1">Instagram Followers</p>
              <p className="font-bold text-[#E5E7EB]">{followers || "0"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-1">Est. Rate</p>
              <p className="font-bold text-[#E5E7EB]">{rate || "Not specified"}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative w-full mt-6 py-3 bg-[#3B82F6] text-white rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 border border-[#2563EB] hover:bg-[#2563EB] hover:border-[#60A5FA] shadow-lg shadow-blue-900/30"
        >
          <span className="relative z-10">View Profile</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[length:200%_100%] group-hover/btn:animate-shimmer"></span>
        </button>
      </div>

      <InfluencerProfileModal
        influencerId={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

