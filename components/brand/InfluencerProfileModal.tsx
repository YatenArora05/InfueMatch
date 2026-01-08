"use client";

import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, Instagram, Youtube, Facebook, Twitter, DollarSign, User as UserIcon, Calendar, MessageSquare, Star } from 'lucide-react';
import axios from 'axios';
import { generateAvatarSvg, svgToDataUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface InfluencerProfileModalProps {
  influencerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfluencerProfileModal({
  influencerId,
  isOpen,
  onClose,
}: InfluencerProfileModalProps) {
  const [influencer, setInfluencer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && influencerId) {
      fetchInfluencerProfile();
    }
  }, [isOpen, influencerId]);

  const fetchInfluencerProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/influencers/${influencerId}`);
      if (response.data?.influencer) {
        setInfluencer(response.data.influencer);
      }
    } catch (error) {
      console.error('Error fetching influencer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const firstName = influencer?.details?.firstName || "";
  const lastName = influencer?.details?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || influencer?.name || "";
  const email = influencer?.email || "";
  const phone = influencer?.details?.phone || "";
  const address = influencer?.details?.address || "";
  const city = influencer?.details?.city || "";
  const state = influencer?.details?.state || "";
  const zip = influencer?.details?.zip || "";
  const bio = influencer?.details?.bio || "";
  const estimatedRate = influencer?.details?.estimatedRate || "Not specified";
  const niche = influencer?.details?.niche || [];
  const dob = influencer?.details?.dob || "";   
  const profilePic = influencer?.details?.profilePic || null;

  const socials = influencer?.details?.socials || {};
  const instagram = socials.instagram || {};
  const youtube = socials.youtube || {};
  const facebook = socials.facebook || {};
  const twitter = socials.twitter || {};

  const avatarUrl = profilePic 
    ? profilePic 
    : svgToDataUrl(generateAvatarSvg(fullName));

  const location = [city, state, zip].filter(Boolean).join(", ") || "Not specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading profile...</p>
            </div>
          </div>
        ) : influencer ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 p-8 pt-12">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-3xl md:text-4xl font-black mb-2">{fullName}</h2>
                  {niche.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {niche.map((n: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                  {estimatedRate && estimatedRate !== "Not specified" && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} />
                      <span className="text-lg font-bold">{estimatedRate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Bio Section */}
              {bio && (
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={20} className="text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">About</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{bio}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {email && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                      <p className="text-gray-900 font-semibold">{email}</p>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                      <p className="text-gray-900 font-semibold">{phone}</p>
                    </div>
                  </div>
                )}

                {location && location !== "Not specified" && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-gray-900 font-semibold">{location}</p>
                    </div>
                  </div>
                )}

                {dob && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p>
                      <p className="text-gray-900 font-semibold">{new Date(dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Section */}
              {(instagram.username || youtube.channel || facebook.username || twitter.username) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {instagram.username && (
                      <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
                        <Instagram size={24} className="text-pink-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instagram</p>
                          <p className="text-gray-900 font-semibold">@{instagram.username}</p>
                          {instagram.followers && (
                            <p className="text-sm text-gray-600">{instagram.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {youtube.channel && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                        <Youtube size={24} className="text-red-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">YouTube</p>
                          <p className="text-gray-900 font-semibold">{youtube.channel}</p>
                          {youtube.subscribers && (
                            <p className="text-sm text-gray-600">{youtube.subscribers} subscribers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {facebook.username && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <Facebook size={24} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facebook</p>
                          <p className="text-gray-900 font-semibold">{facebook.username}</p>
                          {facebook.followers && (
                            <p className="text-sm text-gray-600">{facebook.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {twitter.username && (
                      <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100">
                        <Twitter size={24} className="text-sky-400" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Twitter</p>
                          <p className="text-gray-900 font-semibold">@{twitter.username}</p>
                          {twitter.followers && (
                            <p className="text-sm text-gray-600">{twitter.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Contact Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
              <Button
                onClick={() => {
                  // Handle contact action - you can implement this later
                  window.location.href = `mailto:${email}`;
                }}
                className="w-full py-4 text-lg font-bold shadow-xl shadow-purple-100"
              >
                Contact the Influencer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 font-medium">Failed to load profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

