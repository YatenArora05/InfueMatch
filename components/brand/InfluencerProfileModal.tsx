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
  const [isContacting, setIsContacting] = useState(false);
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleReportInfluencer = async () => {
    if (!influencerId) return;

    setIsReporting(true);
    setReportMessage(null);

    try {
      const response = await axios.post(`/api/influencers/${influencerId}/report`);

      if (response.status === 200) {
        const { reportCount, isBlocked, message } = response.data || {};

        setInfluencer((prev: any) => ({
          ...prev,
          reportCount: reportCount ?? prev?.reportCount ?? 0,
          isBlocked: typeof isBlocked === 'boolean' ? isBlocked : prev?.isBlocked,
        }));

        setReportMessage({
          type: 'success',
          text: message || 'Influencer reported successfully',
        });
      }
    } catch (error: any) {
      console.error('Error reporting influencer:', error);
      setReportMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to report influencer. Please try again.',
      });
    } finally {
      setIsReporting(false);
    }
  };

  const handleContactInfluencer = async () => {
    if (!email) {
      setContactMessage({ type: 'error', text: 'Influencer email not available' });
      return;
    }

    setIsContacting(true);
    setContactMessage(null);

    try {
      const brandUserId = localStorage.getItem('userId');
      if (!brandUserId) {
        setContactMessage({ type: 'error', text: 'Please log in to contact influencers' });
        setIsContacting(false);
        return;
      }

      const response = await axios.post('/api/brand/contact-influencer', {
        influencerId,
        brandUserId,
      });

      if (response.status === 200) {
        setContactMessage({ 
          type: 'success', 
          text: 'Email sent successfully! The influencer will receive a notification.' 
        });
      }
    } catch (error: any) {
      console.error('Error contacting influencer:', error);
      setContactMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send email. Please try again.' 
      });
    } finally {
      setIsContacting(false);
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
  const reportCount: number = influencer?.reportCount ?? 0;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-[#020617] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#1F2937] shadow-2xl shadow-blue-900/30 animate-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#0B1120] rounded-full border border-[#1F2937] hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-colors text-[#9CA3AF] hover:text-white"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#9CA3AF] font-medium">Loading profile...</p>
            </div>
          </div>
        ) : influencer ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-8 pt-12">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white/30 shadow-xl">
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
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold border border-white/20"
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
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                    <Star size={16} className="text-yellow-300" />
                    <span>
                      Reports: {reportCount}
                      {influencer?.isBlocked && (
                        <span className="ml-2 text-red-200 font-bold">(Blocked)</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Bio Section */}
              {bio && (
                <div className="bg-[#0B1120] rounded-2xl p-6 border border-[#1F2937]">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={20} className="text-[#3B82F6]" />
                    <h3 className="text-lg font-bold text-[#E5E7EB]">About</h3>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed">{bio}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {email && (
                  <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                    <Mail size={20} className="text-[#3B82F6]" />
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Email</p>
                      <p className="text-[#E5E7EB] font-semibold">{email}</p>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                    <Phone size={20} className="text-[#3B82F6]" />
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Phone</p>
                      <p className="text-[#E5E7EB] font-semibold">{phone}</p>
                    </div>
                  </div>
                )}

                {location && location !== "Not specified" && (
                  <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                    <MapPin size={20} className="text-[#3B82F6]" />
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Location</p>
                      <p className="text-[#E5E7EB] font-semibold">{location}</p>
                    </div>
                  </div>
                )}

                {dob && (
                  <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                    <Calendar size={20} className="text-[#3B82F6]" />
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Date of Birth</p>
                      <p className="text-[#E5E7EB] font-semibold">{new Date(dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Section */}
              {(instagram.username || youtube.channel || facebook.username || twitter.username) && (
                <div>
                  <h3 className="text-lg font-bold text-[#E5E7EB] mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {instagram.username && (
                      <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                        <Instagram size={24} className="text-pink-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Instagram</p>
                          <p className="text-[#E5E7EB] font-semibold">@{instagram.username}</p>
                          {instagram.followers && (
                            <p className="text-sm text-[#9CA3AF]">{instagram.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {youtube.channel && (
                      <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                        <Youtube size={24} className="text-red-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">YouTube</p>
                          <p className="text-[#E5E7EB] font-semibold">{youtube.channel}</p>
                          {youtube.subscribers && (
                            <p className="text-sm text-[#9CA3AF]">{youtube.subscribers} subscribers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {facebook.username && (
                      <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                        <Facebook size={24} className="text-blue-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Facebook</p>
                          <p className="text-[#E5E7EB] font-semibold">{facebook.username}</p>
                          {facebook.followers && (
                            <p className="text-sm text-[#9CA3AF]">{facebook.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}

                    {twitter.username && (
                      <div className="flex items-center gap-3 p-4 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                        <Twitter size={24} className="text-sky-400" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Twitter</p>
                          <p className="text-[#E5E7EB] font-semibold">@{twitter.username}</p>
                          {twitter.followers && (
                            <p className="text-sm text-[#9CA3AF]">{twitter.followers} followers</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Contact Button */}
            <div className="sticky bottom-0 bg-[#020617] border-t border-[#1F2937] p-6">
              {(contactMessage || reportMessage) && (
                <div className="mb-4 space-y-2">
                  {contactMessage && (
                    <div
                      className={`p-3 rounded-xl ${
                        contactMessage.type === 'success'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      <p className="text-sm font-semibold text-center">{contactMessage.text}</p>
                    </div>
                  )}
                  {reportMessage && (
                    <div
                      className={`p-3 rounded-xl ${
                        reportMessage.type === 'success'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      <p className="text-sm font-semibold text-center">{reportMessage.text}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  onClick={handleContactInfluencer}
                  disabled={isContacting || !email}
                  className="w-full py-4 text-lg font-bold shadow-xl shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContacting ? "Sending..." : "Contact the Influencer"}
                </Button>
                <Button
                  onClick={handleReportInfluencer}
                  disabled={isReporting}
                  variant="secondary"
                  className="w-full py-4 text-lg font-bold border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReporting ? "Reporting..." : "Report Influencer"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#9CA3AF] font-medium">Failed to load profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

