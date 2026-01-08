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
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all group">
        <div className="relative mb-6">
          <div className="w-full h-48 bg-gray-100 rounded-3xl overflow-hidden">
            <img 
              src={avatarUrl} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              alt={name}
            />
          </div>
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-xl text-amber-500">
            <Star size={16} fill="currentColor" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xl font-black text-gray-900 leading-none">{name}</h4>
          <p className="text-sm font-bold text-purple-600">{niche || "No niche specified"}</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Instagram Followers</p>
              <p className="font-bold text-gray-900">{followers || "0"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Est. Rate</p>
              <p className="font-bold text-gray-900">{rate || "Not specified"}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300"
        >
          <span className="relative z-10">View Profile</span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[length:200%_100%] group-hover/btn:animate-shimmer"></span>
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

